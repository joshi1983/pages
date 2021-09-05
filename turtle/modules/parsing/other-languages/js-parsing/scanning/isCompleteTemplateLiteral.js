/*
Template literals are documented at:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
*/
export function isCompleteTemplateLiteral(s) {
	if (s.length < 2)
		return false;
	if (s[0] !== '`' || s[s.length - 1] !== '`')
		return false;
	for (let i = 1; i < s.length; i++) {
		const ch = s[i];
		if (i === s.length - 1 && ch === '`')
			return true;
		if (ch === '\\') {
			i++;
		}
	}
	return false;
};