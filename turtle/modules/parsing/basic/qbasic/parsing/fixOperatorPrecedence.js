import { fixOperatorPrecedenceGeneric } from
'../../../generic-parsing-utilities/fixOperatorPrecedenceGeneric.js';
import { flatten } from '../../../generic-parsing-utilities/flatten.js';
import { QBasicOperators } from '../QBasicOperators.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function fixOperatorPrecedence(rootToken) {
	const allTokens = flatten(rootToken);
	fixOperatorPrecedenceGeneric(allTokens,
		[ParseTreeTokenType.BINARY_OPERATOR], QBasicOperators.compareOperatorPrecedence);
};