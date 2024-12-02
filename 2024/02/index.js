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

	function reportIsSafe(report) {
		const levelsMustBeIncreasing = report[0] < report[1];

		for (let i = 0; i < report.length - 1; ) {
			const currentLevel = report[i];
			const nextLevel = report[++i];
			let diff = nextLevel - currentLevel;

			if (!levelsMustBeIncreasing) {
				diff = -diff;
			}

			if (!(diff >= 1 && diff <= 3)) {
				return false;
			}
		}

		return true;
	}

	function processPartOneReport(report) {
		return reportIsSafe(report) ? 1 : 0;
	}

	function processPartTwoReport(report) {
		// remove at most one level to make a report safe - no need to specifically see if the report is fine without needing to remove
		// there should be a way to optimise this, but trying to is too complex, so this'll do

		for (let i = 0; i < report.length; i++) {
			const removed = report.splice(i, 1);

			if (reportIsSafe(report)) {
				return 1;
			}

			report.splice(i, 0, removed);
		}

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