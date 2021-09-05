import { pseudoClassNames } from './pseudoClassNames.js';

export function isStartOfPseudoClass(s) {
	if (s[0] !== ':')
		return false;
	if (s === '::' || s === ':')
		return true;
	if (s.startsWith('::'))
		s = s.substring(2);
	else
		s = s.substring(1);

	for (const name of pseudoClassNames) {
		if (name === s || name.startsWith(s))
			return true;
	}
	return false;
};