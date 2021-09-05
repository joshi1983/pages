import { validateIdentifier } from
'../../../../../../parsing/parse-tree-analysis/validateIdentifier.js';

export function isIdentifier(s) {
	if (!isNaN(s))
		return false;
	return validateIdentifier(s) === undefined;
};