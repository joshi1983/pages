import { isInFunction } from
'../../../parsing/parse-tree-analysis/variable-data-types/isInFunction.js';

export function end(token, result) {
	if (isInFunction(token)) {
		result.append('stop');
	}
};