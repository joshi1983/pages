import { fixOperatorPrecedenceGeneric } from
'../../generic-parsing-utilities/fixOperatorPrecedenceGeneric.js';
import { fixOperatorPrecedenceForTernary } from
'./fixOperatorPrecedenceForTernary.js';
import { flatten } from '../../generic-parsing-utilities/flatten.js';
import { Operators } from '../Operators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function fixOperatorPrecedence(rootToken) {
	const allTokens = flatten(rootToken);
	fixOperatorPrecedenceGeneric(allTokens,
		[ParseTreeTokenType.BINARY_OPERATOR, ParseTreeTokenType.ASSIGNMENT_OPERATOR], Operators.compareOperatorPrecedence);
	fixOperatorPrecedenceForTernary(allTokens);
};