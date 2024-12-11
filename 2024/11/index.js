(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = true;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.readFile(inputFileName, {encoding: 'utf8'});
	const initialStones = input.trim().split(/\s+/g).map((n) => parseInt(n));

	end(doPartOne(), 55312);
	end(doPartTwo());// does not say answer for part 2 example

	function applyStoneRule(stoneStr) {
		if (stoneStr === '0') {
			return [1];
		}

		if (stoneStr.length % 2 === 0) {
			const midpoint = stoneStr.length / 2;

			return [parseInt(stoneStr.substring(0, midpoint)), parseInt(stoneStr.substring(midpoint, stoneStr.length))];
		}

		return [parseInt(stoneStr) * 2024];
	}

	function main(MAX_BLINKS) {
		// adapted from https://github.com/BigBear0812/AdventOfCode/blob/master/2024/Day11.js

		let stones = {};

		for (const stone of initialStones) {
			if (!stones[stone]) {
				stones[stone] = 0;
			}

			stones[stone]++;
		}

		for (let i = 0; i < MAX_BLINKS; i++) {
			const newStones = {};

			for (const [num, count] of Object.entries(stones)) {
				applyStoneRule(num).forEach((stone) => {
					newStones[stone] = (newStones[stone] || 0) + count;
				});
			}

			stones = newStones;
		}

		return Object.values(stones).reduce((a, b) => a + b);
	}

	function doPartOne() {
		return main(25);
	}

	function doPartTwo() {
		return main(75);
	}

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})();
