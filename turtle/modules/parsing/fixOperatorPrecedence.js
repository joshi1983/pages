import { fixOperatorPrecedenceGeneric } from './generic-parsing-utilities/fixOperatorPrecedenceGeneric.js';
import { ParseTreeToken } from './ParseTreeToken.js';
import { ParseTreeTokenType } from './ParseTreeTokenType.js';
import { Operators } from './Operators.js';

/*
Note that this assumes your module already waited for Operators.asyncInit().
*/
export function fixOperatorPrecedence(parseTreeToken) {
	if (parseTreeToken instanceof Array)
		throw new Error('parseTreeToken must not be an Array');
	const allTokens = ParseTreeToken.flatten(parseTreeToken);
	fixOperatorPrecedenceGeneric(allTokens, ParseTreeTokenType.BINARY_OPERATOR, Operators.compareOperatorPrecedence);
}