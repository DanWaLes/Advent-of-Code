(async () => {
	const fs = require('fs/promises');

	const usingExampleInput = false;
	const inputFileName = (usingExampleInput ? 'example_' : '') + 'input.txt';
	const input = await fs.open(inputFileName);
	const map = [];
	const positionsGuardVisited = {};
	const initialGuardPosition = [];
	const GUARD_MARKER = '^';
	const OBSTRUCTION_MARKER = '#';
	let lineNum = -1;

	for await (const line of input.readLines()) {
		lineNum++;
		const arr = [];
		const p1Arr = [];

		for (const [j, c] of Object.entries(line)) {
			if (c === GUARD_MARKER) {
				guardVistiedPosition(lineNum, parseInt(j));
				initialGuardPosition.splice(0, 0, lineNum, parseInt(j));
			}

			arr.push(c);
		}

		map.push(arr);
	}

	end(doPartOne(), 41);
	end(doPartTwo(), 6);

	function guardVistiedPosition(i, j) {
		if (!positionsGuardVisited[i]) {
			positionsGuardVisited[i] = {};
		}

		positionsGuardVisited[i][j] = true;
	}

	function guardWillNoLongerBeOnMap(i, j) {
		return (i < 0 || i >= map.length || j < 0 || j >= map[i].length);
	}

	function guardCanMoveToPos(i, j) {
		if (guardWillNoLongerBeOnMap(i, j)) {
			return true;
		}

		return map[i][j] !== OBSTRUCTION_MARKER;
	}

	function rotateGuard90Degrees(currentChangeInI, currentChangeInJ) {
		const newChangeInDirection = [];

		if (currentChangeInI === -1 && currentChangeInJ === 0) {
			newChangeInDirection.splice(0, 0, 0, 1);
		}
		else if (currentChangeInI === 0 && currentChangeInJ === 1) {
			newChangeInDirection.splice(0, 0, 1, 0);
		}
		else if (currentChangeInI === 1 && currentChangeInJ === 0) {
			newChangeInDirection.splice(0, 0, 0, -1);
		}
		else if (currentChangeInI === 0 && currentChangeInJ === -1) {
			newChangeInDirection.splice(0, 0, -1, 0);
		}
		else {
			console.error(currentChangeInI, currentChangeInJ);
			throw new Error('unexpected change in i and j');
		}

		return newChangeInDirection;
	}

	function moveGuard(i, j, changeInI, changeInJ) {
		const nextI = i + changeInI;
		const nextJ = j + changeInJ;

		if (guardCanMoveToPos(nextI, nextJ)) {
			if (guardWillNoLongerBeOnMap(nextI, nextJ)) {
				return;
			}

			guardVistiedPosition(nextI, nextJ);
			moveGuard(nextI, nextJ, changeInI, changeInJ);
		}
		else {
			const newChangeInDirection = rotateGuard90Degrees(changeInI, changeInJ);

			moveGuard(i, j, newChangeInDirection[0], newChangeInDirection[1]);
		}
	}

	function doPartOne() {
		// starts off pointing up
		moveGuard(initialGuardPosition[0], initialGuardPosition[1], -1, 0);

		let numUniquePositionsGuardVisted = 0;

		for (const [i, obj] of Object.entries(positionsGuardVisited)) {
			for (const [j, visited] of Object.entries(obj)) {
				numUniquePositionsGuardVisted++;
			}
		}

		return numUniquePositionsGuardVisted;
	}

	function doPartTwo() {
		// make the guard get stuck in an infinite loop
		return;
	}

	function end(answer, exampleAnswer) {
		let msg = answer;

		if (usingExampleInput) {
			msg += ' is ' + (answer === exampleAnswer ? '' : 'in') + 'correct';
		}

		console.log(msg);
	}
})();