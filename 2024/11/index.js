(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = true;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.readFile(inputFileName, {encoding: 'utf8'});
	const stones = input.trim().split(/\s+/g).map((n) => parseInt(n));

	end(doPartOne(), 55312);
	end(doPartTwo(), NaN);// does not say answer for part 2 example

	function applyStoneRule(stone) {
		if (stone === 0) {
			return [1];
		}

		const stoneStr = '' + stone;

		if (stoneStr.length % 2 === 0) {
			const midpoint = stoneStr.length / 2;

			return [parseInt(stoneStr.substring(0, midpoint)), parseInt(stoneStr.substring(midpoint, stoneStr.length))];
		}

		return [stone * 2024];
	}

	function main(MAX_BLINKS) {
		const start = new Date().getTime(); 
		let numStones = stones.length;

		function m(stone, numBlinks) {
			if (!(numBlinks < MAX_BLINKS)) {
				return;
			}

			const replacementStones = applyStoneRule(stone);

			if (replacementStones.length > 1) {
				numStones++;
			}

			replacementStones.forEach((newStone) => {
				m(newStone, numBlinks + 1);
			});
		}

		for (const stone of stones) {
			m(stone, 0);
		}

		const end = new Date().getTime();
		const diff = end - start;

		console.log('took ' + diff + 'ms');

		return numStones;
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
