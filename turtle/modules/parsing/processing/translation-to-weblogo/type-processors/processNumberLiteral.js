export function processNumberLiteral(token, result) {
	const s = token.val.toLowerCase();
	if (s.startsWith('0x'))
		result.append('' + parseInt(s.substring(2), 16));
	else if (s.startsWith('#'))
		result.append('"' + s);
	else
		result.append(s);
};