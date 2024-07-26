class SudokuSolver {
	validate(puzzleString) {
		const puzzleRegex = /[^1-9.]/;

		if (puzzleRegex.test(puzzleString)) {
			return { error: "Invalid characters in puzzle" };
		}

		if (puzzleString.length != 81) {
			return { error: "Expected puzzle to be 81 characters long" };
		}

		return true;
	}

	checkRowPlacement(board, row, column, value) {
		//Check row placement
		let i;
		for (i = 0; i < 9; i++) {
			if (board[row][i] == value) {
				return false;
			}
		}
		return true;
	}

	checkColPlacement(board, row, column, value) {
		//Check column placement
		let i;
		for (i = 0; i < 9; i++) {
			if (board[i][column] == value) {
				return false;
			}
		}
		return true;
	}

	checkRegionPlacement(board, row, column, value) {
		//Check if value already exists in coordinates
		if (board[row][column] === value) {
			return "exists"; // Value already exists in the given cell.
		}

		//Check region placement
		let regionTopRow = parseInt(row / 3) * 3; // returns the top row position: 0, 3 or 6
		let regionLeftColumn = parseInt(column / 3) * 3; // returns the left column position: 0, 3 or 6

		let i;
		let j;
		for (i = regionTopRow; i < regionTopRow + 3; i++) {
			for (j = regionLeftColumn; j < regionLeftColumn + 3; j++) {
				if (board[i][j] == value) {
					return false;
				}
			}
		}
		return true;
	}

	getBoard(puzzleString) {
		const puzzleValues = puzzleString.split("");

		let board = [[], [], [], [], [], [], [], [], []];
		let boardRow = -1;
		let i;

		for (i = 0; i < puzzleValues.length; i++) {
			if (i % 9 === 0) {
				boardRow++;
			}
			board[boardRow].push(puzzleValues[i]);
		}
		return board;
	}

	solveFromCell(board, row, column) {
		//console.log("Attempting to solve row" + (row + 1) + ", column" + (column + 1));

		//Column 9 means it goes beyond the end of the puzzle so it returns to column 0 and adds 1 to row
		if (column === 9) {
			column = 0;
			row++;
		}

		//Row 9 means it is outside the board and the solution is complete
		if (row === 9) {
			return board;
		}

		//If the cell is already filled, move to the next cell in the same row
		if (board[row][column] !== ".") {
			return this.solveFromCell(board, row, column + 1);
		}

		// Check the three placement conditions
		const canPlace = (board, row, column, value) => {
			if (
				this.checkRowPlacement(board, row, column, value) === true &&
				this.checkColPlacement(board, row, column, value) === true &&
				this.checkRegionPlacement(board, row, column, value) === true
			) {
				return true;
			} else {
				return false;
			}
		};
		//Try to place the values
		/*
      1. Start with 1 and check if is okay to place in cell
      2. If yes, run the algorithm in the next cell and check if false is not returned
      3. If a solution is found then the board is returned
      4. if false is returned then the solution was not found, then empty the cell and try with the next value
    */
		let i;
		for (i = 1; i < 10; i++) {
			let valueToPlace = i.toString();
			//console.log("Trying with: ", valueToPlace);
			if (canPlace(board, row, column, valueToPlace)) {
				board[row][column] = valueToPlace;
				if (this.solveFromCell(board, row, column + 1) != false) {
					return this.solveFromCell(board, row, column + 1);
				} else {
					board[row][column] = "."; // Reset the cell to empty
				}
			}
		}

		//If no solution is found after trying all values in the current cell, return false
		return false;
		//end of function
	}

	convertBoardToString(board) {
		return board.flat().join("");
	}

	solve(puzzleString) {
		const originalBoard = this.getBoard(puzzleString);

		let solution = this.solveFromCell(originalBoard, 0, 0);
		console.log("Solved sudoku: ", solution);

		if (solution === false) {
			return false;
		} else {
			const solutionString = this.convertBoardToString(solution);
			console.log("Solved sudoku as string: ", solutionString);
			console.log("Solved solution length: ", solutionString.length);
			return solutionString;
		}
	}
}

module.exports = SudokuSolver;
