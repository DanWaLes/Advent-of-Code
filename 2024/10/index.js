(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = true;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.open(inputFileName);

	const map = [];

	for await (const line of input.readLines()) {
		map.push(line.split('').map(n => parseInt(n)));
	}

	const LOWEST = 0;
	const HIGHEST = 9;
	const trailheads = {};

	end(doPartOne(), 36);
	end(doPartTwo(), 3);

	function check(i, j, changeInI, changeInJ, startI, startJ) {
		const newI = i + changeInI;
		const newJ = j + changeInJ;

		if (newI < 0 || newI >= map.length || newJ < 0 || newJ >= map[newI].length) {
			// not on the map
			return;
		}

		if (isNaN(map[newI][newJ])) {
			// cant access that position
			return;
		}

		if (map[newI][newJ] === map[i][j] - 1) {
			if (map[newI][newJ] === LOWEST) {
				if (!trailheads[newI]) {
					trailheads[newI] = {};
				}

				if (!trailheads[newI][newJ]) {
					trailheads[newI][newJ] = {};
				}

				trailheads[newI][newJ][startI + '_' + startJ] = true;
			}
			else { 
				checkAll(newI, newJ, startI, startJ);
			}
		}
	}

	function checkAll(i, j, startI, startJ) {
		// check up, down, left, right

		check(i, j, -1, 0, startI, startJ);
		check(i, j, 1, 0, startI, startJ);
		check(i, j, 0, -1, startI, startJ);
		check(i, j, 0, 1, startI, startJ);
	}

	function doPartOne() {
		for (let i = 0; i < map.length; i++) {
			for (let j = 0; j < map[i].length; j++) {
				if (map[i][j] === HIGHEST) {
					checkAll(i, j, i, j);
				}
			}
		}

		let trailheadScore = 0;

		for (const [key, obj] of Object.entries(trailheads)) {
			for (const [key2, obj2] of Object.entries(obj)) {
				trailheadScore += Object.keys(obj2).length;
			}
		}

		return trailheadScore;
	}

	function doPartTwo() {
		// TODO
	}

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})();