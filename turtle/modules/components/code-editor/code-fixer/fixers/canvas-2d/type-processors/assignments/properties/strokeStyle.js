import { evaluateStringLiteral as jsEvaluateStringLiteral } from
'../../../../../../../../parsing/other-languages/js-parsing/evaluateStringLiteral.js';
import { evaluateToken as cssEvaluateToken } from
'../../../../../../../../parsing/other-languages/css/evaluators/evaluateToken.js';
import { parse as cssParse } from
'../../../../../../../../parsing/other-languages/css/parse.js';
import { ParseTreeTokenType } from 
'../../../../../../../../parsing/other-languages/js-parsing/ParseTreeTokenType.js';
import { processToken } from 
'../../processToken.js';
import { valueToLiteralCode } from
'../../../../../../../../valueToLiteralCode.js';

export function strokeStyle(token, result, settings) {
	if (token.children.length === 2) {
		const secondChild = token.children[1];
		result.append('setPenColor ');
		if (secondChild.type === ParseTreeTokenType.STRING_LITERAL) {
			const secondChildValue = jsEvaluateStringLiteral(secondChild.val);
			const cssParseResult = cssParse(secondChildValue);
			const val = cssEvaluateToken(cssParseResult.root);
			if ((typeof val === 'string' || typeof val === 'object') && typeof val.toString === 'function')
				result.append('"' + val.toString());
			else
				result.append(valueToLiteralCode(secondChildValue));
		}
		else {
			processToken(secondChild, result, settings);
		}
	}
};