import { getClosestOfType } from
'../../../../../generic-parsing-utilities/getClosestOfType.js';
import { mightBeDataValueToken } from
'../../../mightBeDataValueToken.js';
import { ParseTreeTokenType } from '../../../../ParseTreeTokenType.js';

export function validateYield(token, parseLogger) {
	const children = token.children;
	if (children.length === 1) {
		const child = children[0];
		if (!mightBeDataValueToken(child)) {
			parseLogger.error(`The child of a YIELD token should be something that can evaluate to a data value.  ` +
			`Found child of type ${ParseTreeTokenType.getNameFor(child.type)} and val ${child.val}.`, token);
		}
	}
	const closestFuncDef = getClosestOfType(token, ParseTreeTokenType.FUNCTION_DEFINITION);
	if (closestFuncDef === null)
		parseLogger.error(`A YIELD must be in a FUNCTION_DEFINITION but none were found.`, token);
};