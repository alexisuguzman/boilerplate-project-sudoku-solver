"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
	let solver = new SudokuSolver();

	app.route("/api/check").post((req, res) => {
		const puzzle = req.body.puzzle;
		const coordinate = req.body.coordinate;
		const value = req.body.value;

		//check for missing values
		if (!puzzle || !coordinate || !value) {
			res.json({ error: "Required field(s) missing" });
			return;
		}

		//check for coordinate
		const coordinateRegex = /^[A-I][1-9]$/;
		if (!coordinateRegex.test(coordinate)) {
			console.log({ error: "Invalid coordinate" });
			res.json({ error: "Invalid coordinate" });
			return;
		}

		//check for value
		const valueRegex = /^[1-9]$/;
		if (!valueRegex.test(value)) {
			console.log({ error: "Invalid value" });
			res.json({ error: "Invalid value" });
			return;
		}

		//check for valid puzzle
		const isValid = solver.validate(puzzle);
		console.log("isValid: ", isValid);
		if (isValid !== true) {
			console.log(isValid);
			res.json(isValid);
			return;
		}

		console.log("coordinate to switch", coordinate[0]);
		console.log("Full Coordinate", coordinate);
		let row;
		const rowSwitch = (coordinate) => {
			switch (coordinate[0]) {
				case "A":
					row = 0;
					break;
				case "B":
					row = 1;
					break;
				case "C":
					row = 2;
					break;
				case "D":
					row = 3;
					break;
				case "E":
					row = 4;
					break;
				case "F":
					row = 5;
					break;
				case "G":
					row = 6;
					break;
				case "H":
					row = 7;
					break;
				case "I":
					row = 8;
					break;
				default:
					console.log({ error: "Invalid coordinate" });
					res.json({ error: "Invalid coordinate" });
					return;
			}
		};
		rowSwitch(coordinate);
		const column = parseInt(coordinate[1]) - 1;
		const board = solver.getBoard(puzzle);
		console.log("row:", row);

		const canPlaceRow = solver.checkRowPlacement(board, row, column, value);

		const canPlaceCol = solver.checkColPlacement(board, row, column, value);

		const canPlaceReg = solver.checkRegionPlacement(board, row, column, value);

		console.log("Can place in row: ", canPlaceRow);
		console.log("Can place in column: ", canPlaceCol);
		console.log("Can place in region: ", canPlaceReg);

		if (canPlaceReg === "exists") {
			console.log("Value already exists in coordinates");
			res.json({ valid: true });
			return;
		}

		if (!canPlaceRow || !canPlaceCol || !canPlaceReg) {
			res.json({
				valid: false,
				conflict: [
					!canPlaceRow ? "row" : "",
					!canPlaceCol ? "column" : "",
					!canPlaceReg ? "region" : "",
				].filter((item) => item),
			});
			return;
		} else {
			res.json({ valid: true });
		}
	});

	app.route("/api/solve").post((req, res) => {
		const puzzle = req.body.puzzle;
		console.log("Sudoku to solve: ", req.body.puzzle);

		if (!puzzle) {
			console.log({ error: "Required field missing" });
			res.json({ error: "Required field missing" });
			return;
		}

		const isValid = solver.validate(puzzle);
		console.log("isValid: ", isValid);
		if (isValid !== true) {
			console.log(isValid);
			res.json(isValid);
			return;
		}

		const solution = solver.solve(puzzle);
		console.log("Solved Sudoku: ", solution);
		if (solution !== false) {
			res.json({ solution: solution });
			return;
		} else {
			console.log({ error: "No solution found" });
			res.json({ error: "Puzzle cannot be solved" });
			return;
		}
	});
};
