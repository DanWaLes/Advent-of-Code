(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = true;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.open(inputFileName);

	let partOneAns = 0;
	let partTwoAns = 0;

	for await (const line of input.readLines()) {
		const report = line.split(/\s+/g).map((number) => Number(number));

		partOneAns += processPartOneReport(report);
		partTwoAns += processPartTwoReport(report);
	}

	end(partOneAns, 2);
	end(partTwoAns, 4);

	function reportIsSafe(report, start) {
		if (!(typeof start === 'number' && start >= 0)) {
			throw new Error('start is missing or less than 0');
		}

		const levelsMustBeIncreasing = report[0] < report[1];

		for (let i = start; i < report.length - 1; ) {
			const currentLevel = report[i];
			const nextLevel = report[++i];
			let diff = nextLevel - currentLevel;

			if (!levelsMustBeIncreasing) {
				diff = -diff;
			}

			if (!(diff >= 1 && diff <= 3)) {
				return i;
			}
		}

		return true;
	}

	function processPartOneReport(report) {
		return reportIsSafe(report, 0) === true ? 1 : 0;
	}

	function processPartTwoReport(report) {
		// remove at most one level to make a report safe

		const useSlowSolutionThatWorks = true;

		if (useSlowSolutionThatWorks) {
			for (let i = 0; i < report.length; i++) {
				const removed = report.splice(i, 1)[0];

				if (reportIsSafe(report, 0) === true) {
					return 1;
				}

				report.splice(i, 0, removed);
			}

			return 0;
		}

		// FIXME there's a logic error somewhere in this which gives the incorrect answer when ran against my actual input

		const failIndex = reportIsSafe(report, 0);

		if (failIndex === true) {
			// console.log('passed first time');
			return 1;
		}

		const startIndex = (() => {
			let i = failIndex - 2;

			while (i < 0) {
				i++;
			}
	
			return i;
		})();

		console.log('\nreport', JSON.stringify(report));
		console.log('failIndex', failIndex);
		console.log('startIndex', startIndex);

		const aIndex = failIndex - 1;
		const a = report.splice(aIndex, 1)[0];

		console.log('removed', a, 'from index', aIndex);
		console.log('report is now', JSON.stringify(report));

		if (startIndex < 0) {
			startIndex++;
		}

		if (reportIsSafe(report, startIndex) === true) {
			console.log('passed second time');
			return 1;
		}

		report.splice(aIndex, 0, a);
		console.log('unremoved', a);
		console.log('(report is now', JSON.stringify(report) + ')');

		const bIndex = failIndex;
		const b = report.splice(bIndex, 1)[0];
		console.log('removed', b, 'from index', bIndex);
		console.log('report is now', JSON.stringify(report));

		if (reportIsSafe(report, startIndex) === true) {
			console.log('passed third time');
			return 1;
		}

		console.log('failed');

		return 0;
	}

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})();
