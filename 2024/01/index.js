(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = true;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.open(inputFileName);

	// get numbers from the input and put them into columns

	const columns = [[], []];

	for await (const line of input.readLines()) {
		const lineNumbers = line.match(/\d+/g);

		for (const [i, number] of Object.entries(lineNumbers)) {
			columns[i].push(Number(number));
		}
	}

	doPartOne(columns);
	doPartTwo(columns);

	function doPartOne(columns) {
		// sort column data, smallest to largest

		columns.forEach((column) => {
			column.sort((a, b) => a - b);
		});

		// put columns into rows

		const rows = [];

		columns[0].forEach(() => {
			rows.push([]);
		})

		columns.forEach((column) => {
			column.forEach((number, i) => {
				rows[i].push(number);
			})
		});

		// sort row data, smallest to largest

		rows.forEach((row) => {
			row.sort((a, b) => a - b);
		});

		// for each row add up (largest - smallest)

		let total = 0;

		rows.forEach((row) => {
			const smallest = row[0];
			const largest = row[row.length - 1];

			total += (largest - smallest);
		});

		end(total, 11);
	}

	function doPartTwo(columns) {
		// find out the amount of times each number is used in each column

		const freqs = [{}, {}];

		columns.forEach((column, i) => {
			column.forEach((number) => {
				const key = '' + number;

				if (!freqs[i][key]) {
					freqs[i][key] = 0;
				}

				freqs[i][key]++;
			});
		});

		// find out which keys are shared between both columns
		// and multiply the common numbers by the amount of times they are used in the left and right columns

		let total = 0;

		for (const [key, leftTimes] of Object.entries(freqs[0])) {
			const rightTimes = freqs[1][key];

			if (rightTimes) {
				total += (Number(key) * leftTimes * rightTimes);
			}
		}

		end(total, 31);
	}

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})();