import { evaluateLiteralToken } from
'../../../../js-parsing/evaluators/evaluateLiteralToken.js';
import { filterBracketsAndCommas } from
'../../../../js-parsing/translation-to-weblogo/type-processors/helpers/filterBracketsAndCommas.js';
import { noop } from
'../../../../../noop.js';
import { ParseTreeTokenType } from
'../../../../js-parsing/ParseTreeTokenType.js';
import { processToken } from
'../../../../js-parsing/translation-to-weblogo/type-processors/processToken.js';

const safeToSkipTypes = new Set([
	ParseTreeTokenType.SEMICOLON
]);

function isSafeToSkip(token) {
	if (token === null)
		return false;
	if (safeToSkipTypes.has(token.type))
		return true;

	// FIXME: if token will never draw anything,
	// move the turtle, return true.
	// FIXME: if token is an assignment that doesn't call any custom functions, return true.
	return false;
}

function fcToName(token) {
	if (token.type !== ParseTreeTokenType.FUNCTION_CALL)
		return;

	const nameToken = token.children[0];
	if (nameToken.type === ParseTreeTokenType.IDENTIFIER) {
		return nameToken.val;
	}
}

function getCircleToken(beginShape) {
	const beginShapeName = fcToName(beginShape);
	if (beginShapeName !== 'beginShape')
		return;
	let tok = beginShape.getNextSibling();
	while (tok) {
		const name = fcToName(tok);
		if (name === 'circle')
			return tok;
		if (!isSafeToSkip(tok))
			return;
		tok = tok.getNextSibling();
	}
}

function circleTokenToFillShapeToken(circleToken) {
	let fillShapeToken = circleToken.getNextSibling();
	while (isSafeToSkip(fillShapeToken))
		fillShapeToken = fillShapeToken.getNextSibling();

	const name = fcToName(fillShapeToken);
	if (name === 'fillShape')
		return fillShapeToken;
}

function shouldTranslateToDrawArcLineShape(token) {
	const circleToken = getCircleToken(token);
	if (circleToken === undefined)
		return false;

	const argList = circleToken.children[1];
	if (argList === undefined)
		return false;

	const circleArgs = filterBracketsAndCommas(argList.children);
	if (circleArgs.length < 2)
		return false;

	const fillShapeToken = circleTokenToFillShapeToken(circleToken);
	return fillShapeToken !== undefined;
}

function setFillColorUsingFillShapeToken(fillShapeToken, result, options) {
	const argList = fillShapeToken.children[1];
	const args = filterBracketsAndCommas(argList.children);
	if (args.length === 1) {
		result.append('\nsetFillColor ');
		processToken(args[0], result, options);
		result.append('\n');
	}
}

export function isBeginShapeOfInterest(token) {
	return shouldTranslateToDrawArcLineShape(token);
};

export function beginShape(token, result, options) {
	if (shouldTranslateToDrawArcLineShape(token)) {
		const circleToken = getCircleToken(token);
		const argList = circleToken.children[1];
		const args = filterBracketsAndCommas(argList.children);
		const angleToken = args[1];
		const radiusToken = args[0];
		const directionToken = args[2];
		const fillShapeToken = circleTokenToFillShapeToken(circleToken);
		setFillColorUsingFillShapeToken(fillShapeToken, result, options);
		result.append('\ndrawArcLineShape [0 1\n[[90 0] [');
		processToken(angleToken, result, options);
		result.append(' 1]]\n] ');
		if (directionToken !== undefined) {
			const a = evaluateLiteralToken(directionToken);
			if (typeof a === 'boolean') {
				if (a === true)
					result.append(' -');
			}
			else {
				result.append(' (ifelse ');
				processToken(directionToken, result, options);
				result.append(' -1 1) * ');
			}
		}
		processToken(radiusToken, result, options);
		for (const tok of [circleToken, fillShapeToken]) {
			options.tokenProcessMap.set(tok, noop);
		}
		result.append('\n');
	}
};