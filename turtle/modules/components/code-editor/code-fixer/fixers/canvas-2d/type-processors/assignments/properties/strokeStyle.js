import { evaluateStringLiteral as jsEvaluateStringLiteral } from
'../../../../../../../../parsing/js-parsing/evaluateStringLiteral.js';
import { evaluateToken as cssEvaluateToken } from
'../../../../../../../../parsing/css/evaluators/evaluateToken.js';
import { parse as cssParse } from
'../../../../../../../../parsing/css/parse.js';
import { ParseTreeTokenType } from 
'../../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
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