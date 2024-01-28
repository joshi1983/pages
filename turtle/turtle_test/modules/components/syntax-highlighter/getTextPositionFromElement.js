function processInfo(s, lineNumber, colNumber) {
	const lines = s.split('\n');
	const lineCount = lines.length - 1;
	if (lineCount === 0)
		colNumber += s.length;
	else
		colNumber = lines[lines.length - 1].length;
	return {
		'lineCount': lineNumber + lineCount,
		'colCount': colNumber
	};
}

function getTextPositionOf(e, container) {
	let lineNumber = 0, colNumber = 0;
	for (let child = container.firstChild; child !== null; child = child.nextSibling) {
		if (child === e) {
			// assuming there are no line breaks in e's innerText.
			return [lineNumber, colNumber + e.innerText.length - 1];
		}
		else if (child instanceof Element) {
			const pos = getTextPositionOf(e, child);
			if (pos !== undefined) {
				if (pos[0] === 0)
					return [lineNumber, pos[1] + colNumber];
				else
					return [pos[0] + lineNumber, pos[1]];
			}
			let count;
			if (child.tagName === 'DIV') {
				count = {
					'lineCount': lineNumber + 1,
					'colCount': 0
				};
			}
			else
				count = processInfo(child.innerText, lineNumber, colNumber);
			lineNumber = count.lineCount;
			colNumber = count.colCount;
		}
		else if (child.nodeType === Node.TEXT_NODE) {
			const count = processInfo(child.nodeValue, lineNumber, colNumber);
			lineNumber = count.lineCount;
			colNumber = count.colCount;
		}
	}
}

export function getTextPositionFromElement(e, container) {
	if (!(container instanceof Element))
		throw new Error(`container must be an Element.  Not: ${container}`);
	return getTextPositionOf(e, container);
};