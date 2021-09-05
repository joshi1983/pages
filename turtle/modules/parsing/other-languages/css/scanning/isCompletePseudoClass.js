import { pseudoClassNames } from './pseudoClassNames.js';

const nameSet = new Set(pseudoClassNames);

export function isCompletePseudoClass(s) {
	if (s[0] !== ':')
		return false;
	let ending = s.substring(1);
	if (ending[0] === ':')
		ending = ending.substring(1);
	return nameSet.has(ending);
};