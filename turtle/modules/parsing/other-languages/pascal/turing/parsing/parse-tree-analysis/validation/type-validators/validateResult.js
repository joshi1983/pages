import { canEvaluateToDataValue } from
'../../../canEvaluateToDataValue.js';
import { getClosestOfType } from
'../../../../../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateResult(token, parseLogger) {
	const functionToken = getClosestOfType(token, ParseTreeTokenType.FUNCTION);
	if (functionToken === null)
		parseLogger.error(`Expected RESULT to be in a FUNCTION but could not find a containing FUNCTION.`, token);

	const children = token.children;
	if (children.length === 1) {
		const first = children[0];
		if (!canEvaluateToDataValue(first))
			parseLogger.error(`Expected child of RESULT to evaluate to a value but got type ${ParseTreeTokenType.getNameFor(first.type)}`, token);
	}
};