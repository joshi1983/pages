import { binarySearch } from '../../../binarySearch.js';

function compareNumbers(num1, num2) {
	return num1 - num2;
}

export function indexToColRowIndex(code) {
	const lines = code.split('\n');
	const lineStartIndexes = [];
	let startIndex = 0;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		lineStartIndexes.push(startIndex);
		startIndex += (line.length + 1);
	}
	return function(index) {
		let lineIndex = binarySearch(lineStartIndexes, compareNumbers, index, true) - 1;
		if (lineIndex >= 0) {
			if (lineStartIndexes[lineIndex + 1] === index)
				lineIndex++;
			return {
				'lineIndex': lineIndex,
				'colIndex': index - lineStartIndexes[lineIndex]
			};
		}
		return {
			'colIndex': index,
			'lineIndex': 0
		};
	};
};