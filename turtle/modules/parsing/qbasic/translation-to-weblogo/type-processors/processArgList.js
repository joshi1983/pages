import { evaluateStringLiteralString } from
'../../evaluation/evaluateStringLiteralString.js';
import { mightBeString } from
'../../parsing/parse-tree-analysis/variable-data-types/mightBeString.js';
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

function addSpaceAfter(token, result, options) {
	if (token.type === ParseTreeTokenType.STRING_LITERAL) {
		result.append(`${stringValueToWebLogoStringLiteral(evaluateStringLiteralString(token.val) + '\t')} `);
	}
	else {
		result.append(` word `);
		processToken(token, result, options);
		result.append(` '\t' `)
	}
}

export function processArgList(token, result, options) {
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
					addSpaceAfter(prev, result, options);
				else
					processToken(prev, result, options);
				result.append(' str ');
				processToken(next, result, options);
				processedTokens.add(prev);
				processedTokens.add(next);
			}
		}
	}
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (!processedTokens.has(child) && !ignoredTokenTypes.has(child.type)) {
			result.append(' ');
			processToken(child, result, options);
			result.append(' ');
		}
	}
};