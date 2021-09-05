import { isValidProcedureName } from './isValidProcedureName.js';

export function isInvalidProcStart(s) {
	s = s.substring(1).trim();
	if (s.trim() === '')
		return true;
	let index = s.indexOf(' ');
	if (index !== -1)
		s = s.substring(0, index);
	if (!isValidProcedureName(s))
		return true;
	return false;
};