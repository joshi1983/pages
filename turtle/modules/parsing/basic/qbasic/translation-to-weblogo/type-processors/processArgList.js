import { evaluateStringLiteralString } from
'../../evaluation/evaluateStringLiteralString.js';
import { mightBeDataValue } from
'../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { mightBeString } from
'../../parsing/parse-tree-analysis/variable-data-types/mightBeString.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { QBasicInternalFunctions } from '../../QBasicInternalFunctions.js';
import { shouldUseStrCommand } from './helpers/shouldUseStrCommand.js';
import { stringValueToWebLogoStringLiteral } from
'../../../../generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';

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

function skipSemicolonProcessing(token) {
	const parent = token.parentNode;
	const children = token.children;
	if (children.length > 2 &&
	children[0].type === ParseTreeTokenType.CURVED_LEFT_BRACKET &&
	children[children.length - 1].type === ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		return true;
	if (parent.type === ParseTreeTokenType.FUNCTION_CALL) {
		const firstChild = parent.children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val.toLowerCase());
			if (info !== undefined) {
				const valTokens = token.children.filter(mightBeDataValue);
				if (info.argCount !== undefined) {
					if (info.argCount.min !== undefined && valTokens.length <= info.argCount.min)
						return true;
				}
				else if (info.args !== undefined && valTokens.length <= info.args.length)
					return true;
				if (info.args !== undefined && info.args.length !== 0) {
					const firstTypes = info.args[0].types;
					if (firstTypes !== undefined && firstTypes.indexOf('string') === -1)
						return true;
				}
			}
		}
	}
	return false;
}

export function processArgList(token, result, options) {
	const children = token.children;
	const processedTokens = new Set();
	if (!skipSemicolonProcessing(token)) {
		// look for semicolons.
		for (let i = 1; i < children.length - 1; i++) {
			const child = children[i];
			if (child.type === ParseTreeTokenType.SEMICOLON ||
			child.type === ParseTreeTokenType.COMMA) {
				const prev = child.getPreviousSibling();
				const next = child.getNextSibling();
				if (mightBeString(prev) || mightBeString(next)) {
					result.append('word ');
					if (shouldUseStrCommand(prev, options))
						result.append('str ');
					if (child.type === ParseTreeTokenType.COMMA)
						addSpaceAfter(prev, result, options);
					else
						processToken(prev, result, options);
					if (shouldUseStrCommand(next, options))
						result.append(' str ');
					processToken(next, result, options);
					processedTokens.add(prev);
					processedTokens.add(next);
				}
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