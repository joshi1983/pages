import { evaluateToken } from
'../../../evaluation/evaluateToken.js';
import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';
import { processTokens } from
'../helpers/processTokens.js';
import { valueToLiteralCode } from
'../../../../../valueToLiteralCode.js';

function isRangeOperator(token) {
	if (token === undefined || token.type !== ParseTreeTokenType.BINARY_OPERATOR)
		return false;
	const val = token.val;
	return val === 'to' || val === 'until';
}

function getVariableNameFor(codeBlock) {
	if (codeBlock === undefined || codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
		return 'i';

	for (let i = 0; i < 3; i++) {
		const child = codeBlock.children[i];
		if (child === undefined)
			break;
		if (child.type === ParseTreeTokenType.FAT_ARROW) {
			let firstChild = child.children[0];
			if (firstChild === undefined)
				break;
			while (firstChild !== undefined) {
				if (firstChild.type === ParseTreeTokenType.IDENTIFIER)
					return firstChild.val;

				firstChild = firstChild.children[0];
			}
			break;
		}
	}
	return 'i';
}

export function repeatFor(token, result, settings) {
	const args = filterBracketsAndCommas(token.children[1].children);
	const codeBlock = token.children[2];
	const rangeToken = args[0];
	if (isRangeOperator(rangeToken) && rangeToken.children.length === 2) {
		const varName = getVariableNameFor(codeBlock);
		result.append(`\nfor ["${varName} `);
		processToken(rangeToken.children[0], result, settings);
		result.append(' ');
		const finalValueToken = rangeToken.children[1];
		if (finalValueToken.val === 'by' && finalValueToken.children.length === 2) {
			const finalValueToken2 = finalValueToken.children[0];
			const byValueToken = finalValueToken.children[1];
			processToken(finalValueToken2, result, settings);
			result.append(' ');
			processToken(byValueToken, result, settings);
		}
		else {
			processToken(finalValueToken, result, settings);
		}
		result.append(']');
	}
	else if (rangeToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
		result.append(`\nrepeat ${valueToLiteralCode(evaluateToken(rangeToken))}`);
	}
	else {
		result.append('\n; FIXME: Manual translation needed here.\n');
		result.append('; unable to translate repeatFor because the arguments were not a range operator or number.\n');
	}
	result.append(' [\n');
	if (codeBlock !== undefined)
		processTokens(filterBracketsAndCommas(codeBlock.children), result, settings);
	result.append('\n]\n');
};