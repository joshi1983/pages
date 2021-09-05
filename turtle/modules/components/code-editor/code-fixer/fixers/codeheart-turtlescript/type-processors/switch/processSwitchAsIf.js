import { getFirstCaseBlock } from './getFirstCaseBlock.js';
import { getFirstCaseValueToken } from './getFirstCaseValueToken.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

const typesNotNeedingBrackets = new Set([
ParseTreeTokenType.ARRAY_LITERAL,
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
ParseTreeTokenType.TEMPLATE_LITERAL,
]);

function isBracketsImportantForValue(valueToken) {
	if (valueToken === undefined)
		return false;
	if (typesNotNeedingBrackets.has(valueToken.type))
		return false;
	if (valueToken.type === ParseTreeTokenType.IDENTIFIER && valueToken.children.length === 0)
		return false;
	return true;
}

export function processSwitchAsIf(switchToken, result) {
	let valueToken = switchToken.children[0];
	const firstCaseBlock = getFirstCaseBlock(switchToken);
	const caseValueToken = getFirstCaseValueToken(switchToken);
	const block = switchToken.children[1];
	result.append('if ');
	const useBrackets = isBracketsImportantForValue(valueToken.children[1]);
	if (useBrackets === false && valueToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION)
		valueToken = valueToken.children[1];
	processToken(caseValueToken, result);
	result.append(' = ');
	processToken(valueToken, result);
	processToken(firstCaseBlock, result);
};