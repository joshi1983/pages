import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

function getFontDetailsToken(parameterTokens) {
	if (parameterTokens.length <= 1)
		return;
	for (const t of parameterTokens) {
		if (t.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
		t.children.length === 2 &&
		t.children[0].val === 'font')
			return t.children[1];
	}
}

export function shouldTranslateToPyWriteWithFont(token) {
	const argList = token.children[0];
	if (argList === undefined)
		return false;

	const parameterTokens = filterBracketsAndCommas(argList.children);
	const fontDetailsToken = getFontDetailsToken(parameterTokens);
	if (fontDetailsToken !== undefined &&
	fontDetailsToken.type === ParseTreeTokenType.TUPLE_LITERAL &&
	fontDetailsToken.children.length > 6) {
		return true;
	}
	return false;
};

export function processWrite(token, result, cachedParseTree, settings) {
	const argList = token.children[0];
	if (argList === undefined)
		return;

	const parameterTokens = filterBracketsAndCommas(argList.children);
	const fontDetailsToken = getFontDetailsToken(parameterTokens);
	if (shouldTranslateToPyWriteWithFont(token)) {
		result.append('\npyWriteWithFont  ');
		processToken(parameterTokens[0], result, cachedParseTree, settings);
		const tupleVals = filterBracketsAndCommas(fontDetailsToken.children);
		for (const valToken of tupleVals) {
			result.append(' ');
			processToken(valToken, result, cachedParseTree, settings);
		}
	}
	else {
		result.append('\nlabel ');
		processToken(parameterTokens[0], result, cachedParseTree, settings);
	}
};