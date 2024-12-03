(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = true;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.readFile(inputFileName, {encoding: 'utf8'});

	const mulRe = /mul\((\d+)\,(\d+)\)/;

	function doMul(mul) {
		return mul.match(mulRe).map((str) => Number(str)).reduce((a, b) => ((isNaN(a) && 1) || a) * b);
	}

	const partOneAns = ((input.match(new RegExp(mulRe, 'g')) || []).map((mul) => doMul(mul))).reduce((a, b) => a + b);
	const partTwoAns = doPartTwo(input);

	function doPartTwo(input) {
		if (usingExampleInput) {
			input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
		}

		const doRe = /do\(\)/;
		const dontRe = /don't\(\)/;
		const re = new RegExp(`(?:${mulRe.source})|(?:${doRe.source})|(?:${dontRe.source})`, 'g');
		let canMul = true;

		return input.match(re)
			.map((match) => {
				if (match.match(doRe)) {
					canMul = true;
				}
				else if (match.match(dontRe)) {
					canMul = false;
				}
				else if (canMul && match.match(mulRe)) {
					return doMul(match);
				}

				return 0;
			})
			.reduce((a, b) => a + b);
	}

	end(partOneAns, 161);
	end(partTwoAns, 48);

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})();
