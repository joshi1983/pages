import { evaluateStringLiteral } from
'../../../../../../../../parsing/css/evaluators/evaluateStringLiteral.js';
import { evaluateToken } from
'../../../../../../../../parsing/css/evaluators/evaluateToken.js';
import { isFontFamily } from 
'./font/isFontFamily.js';
import { isFontSize } from 
'./font/isFontSize.js';
import { parse as cssParse } from
'../../../../../../../../parsing/css/parse.js';
import { ParseTreeTokenType } from 
'../../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from 
'../../processToken.js';
import { valueToLiteralCode } from
'../../../../../../../../valueToLiteralCode.js';
import { stringValueToWebLogoStringLiteral } from '../../../../../../../../parsing/generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

function setFontSize(cssToken, result, settings) {
	result.append('setFontSize ');
	result.append('' + evaluateToken(cssToken));
}

function setFontFamily(cssToken, result, settings) {
	result.append('setFontFamily ');
	result.append(stringValueToWebLogoStringLiteral(cssToken.val));
}

const pairs = new Map([
	[isFontFamily, setFontFamily],
	[isFontSize, setFontSize]
]);

export function font(token, result, settings) {
	if (token.children.length === 2) {
		const secondChild = token.children[1];
		if (secondChild.type === ParseTreeTokenType.STRING_LITERAL) {
			const cssParseResult = cssParse(evaluateStringLiteral(secondChild));
			for (const cssToken of cssParseResult.root.children) {
				for (const [isFunc, processFunc] of pairs) {
					if (isFunc(cssToken)) {
						processFunc(cssToken, result, settings);
					}
				}
			}
		}
	}
};