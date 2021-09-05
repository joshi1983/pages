import { isStartingStringLiteral } from './isStartingStringLiteral.js';

export function isCompleteStringLiteral(s) {
	if (s.length < 2)
		return false;
	if (!isStartingStringLiteral(s))
		return false;
	if (s.charAt(s.length - 1) !== s.charAt(0))
		return false;
	let isEscaping = false;
	const limit = s.length - 1;
	for (let i = 1; i < limit; i++) {
		const ch = s.charAt(i);
		if (isEscaping === false && ch === '\\')
			isEscaping = true;
		else
			isEscaping = false;
	}
	return isEscaping === false;
};