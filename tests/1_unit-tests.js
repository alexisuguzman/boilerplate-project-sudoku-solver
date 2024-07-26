const chai = require("chai");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("Unit Tests", () => {
	test("Logic handles a valid puzzle string of 81 characters", () => {
		const puzzleString =
			"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
		assert.isTrue(solver.validate(puzzleString), "Expected puzzle to be valid");
	});

	test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", () => {
		const puzzleString =
			"5.3..2....7....3....1..67...3....5..9...7..8.2..6....4...91..4....8....2....7..1.a";
		assert.deepEqual(
			solver.validate(puzzleString),
			{ error: "Invalid characters in puzzle" },
			"Expected invalid characters error"
		);
	});

	test("Logic handles a puzzle string that is not 81 characters in length", () => {
		const puzzleString =
			"5.3..2....7....3....1..67...3....5..9...7..8.2..6....4...91..4....8....2....7..1";
		assert.deepEqual(
			solver.validate(puzzleString),
			{ error: "Expected puzzle to be 81 characters long" },
			"Expected length error"
		);
	});

	test("Logic handles a valid row placement", () => {
		const puzzleString =
			"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
		const board = solver.getBoard(puzzleString);
		assert.isTrue(
			solver.checkRowPlacement(board, 0, 1, "3"),
			"Expected valid row placement"
		);
	});

	test("Logic handles an invalid row placement", () => {
		const puzzleString =
			"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
		const board = solver.getBoard(puzzleString);
		assert.isFalse(
			solver.checkRowPlacement(board, 0, 1, "1"),
			"Expected invalid row placement"
		);
	});

	test("Logic handles a valid column placement", () => {
		const puzzleString =
			"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
		const board = solver.getBoard(puzzleString);
		assert.isTrue(
			solver.checkColPlacement(board, 0, 1, "3"),
			"Expected valid column placement"
		);
	});

	test("Logic handles an invalid column placement", () => {
		const puzzleString =
			"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
		const board = solver.getBoard(puzzleString);
		assert.isFalse(
			solver.checkColPlacement(board, 0, 1, "2"),
			"Expected invalid column placement"
		);
	});

	test("Logic handles a valid region (3x3 grid) placement", () => {
		const puzzleString =
			"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
		const board = solver.getBoard(puzzleString);
		assert.isTrue(
			solver.checkRegionPlacement(board, 0, 1, "3"),
			"Expected valid region placement"
		);
	});

	test("Logic handles an invalid region (3x3 grid) placement", () => {
		const puzzleString =
			"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
		const board = solver.getBoard(puzzleString);
		assert.isFalse(
			solver.checkRegionPlacement(board, 0, 1, "2"),
			"Expected invalid region placement"
		);
	});

	test("Valid puzzle strings pass the solver", () => {
		const puzzleString =
			"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
		const solution = solver.solve(puzzleString);
		assert.isString(solution, "Expected solution to be a string");
		assert.equal(
			solution.length,
			81,
			"Expected solution string to be 81 characters long"
		);
	});

	test("Invalid puzzle strings fail the solver", () => {
		const puzzleString =
			"553..2....7....3....1..67...3....5..9...7..8.2..6....4...91..4....8....2....7..1.";
		assert.isFalse(
			solver.solve(puzzleString),
			"Expected solver to return false for invalid puzzle string"
		);
	});

	test("Solver returns the expected solution for an incomplete puzzle", () => {
		const puzzleString =
			"1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
		const expectedSolution =
			"135762984946381257728459613694517832812936745357824196473298561581673429269145378";
		assert.equal(
			solver.solve(puzzleString),
			expectedSolution,
			"Expected solver to return the correct solution"
		);
	});
});
