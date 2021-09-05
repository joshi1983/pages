import { mightBeDataValue } from
'./parse-tree-analysis/variable-data-types/mightBeDataValue.js';

export function countArgValueTokens(argListToken) {
	let result = 0;
	for (const child of argListToken.children) {
		if (mightBeDataValue(child)) {
			result ++;
		}
	}
	return result;
};