// line should be a whitespaces.
function countRepeats(line, substr) {
	if (line.length % substr.length !== 0)
		return; // indicate not matching an integer sequence of substr repeats.

	const maxI = line.length / substr.length;
	for (let i = 0; i < maxI; i++) {
		if (!line.startsWith(substr, i * substr.length))
			return; // indicate not matching a sequence of repeats of substr.
	}
	return maxI;
}

function getIndentStr(code) {
	let result;
	const lines = code.split('\n');
	if (lines.length < 2)
		return; // give up immediately if there aren't even 2 lines of code.

	let lastWhitespaces = '';
	const prefixes = [];
	for (const line of lines) {
		const trimmedLine = line.trim();
		if (trimmedLine !== '') {
			const index = line.indexOf(trimmedLine);
			const leadingWhitespaces = line.substring(0, index);
			if (leadingWhitespaces.length > lastWhitespaces.length) {
				if (leadingWhitespaces.startsWith(lastWhitespaces)) {
					const delta = leadingWhitespaces.substring(lastWhitespaces.length);
					if (result !== undefined && result !== delta)
						return; // inconsistent so return undefined.

					result = delta;
				}
			}
			prefixes.push(leadingWhitespaces);
			lastWhitespaces = leadingWhitespaces;
		}
	}
	if (result !== undefined) {
		for (const prefix of prefixes) {
			const numRepeats = countRepeats(prefix, result);
			if (numRepeats === undefined)
				return;
		}
	}
	return result;
}

export function replaceInvalidIndentationSymbols(code) {
	// if any docstring or long string literal is likely found, do nothing.
	// The multiline aspect of docstring and long string literals complicate
	// how this works too much.
	// A multiline token might lead to unwanted changes to the code here.
	if (code.indexOf('"""') !== -1 || code.indexOf('\'\'\'') !== -1)
		return code;
	
	const indentStr = getIndentStr(code);
	if (indentStr !== undefined && indentStr !== '\t') {
		const fromLines = code.split('\n');
		const lines = [];
		for (const line of fromLines) {
			const trimmed = line.trim();
			if (trimmed !== '') {
				const index = line.indexOf(trimmed);
				const prefix = line.substring(0, index);
				const num = Math.ceil(prefix.length / indentStr.length);
				const toPrefix = '\t'.repeat(num);
				lines.push(toPrefix + line.substring(prefix.length));
			}
			else
				lines.push(line);
		}
		return lines.join('\n');
	}
	return code;
};