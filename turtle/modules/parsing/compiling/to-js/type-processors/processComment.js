export function processComment(token, result) {
	let s = token.val;
	if (s[0] === ';')
		s = '//' + s.substring(1);

	result.append(s);
};