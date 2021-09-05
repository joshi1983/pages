import { AlphaColour } from '../../../../AlphaColour.js';
import { clamp } from '../../../../clamp.js';
import { Colour } from '../../../../Colour.js';
import { evaluateToken } from '../evaluateToken.js';
import { isNumber } from '../../../../isNumber.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();

/*
This evaluates semitransparent colours from rgb function calls that 
use a divide operator and a percentage to express opacity or alpha values.
*/

function unableToEvaluate(token) {
	const result = evaluateToken(token);
	return !isNumber(result);
}

function isAcceptablePercentageToken(token) {
	if (token.type !== ParseTreeTokenType.NUMBER_UNIT_LITERAL &&
	token.type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false;
	if (token.type === ParseTreeTokenType.NUMBER_UNIT_LITERAL &&
	!token.val.endsWith('%'))
		return false;
	return true;
}

export function isRGBWithPercentage(parameterTokens) {
	if (parameterTokens.length !== 3)
		return false;
	const lastToken = parameterTokens[2];
	if (lastToken.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	lastToken.val !== '/' ||
	lastToken.children.length !== 2)
		return false;
	const percentage = lastToken.children[1];
	if (!isAcceptablePercentageToken(percentage))
		return false;
	if (unableToEvaluate(parameterTokens[0]) ||
	unableToEvaluate(parameterTokens[1]) ||
	unableToEvaluate(lastToken.children[0]))
		return false;
	return true;
};

export function evaluateRGBWithPercentage(parameterTokens) {
	const lastToken = parameterTokens[2];
	const percentage = lastToken.children[1];
	const alpha = clamp(evaluateToken(percentage), 0, 1);
	const r = evaluateToken(parameterTokens[0]);
	const g = evaluateToken(parameterTokens[1]);
	const b = evaluateToken(lastToken.children[0]);
	if (alpha === 1)
		return new Colour(r, g, b);
	else
		return new AlphaColour(Math.round(alpha * 255), r, g, b);
};