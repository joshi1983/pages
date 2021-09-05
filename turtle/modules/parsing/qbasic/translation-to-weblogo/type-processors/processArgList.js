import { evaluateStringLiteral } from
'../../evaluateStringLiteral.js';
import { mightBeString } from './helpers/mightBeString.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { stringValueToWebLogoStringLiteral } from
'../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

const ignoredTokenTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.CURVED_LEFT_BRACKET,
	ParseTreeTokenType.CURVED_RIGHT_BRACKET,
	ParseTreeTokenType.SEMICOLON
]);

function addSpaceAfter(token, result) {
	if (token.type === ParseTreeTokenType.STRING_LITERAL)
		result.append(`${stringValueToWebLogoStringLiteral(evaluateStringLiteral(token.val) + '\t')} `);
	else {
		result.append(`word `);
		processToken(token, result);
		result.append(` '\t'`)
	}
}

export function processArgList(token, result) {
	const children = token.children;
	const processedTokens = new Set();
	// look for semicolons.
	for (let i = 1; i < children.length - 1; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.SEMICOLON ||
		child.type === ParseTreeTokenType.COMMA) {
			const prev = child.getPreviousSibling();
			const next = child.getNextSibling();
			if (mightBeString(prev)) {
				result.append('word ');
				if (child.type === ParseTreeTokenType.COMMA)
					addSpaceAfter(prev, result);
				else
					processToken(prev, result);
				result.append(' str ');
				processToken(next, result);
				processedTokens.add(prev);
				processedTokens.add(next);
			}
		}
	}
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (!processedTokens.has(child) && !ignoredTokenTypes.has(child.type)) {
			processToken(child, result);
			result.append(' ');
		}
	}
};