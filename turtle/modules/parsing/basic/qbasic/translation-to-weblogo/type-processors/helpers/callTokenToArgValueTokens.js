import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';

export function callTokenToArgValueTokens(token) {
	const argList = token.children[1];
	if (argList === undefined)
		return [];
	return argList.children.filter(mightBeDataValue);
};