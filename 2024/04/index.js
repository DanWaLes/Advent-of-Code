(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = false;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.open(inputFileName);
	const chars = [];

	for await (const line of input.readLines()) {
		const arr = [];

		for (let c of line) {
			arr.push(c);
		}

		chars.push(arr);
	}

	function hasWordChar(word, charNum, i, j) {
		if (i < 0 || i >= chars.length || j < 0 || j >= chars[i].length) {
			return false;
		}

		return chars[i][j] === word[charNum];
	}

	function searchForWord(word, onWordFound) {
		function wordFound(word, i, j, changeInI, changeInJ, onWordFound) {
			onWordFound(word, i, j, changeInI, changeInJ);
		}

		function findWord(word, i, j) {
			if (word.length === 1) {
				return wordFound(word, i, j, 0, 0, onWordFound);
			}

			for (let changeInI = -1; changeInI < 2; changeInI++) {
				for (let changeInJ = -1; changeInJ < 2; changeInJ++) {
					if (changeInI === 0 && changeInJ === 0) {
						continue;
					}

					let charNum = 1;
					let i2 = i + changeInI;
					let j2 = j + changeInJ;

					if (!hasWordChar(word, charNum, i2, j2)) {
						continue;
					}

					let charsFound = ++charNum;

					for (; charNum < word.length; charNum++) {
						i2 += changeInI;
						j2 += changeInJ;

						if (hasWordChar(word, charNum, i2, j2)) {
							charsFound++;
						}
						else {
							break;
						}
					}

					if (charsFound === word.length) {
						wordFound(word, i, j, changeInI, changeInJ, onWordFound);
					}
				}
			}
		}

		for (let i = 0; i < chars.length; i++) {
			for (let j = 0; j < chars[i].length; j++) {
				if (hasWordChar(word, 0, i, j)) {
					findWord(word, i, j, onWordFound);
				}
			}
		}
	}

	function doPartOne() {
		let freq = 0;

		searchForWord('XMAS', (word, i, j, changeInI, changeInJ) => {
			freq++
		});

		return freq;
	}

	function doPartTwo() {
		const word = 'MAS';
		let xMasCount = 0;

		for (let i = 1; i < chars.length - 1; i++) {
			for (let j = 1; j < chars[i].length - 1; j++) {
				if (chars[i][j] !== 'A') {
					continue;
				}

				if (!(
					['M', 'S'].includes(chars[i - 1][j - 1]) &&
					['M', 'S'].includes(chars[i - 1][j + 1]) &&
					['M', 'S'].includes(chars[i + 1][j - 1]) &&
					['M', 'S'].includes(chars[i + 1][j + 1])
				)) {
					continue;
				}

				xMasCount += Number(
					(chars[i + 1][j + 1] !== chars[i - 1][j - 1]) &&
					(chars[i + 1][j - 1] !== chars[i - 1][j + 1])
				);
			}
		}

		return xMasCount;
	}

	end(doPartOne(), 18);
	end(doPartTwo(), 9);

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})();
