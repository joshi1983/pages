import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getAllDescendentsAsArray } from '../../../../parse-tree-token/getAllDescendentsAsArray.js';
import { getCodeUpToToken } from '../../../../parse-tree-token/getCodeUpToToken.js';
import { isValueStackPush } from './token-classifiers/isValueStackPush.js';
import { optimizeBooleanExpression } from './optimizeBooleanExpression.js';
import { parse } from '../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';

const valTypesSafeWithoutBrackets = new Set([
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.UNARY_OPERATOR
]);

function isPushOfInterest(token) {
	if (!isValueStackPush(token))
		return false;
	const argList = token.children[1];
	return argList.children.length === 3;
}

function isSafeWithoutBrackets(valToken) {
	if (valToken.children.length === 0)
		return true;
	return valTypesSafeWithoutBrackets.has(valToken.type);
}

export function optimizePushedIfStatementConditions(jsCode) {
	const parseResult = parse(jsCode);
	if (parseResult.root.children.length === 0)
		return;
	const children = parseResult.root.children;
	for (let i = children.length - 1; i >= 0; i--) {
		let child = children[i];
		if (child.type !== ParseTreeTokenType.SEMICOLON) {
			if (isPushOfInterest(child)) {
				const argList = child.children[1];
				const valToken = optimizeBooleanExpression(argList.children[1]);
				const valTokens = getAllDescendentsAsArray(valToken);
				valTokens.push(valToken);
				let conditionJS = parseTreeTokensToCode(valTokens).trim();
				if (!isSafeWithoutBrackets(valToken)) {
					conditionJS = `(${conditionJS})`;
				}
				if (conditionJS[0] === '!')
					conditionJS = conditionJS.substring(1);
				else
					conditionJS = '!' + conditionJS;
				return {
					'updated': getCodeUpToToken(jsCode, child),
					'conditionJS': conditionJS
				};
			}
			break;
		}
	}
};