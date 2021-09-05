import { isFloatType } from '../../../parsing/parse-tree-analysis/isFloatType.js';
import { isIntegerType } from '../../../parsing/parse-tree-analysis/isIntegerType.js';
import { typesTokenToString } from '../../../parsing/parse-tree-analysis/typesTokenToString.js';
 
const typesToInitialValues = new Map([
	['string', ''],
	['char', '']
]);

export function typesToInitialValue(typesToken) {
	const typesStr = typesTokenToString(typesToken);
	if (isIntegerType(typesStr) || isFloatType(typesStr))
		return 0;
	return typesToInitialValues.get(typesStr);
};