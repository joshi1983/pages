export function isStartingStringLiteral(s) {
	const ch = s.charAt(0);
	return ch === '"' || ch === '\'';
};