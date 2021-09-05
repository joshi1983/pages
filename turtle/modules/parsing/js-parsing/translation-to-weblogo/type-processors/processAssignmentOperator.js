import { isAssigningToLocalVariable } from './helpers/isAssigningToLocalVariable.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

const noBracketsNeededTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL
]);

function processWithPotentialBrackets(processToken, token, result) {
	const useBrackets = !noBracketsNeededTypes.has(token.type);
	if (useBrackets)
		result.append('(');
	processToken(token, result);
	if (useBrackets)
		result.append(')');
}

export function processAssignmentOperator(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken must be a function but got ${processToken}`);
	return function(token, result) {
		result.processCommentsUpToToken(token);
		const children = token.children;
		if (children.length === 0) // weird case indicating the parsing failed.
			return; // Give up translating this erroneously structured part of the parse tree without throwing an exception.
		const varNameToken = children[0];
		const secondToken = children[1];
		if (isAssigningToLocalVariable(varNameToken))
			result.append('local');
		result.append('make ');
		if (varNameToken !== undefined) {
			result.append('"' + varNameToken.val + ' ');
		}
		if (token.val === '=') {
			processToken(secondToken, result);
		}
		else if (token.val === '++' || token.val === '--') {
			result.append(':' + varNameToken.val + ` ${token.val[0]} 1`);
		}
		else if (token.val === '-=' || token.val === '+=') {
			result.append(':' + varNameToken.val + ` ${token.val[0]} `);
			if (secondToken !== undefined)
				processToken(secondToken, result);
		}
		else if (token.val === '*=' || token.val === '/=') {
			result.append(':' + varNameToken.val + ` ${token.val[0]} `);
			if (secondToken !== undefined) {
				processWithPotentialBrackets(processToken, secondToken, result);
			}
		}
		else if (token.val === '**=') {
			result.append('power :' + varNameToken.val + ' ');
			if (secondToken !== undefined) {
				processWithPotentialBrackets(processToken, secondToken, result);
			}
		}
		result.append('\n');
	};
};