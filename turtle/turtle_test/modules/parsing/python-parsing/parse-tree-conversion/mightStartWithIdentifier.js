/*
If a string starts with any of the following, it can't be a python identifier.
*/
const invalidStarts = new Set([
'[', ']', ':', '{', '}', '"', '!', '@', '#', '$', '%', '^', '&',
'*','+','-', '/', '(', ')', '|', '<', '>', ',', '?','0','1','2','3','4','5','6','7','8','9'
]);

export function mightStartWithIdentifier(token) {
	if (token.children !== undefined) {
		for (token = token.children[0]; token.children !== undefined && token.children.length > 0; token = token.children[0]);
	}
	if (token.symbol !== undefined) {
		let text = token.symbol.text;
		if (text.length > 1)
			text = text[0];
		if (invalidStarts.has(text))
			return false;
	}
	return true;
};