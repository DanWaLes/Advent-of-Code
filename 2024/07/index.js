(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = false;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	// example input for part two is different
	const input = await fs.open(inputFileName);
	const results = {partOne: 0, partTwo: 0};

	for await (const line of input.readLines()) {
		const numbers = line.match(/\d+/g).map((number) => parseInt(number));
		const testValue = numbers.shift(0);

		processLine(testValue, numbers);
	}

	function processLine(testValue, numbers) {
		results.partOne += main(testValue, numbers, ['+', '*']);
		results.partTwo += main(testValue, numbers, ['+', '*', '||']);
	}

	function main(testValue, numbers, operators) {
		// console.log('\n');
		const queue = [];
		const uniqueValidTestValues = {};

		// accumulator, numberIndex, op
		operators.forEach((op) => {
			queue.push([0, 0, op]);
		});

		// console.log('testValue', testValue);
		// console.log('numbers', numbers);
		// console.log('numbers.length', numbers.length);

		while (queue.length > 0) {
			const item = queue.pop();
			// console.log(item);
			let numberIndex = item[1];
			const operandOne = numberIndex === 0 ? numbers[numberIndex] : item[0];
			const operandTwo = numberIndex === 0 ? numbers[numberIndex + 1] : numbers[++numberIndex];
			const op = item[2];

			// console.log('operandOne', operandOne);
			// console.log('operandTwo', operandTwo);

			switch (op) {
				case '+': {
					item[0] = operandOne + operandTwo;
					break;
				}
				case '*': {
					item[0] = operandOne * operandTwo;
					break;
				}
				case '||': {
					item[0] = Number(operandOne + '' + operandTwo);// incorrect
					break;
				}
				default: {
					throw new Error('unexpected operation: ' + op);
				}
			}

			item[1]++;

			// console.log('result', item[0]);

			if (item[0] === testValue) {
				// console.log('-------> is testValue');
				uniqueValidTestValues[testValue] = true;
				continue;
			}

			if (item[0] > testValue) {
				// console.log('is too high');
				continue;
			}

			if (item[1] < numbers.length - 1) {
				// console.log('trying next');
				operators.forEach((op) => {
					queue.push([item[0], item[1], op]);
				});
			}
		}

		let sum = 0;

		Object.keys(uniqueValidTestValues).forEach((key) => {
			sum += parseInt(key);
		});

		return sum;
	}

	end(results.partOne, 3749);
	end(results.partTwo, 11387);

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})();
