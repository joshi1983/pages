export function charIndexToParseTreeTokenPosition(index, s) {
	if (typeof index !== 'number')
		throw new Error('index must be a number.  Not: ' + index);
	if (typeof s !== 'string')
		throw new Error('s must be a string.  Not: ' + s);

	const substr = s.substring(0, index);
	const lineIndex = substr.split('\n').length - 1;
	const lastLineBreakIndex = substr.lastIndexOf('\n');
	const colIndex = lastLineBreakIndex === -1 ? index : index - lastLineBreakIndex - 1;
	return {
		'lineIndex': lineIndex,
		'colIndex': colIndex
	};
};