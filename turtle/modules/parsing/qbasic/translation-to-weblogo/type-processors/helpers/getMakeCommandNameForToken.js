import { isInFunction } from
'../../../parsing/parse-tree-analysis/variable-data-types/isInFunction.js';

export function getMakeCommandNameForToken(token) {
	if (isInFunction(token))
		return 'localmake';
	else
		return 'make';
};