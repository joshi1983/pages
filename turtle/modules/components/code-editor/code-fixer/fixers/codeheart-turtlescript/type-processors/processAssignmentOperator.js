import { isAssigningToLocalVariable } from './helpers/isAssigningToLocalVariable.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from './processToken.js';

const noBracketsNeededTypes = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL
]);

function processWithPotentialBrackets(token, result) {
	const useBrackets = !noBracketsNeededTypes.has(token.type);
	if (useBrackets)
		result.append('(');
	processToken(token, result);
	if (useBrackets)
		result.append(')');
}

export function processAssignmentOperator(token, result) {
	result.processCommentsUpToToken(token);
	const varNameToken = token.children[0];
	const secondToken = token.children[1];
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
			processWithPotentialBrackets(secondToken, result);
		}
	}
	else if (token.val === '**=') {
		result.append('power :' + varNameToken.val + ' ');
		if (secondToken !== undefined) {
			processWithPotentialBrackets(secondToken, result);
		}
	}
	result.append('\n');
};