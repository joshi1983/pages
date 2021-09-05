import { Colour } from
'../../../../Colour.js';
import { evaluateToken } from '../../evaluation/evaluateToken.js';
import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { KojoColors } from
'../../KojoColors.js';
import { MigrationInfo } from '../../MigrationInfo.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';
import { valueToLiteralCode } from
'../../../../valueToLiteralCode.js';

await Colour.asyncInit();

export function shouldBeTranslatedToStringLiteral(token, settings) {
	if (token === undefined)
		return false;
	if (token.children.length !== 0)
		return false;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.DEF ||
	parent.type === ParseTreeTokenType.VAL ||
	parent.type === ParseTreeTokenType.VAR)
		return false;
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT_PROPERTY) {
		const firstChild = parent.children[0];
		if (firstChild !== token) {
			if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
				return false;

			if (!MigrationInfo.hasAliasRelationship(firstChild.val, 'ColorMaker'))
				return false; 
		}
	}

	if (!KojoColors.hasInfoForName(token.val))
		return false;

	// FIXME: look for declared variable or function with the name, token.val.
	// if any are found, return false.

	return true;
};

function isFunctionDefinitionArgument(token) {
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.ARG_LIST)
		return false;
	const grandParent = parent.parentNode;
	if (grandParent.type !== ParseTreeTokenType.DEF)
		return false;
	return true;
}

function getAssignmentOperator(token) {
	const children = token.children;
	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR && children.length === 0)
		return token;
	for (const child of children) {
		const result = getAssignmentOperator(child);
		if (result !== undefined) {
			return result;
		}
	}
}

function shouldTranslateToTransparent(token) {
	if (token.val === 'noColor' && token.children.length === 0)
		return true;
	return false;
}

function shouldTranslateToNothing(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.FAT_ARROW &&
	parent.children[0] === token) {
		const grandparent = parent.parentNode;
		return grandparent.type === ParseTreeTokenType.CODE_BLOCK;
	}
	return false;
}

function shouldTranslateAsEventHandler(token) {
	const children = token.children;
	if (children.length === 0 ||
	children[children.length - 1].type !== ParseTreeTokenType.CODE_BLOCK
	)
		return false;
	return token.parentNode.type === ParseTreeTokenType.TREE_ROOT;
}

function translateAsEventHandler(token, result, settings) {
	result.processCommentsUpToToken(token);
	result.append('to ');
	result.append(token.val);
	
	const children = token.children;
	const codeBlock = children[children.length - 1];
	result.append('\n');
	processTokens(filterBracketsAndCommas(codeBlock.children), result, settings);
	
	result.append('\nend\n');
}

function getStringReplacementValue(s) {
	const webLogoColourCode = KojoColors.nameToWebLogoString(s);
	if (webLogoColourCode !== undefined)
		return webLogoColourCode;
	return s;
}

export function processIdentifier(token, result, settings) {
	if (shouldTranslateToNothing(token))
		return;
	if (shouldTranslateAsEventHandler(token)) {
		translateAsEventHandler(token, result, settings);
		return;
	}
	const parent = token.parentNode;
	const children = token.children;
	if (shouldBeTranslatedToStringLiteral(token, settings)) {
		result.append(valueToLiteralCode(getStringReplacementValue(token.val)));
	}
	else if (shouldTranslateToTransparent(token))
		result.append(' transparent ');
	else if (children.length === 0 || isFunctionDefinitionArgument(token))
		result.append(`:${token.val} `);
	else {
		const assignmentOperator = getAssignmentOperator(token);
		if (assignmentOperator !== undefined) {
			processToken(assignmentOperator, result, settings);
			return;
		}
		const firstChild = children[0];
		if (firstChild.type === ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION) {
			const nonBracketTokens = filterBracketsAndCommas(firstChild.children);
			const indexToken = nonBracketTokens[0];
			if (indexToken !== undefined) {
				// for example, a[x]
				result.append(' item ');
				const indexVal = evaluateToken(indexToken);
				if (Number.isInteger(indexVal)) {
					result.append('' + (indexVal + 1));
				}
				else {
					result.append('(1 + ');
					processToken(indexToken, result, settings);
					result.append(' ) ');
				}
				result.append(' :' + token.val + ' ');
				return;
			}
		}
		processToken(firstChild, result, settings);
	}
};