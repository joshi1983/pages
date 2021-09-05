import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export function dataTypeTokenToString(d) {
	if (d.type === ParseTreeTokenType.COLON &&
	d.children.length === 1)
		d = d.children[0];

	let result = '';
	while (d !== undefined) {
		if (typeof d.val === 'string')
			result += d.val;
		d = d.children[0];
	}
	return result;
};