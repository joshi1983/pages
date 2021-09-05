import { AlphaColour } from '../../../../../../../AlphaColour.js';
import { evaluateLiteralToken } from '../../../../../../../parsing/js-parsing/evaluators/evaluateLiteralToken.js';
import { isNumber } from '../../../../../../../isNumber.js';
import { ParseTreeTokenType } from '../../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

const typesNotNeedingBrackets = new Set([
ParseTreeTokenType.BOOLEAN_LITERAL,
ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
ParseTreeTokenType.FUNCTION_CALL,
ParseTreeTokenType.NUMBER_LITERAL,
ParseTreeTokenType.STRING_LITERAL,
]);

function isBracketsNeededFor(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER &&
	token.children.length === 0)
		return false;
	return !typesNotNeedingBrackets.has(token);
}

function tokensToValues(tokens) {
	const vals = tokens.map(evaluateLiteralToken);
	if (vals.some(v => !isNumber(v)))
		return;
	return vals;
}

export function processColourArguments(colourValueTokens, result, scale) {
	if (colourValueTokens.length >= 3 && colourValueTokens.length <= 4) {
		if (colourValueTokens.length === 4) {
			// Move alpha token to the first element.
			const alphaToken = colourValueTokens[3];
			colourValueTokens = colourValueTokens.slice();
			colourValueTokens.pop();
			colourValueTokens.splice(0, 0, alphaToken);
		}
		const vals = tokensToValues(colourValueTokens);
		if (vals !== undefined) {
			const colour = new AlphaColour(vals.map(v => v * scale));
			result.append('"' + colour.toString());
			return;
		}
	}
	if (colourValueTokens.length === 1)
		processToken(colourValueTokens[0], result);
	else {
		result.append('[');
		for (const child of colourValueTokens) {
			result.append(' ');
			if (child.type === ParseTreeTokenType.NUMBER_LITERAL &&
			isNumber(parseFloat(child.val))) {
				result.append('' + Math.round(scale * parseFloat(child.val)));
			}
			else if (scale === 1) {
				processToken(child, result);
			}
			else {
				const brackets = isBracketsNeededFor(child);
				result.append(scale + ' * ');
				if (brackets)
					result.append('(');
				processToken(child, result);
				if (brackets)
					result.append(')');
			}
		}
		result.append(' ]');
	}
};