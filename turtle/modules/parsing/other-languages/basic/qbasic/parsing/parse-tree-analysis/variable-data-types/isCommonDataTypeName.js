import { numberNames } from './numberNames.js';

const otherTypeNames = new Set([
'_mem', '_offset', 'string']);

export function isCommonDataTypeName(s) {
	s = s.toLowerCase();
	return numberNames.has(s) ||
		otherTypeNames.has(s);
};