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
		const midpoint = stoneStr.length / 2;

		if (stoneStr.length % 2 === 0) {
			return [parseInt(stoneStr.substring(0, midpoint)), parseInt(stoneStr.substring(midpoint, stoneStr.length))];
		}

		return [stone * 2024];
	}

	function main(MAX_BLINKS) {
		const queue = [stones];
		let numBlinks = 0;
		let stonesAfterXBlinks;

		while (queue.length > 0) {
			const prevStones = queue.pop();
			const newStones = [];

			for (const stone of prevStones) {
				applyStoneRule(stone).forEach((newStone) => {
					newStones.push(newStone);
				});
			}

			numBlinks++;

			if (numBlinks < MAX_BLINKS) {
				queue.push(newStones);
			}
			else {
				stonesAfterXBlinks = newStones;
			}
		}

		return stonesAfterXBlinks.length;
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