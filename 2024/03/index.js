(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = false;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.readFile(inputFileName, {encoding: 'utf8'});

	const mulRe = /mul\((\d+)\,(\d+)\)/;

	function doMul(mul) {
		return mul.match(mulRe).map((str) => Number(str)).filter((a) => !isNaN(a)).reduce((a, b) => a * b);
	}

	const partOneAns = ((input.match(new RegExp(mulRe, 'g')) || []).map((mul) => doMul(mul))).reduce((a, b) => a + b);
	const partTwoAns = doPartTwo(input);

	function search(str, regex, startIndex) {
		startIndex = parseInt(startIndex);

		if (startIndex < 0 || !isFinite(startIndex)) {
			startIndex = 0;
		}

		str = str.substring(startIndex, str.length);

		const i = str.search(regex);

		if (i === -1) {
			return {index: i, match: null};
		}

		return {index: startIndex + i, match: str.match(regex)};
	}

	function doPartTwo(input) {
		if (usingExampleInput) {
			input = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
		}

		let i = 0;
		let canMul = true
		let ans = 0;

		while (true) {
			const mulFn = search(input, mulRe, i);
			const doFn = search(input, /do\(\)/, i);
			const dontFn = search(input, /don't\(\)/, i);
			const min = [doFn, dontFn, mulFn].filter((a, b) => a.index > -1).sort((a, b) => a.index - b.index)[0];

			if (mulFn.index === -1) {
				break;
			}

			if (min === dontFn) {
				canMul = false;
			}
			else if (min === doFn) {
				canMul = true;
			}
			else if (canMul && min === mulFn) {
				ans += doMul(mulFn.match[0]);
			}

			i = (min.index + min.match[0].length);
		}

		return ans;
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