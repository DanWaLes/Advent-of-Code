(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = false;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.open(inputFileName);

	let inUpdates = false;
	const rules = {};
	const updates = [];

	for await (const line of input.readLines()) {
		if (!line.length) {
			inUpdates = true;
			continue;
		}

		const numbers = line.match(/\d+/g).map((n) => parseInt(n));

		if (inUpdates) {
			updates.push(numbers);
		}
		else {
			if (!rules[numbers[0]]) {
				rules[numbers[0]] = [];
			}

			rules[numbers[0]].push(numbers[1]);
		}
	}

	end(doPartOne(), 143);
	end(doPartTwo(), 123);

	function isValidUpdate(update) {
		for (let i = 0; i < update.length; i++) {
			const pageNum = update[i];

			if (rules[pageNum]) {
				// make sure that the page number is not used before any pages in its rules

				for (const rulePageNum of rules[pageNum]) {
					for (let j = 0; j < i; j++) {
						if (update[j] === rulePageNum) {
							//  console.log('invalid')
							return false;
						}
					}
				}
			}
		}

		return true;
	}

	function fixUpdate(update) {
		// TODO
		return update;
	}

	function doPartOne() {
		let total = 0;

		for (const update of updates) {
			if (isValidUpdate(update)) {
				total += update[Math.floor(update.length / 2)];
			}
		}

		return total;
	}

	function doPartTwo() {
		let total = 0;

		for (const update of updates) {
			if (!isValidUpdate(update)) {
				const fixedUpdate = fixUpdate(update);

				total += fixedUpdate[Math.floor(update.length / 2)];
			}
		}

		return total;
	}

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})();