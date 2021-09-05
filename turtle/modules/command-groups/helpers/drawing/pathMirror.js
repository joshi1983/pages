import { arcLinesInfo } from './arcLinesInfo.js';

function isSharpTurn(element) {
	return element.length === 2 &&
		element[1] === 0;
}

function trimSharpTurns(arcLinesData) {
	let i;
	for (i = 0; i < arcLinesData.length; i++) {
		const element = arcLinesData[i];
		if (!isSharpTurn(element)) {
			break;
		}
	}
	if (i !== 0)
		arcLinesData.splice(0, i); // remove the preceding sharp turns.
	for (i = arcLinesData.length - 1; i >= 0; i--) {
		const element = arcLinesData[i];
		if (!isSharpTurn(element)) {
			break;
		}
	}
	if (i < arcLinesData.length - 1)
		arcLinesData.length = i + 1; // remove the trailing sharp turns.
}

export function pathMirror(arcLinesData) {
	const result = arcLinesData.slice();
	trimSharpTurns(result);
	const trimmed = result.slice();
	const info = arcLinesInfo(trimmed);
	let angleDifference = info[2];
	if (angleDifference !== 0) {
		result.unshift([angleDifference, 0]);
	}
	angleDifference = 180 + (angleDifference - info[0]) * 2;
	if (angleDifference !== 0) {
		result.push([-angleDifference, 0]);
	}
	return result.concat(trimmed.reverse());
};