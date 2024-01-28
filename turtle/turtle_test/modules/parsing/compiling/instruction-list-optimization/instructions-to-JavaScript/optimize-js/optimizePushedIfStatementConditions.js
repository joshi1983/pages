import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { getAllDescendentsAsArray } from '../../../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getCodeUpToToken } from '../../../../parse-tree-token/getCodeUpToToken.js';
import { isSafeWithoutBrackets } from './isSafeWithoutBrackets.js';
import { isValueStackPush } from './token-classifiers/isValueStackPush.js';
import { optimizeBooleanExpression } from './optimizeBooleanExpression.js';
import { parse } from '../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from '../../../../js-parsing/parseTreeTokensToCode.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';

function isPushOfInterest(token) {
	if (!isValueStackPush(token))
		return false;
	const argList = token.children[1];
	return argList.children.length === 3;
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