import { ParseTreeTokenType } from
'../../../parsing/ParseTreeTokenType.js';

export function harmonizeBooleanLiterals(parseTree) {
	const literals = parseTree.getTokensByType(ParseTreeTokenType.BOOLEAN_LITERAL);

	// select best variable names and change all references to match.
	for (const literalToken of literals) {
		literalToken.originalString = '' + literalToken.val;
	}
};