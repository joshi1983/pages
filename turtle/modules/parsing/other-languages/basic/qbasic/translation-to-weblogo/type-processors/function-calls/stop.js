import { isInFunction } from
'../../../parsing/parse-tree-analysis/variable-data-types/isInFunction.js';

export function stop(token, result, options) {
	result.processCommentsUpToToken(token);
	if (isInFunction(token))
		result.append('stop');
	else
		result.append('break');
};