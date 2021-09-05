import { isDigit } from
'../../../isDigit.js';
import { StringUtils } from
'../../../StringUtils.js';

function isColonFound(line, startIndex) {
	for (let i = startIndex; i < line.length; i++) {
		const ch = line[i];
		if (ch === ':')
			return true;
		if (!StringUtils.isWhitespace(ch))
			return false;
	}
	return false;
}

function getIndexAfterLabel(line) {
	let i;
	let labelStarted = false;
	for (i = 0; i < line.length; i++) {
		const ch = line[i];
		if (isDigit(ch)) {
			labelStarted = true;
		}
		else if (StringUtils.isWhitespace(ch)) {
			if (labelStarted)
				return -1; // no space needed to be inserted.
		}
		else {
			if (labelStarted && !isColonFound(line, i))
				return i;

			return -1;
		}
	}
	return -1;
}

export function insertSpacesAfterIntegerLabels(code) {
	const lines = code.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const index = getIndexAfterLabel(line);
		if (index > 0) {
			const label = line.substring(0, index);
			const tail = line.substring(index);
			lines[i] = label + ' ' + tail;
		}
	}
	return lines.join('\n');
};