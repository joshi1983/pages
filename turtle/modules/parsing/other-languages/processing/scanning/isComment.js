export function isComment(scanToken) {
	const s = scanToken.s;
	if (s.startsWith('//'))
		return true;
	if (s.startsWith('/*'))
		return true;

	return false;
};