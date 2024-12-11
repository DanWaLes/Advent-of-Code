(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = false;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.readFile(inputFileName, {encoding: 'utf8'});

	end(doPartOne(), 1928);
	end(doPartTwo(), 2858);

	function doPartOne() {
		const diskmap = [];
		const FREE_SPACE_MARKER = '.';

		for (let i = 0, id = 0; i < input.length; id++) {
			let n = parseInt(input[i++]);

			for ( ; n > 0; n--) {
				diskmap.push(id);
			}

			n = parseInt(input[i++]);

			for ( ; n > 0; n--) {
				diskmap.push(FREE_SPACE_MARKER);
			}
		}

		// console.log('diskmap before moving files', JSON.stringify(diskmap));

		for (let i = diskmap.length - 1; i > -1; i--) {
			const freeSpaceIndex = diskmap.indexOf(FREE_SPACE_MARKER);

			if (freeSpaceIndex === -1) {
				break;
			}

			diskmap.splice(freeSpaceIndex, 1, diskmap.pop());
		}

		for (let i = diskmap.length - 1; i > -1; i--) {
			if (diskmap[i] === FREE_SPACE_MARKER) {
				diskmap.pop();
			}
			else {
				break;
			}
		}

		// console.log('diskmap after moving files', JSON.stringify(diskmap))

		let checksum = 0;

		diskmap.forEach((n, i) => {
			checksum += (i * n);
		});

		return checksum;
	}

	function doPartTwo() {
		// TODO
	}

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})()