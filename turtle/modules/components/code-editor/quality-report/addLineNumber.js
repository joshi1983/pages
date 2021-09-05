export function addLineNumber(div, lineNumber) {
	const lineNumberSpan = document.createElement('span');
	lineNumberSpan.innerText = `Line ${lineNumber}: `;
	div.insertBefore(lineNumberSpan, div.firstChild);
};