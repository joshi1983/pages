import { filterBrackets } from
'../helpers/filterBrackets.js';
import { isInstructionList } from
'../../../../parse-tree-analysis/isInstructionList.js';
import { ParseTreeTokenType } from
'../../../../ParseTreeTokenType.js';
import { processToken } from
'../processToken.js';
import { processTokens } from
'../helpers/processTokens.js';

function shouldTranslateToTrinaryOperator(ifelseToken, instructionsToken1, instructionsToken2) {
	if (instructionsToken1 === undefined || instructionsToken2 === undefined)
		return false;
	if (instructionsToken1.type !== ParseTreeTokenType.LIST ||
	instructionsToken2.type !== ParseTreeTokenType.LIST)
		return true; // both must be lists to be instruction lists.

	const parent = ifelseToken.parentNode;
	if (isInstructionList(parent))
		return false;
	else if (parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP ||
	parent.type === ParseTreeTokenType.LIST ||
	parent.type === ParseTreeTokenType.BINARY_OPERATOR ||
	parent.type === ParseTreeTokenType.UNARY_OPERATOR)
		return true; // if the parent requires a value, ifelseToken should evaluate to one.

	return false;
}

export function ifelse(token, result, options) {
	const children = token.children;
	const conditionToken = children[0];
	const instructionsToken1 = children[1];
	const instructionsToken2 = children[2];
	if (shouldTranslateToTrinaryOperator(token, instructionsToken1, instructionsToken2)) {
		result.append('( ');
		processToken(conditionToken, result, options);
		result.append(' ? ');
		processToken(instructionsToken1, result, options);
		result.append(' : ');
		processToken(instructionsToken2, result, options);
		result.append(' ) ');
	}
	else {
		result.processCommentsUpToToken(token);
		result.append('\nif (');
		processToken(conditionToken, result, options);
		result.append(') {\n');
		processTokens(filterBrackets(instructionsToken1.children), result, options);
		result.append('\n}');
		if (instructionsToken2 !== undefined) {
			result.append(' else ');
			processToken(instructionsToken2, result, options);
		}
		result.append('\n');
	}
};