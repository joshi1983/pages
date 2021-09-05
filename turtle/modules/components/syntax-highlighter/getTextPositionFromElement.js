export function getTextPositionFromElement(e) {
	const id = e.getAttribute('id');
	const parts = id.split('-');
	const lineNumber = parseInt(parts[parts.length - 2]);
	const colNumber = parseInt(parts[parts.length - 1]);
	return [lineNumber, colNumber];
};