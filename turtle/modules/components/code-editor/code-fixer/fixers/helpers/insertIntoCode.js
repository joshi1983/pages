import { StringBuffer } from '../../../../../StringBuffer.js';

export function insertIntoCode(code, locations, insertedString) {
	if (locations.length === 0)
		return code;
	let lineIndex = 0;
	let colIndex = 0;
	let bIndex = 0;
	let nextLocation = locations[0];
	const result = new StringBuffer();
	for (let i = 0; i < code.length; i++) {
		const ch = code[i];
		if (colIndex === nextLocation.colIndex &&
		lineIndex === nextLocation.lineIndex) {
			result.append(insertedString);
			nextLocation = locations[++bIndex];
			if (nextLocation === undefined) {
				result.append(code.substring(i));
				break;
			}
		}
		result.append(ch);
		if (ch === '\n') {
			colIndex = 0;
			lineIndex++;
		}
		else {
			colIndex++;
		}
	}
	return result.toString();
};