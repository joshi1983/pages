const lineBreak1 = '\\\n';
const lineBreak2 = '\\\r\n';

export function isEscapedLineBreak(s) {
	return lineBreak1 === s || lineBreak2 === s;
};