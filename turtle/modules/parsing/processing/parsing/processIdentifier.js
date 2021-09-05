import { addCodeBlockIfNeeded } from './addCodeBlockIfNeeded.js';
import { addDeclaration } from './addDeclaration.js';
import { canBeTypeCastingExpression } from './canBeTypeCastingExpression.js';
import { declaringTypes } from './declaringTypes.js';
import { getGoodPreviousForIdentifier } from './getGoodPreviousForIdentifier.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldAppendChild } from './shouldAppendChild.js';

const canBecomeDataTypeTypes = new Set([
	ParseTreeTokenType.DATA_TYPE,
	ParseTreeTokenType.IDENTIFIER
]);

function isExtends(previousToken, nextToken) {
	if (nextToken.val !== 'extends')
		return false;
	let t = previousToken;
	// t would be a class name token, if token is an extends used in a class definition
	if (t.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	t = t.parentNode;
	if (t.type !== ParseTreeTokenType.CLASS &&
	t.type !== ParseTreeTokenType.INTERFACE)
		return false;
	return true;
}

function shouldBecomeDeclaration(previousToken) {
	const parent = previousToken.parentNode;
	if (parent === null) {
		const lastChild = previousToken.children[previousToken.children.length - 1];
		if (lastChild === undefined)
			return false;
		if (lastChild.type === ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION ||
		lastChild.type === ParseTreeTokenType.EXPRESSION_DOT)
			return true;
		if (lastChild.type === ParseTreeTokenType.IDENTIFIER &&
		lastChild.children.length !== 0 &&
		lastChild.children[0].type === ParseTreeTokenType.DOT)
			return true;
	}
	if (parent === null || parent.type === ParseTreeTokenType.DECLARATION)
		return false;
	if (previousToken.type === ParseTreeTokenType.DATA_TYPE ||
	previousToken.type === ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION)
		return true;
	if (previousToken.type === ParseTreeTokenType.EXPRESSION_DOT &&
	previousToken.children.length === 2) {
		const dot = previousToken.children[1];
		return dot.children.length !== 0;
	}
	if (previousToken.type === ParseTreeTokenType.FOR_LOOP_SETTINGS &&
	previousToken.children.length === 2 &&
	canBecomeDataTypeTypes.has(previousToken.children[1].type) &&
	parent.type === ParseTreeTokenType.FOR)
		return true;
	if (parent.type !== ParseTreeTokenType.ARG_LIST &&
	parent.type !== ParseTreeTokenType.TREE_ROOT)
		return false;
	if (previousToken.type === ParseTreeTokenType.IDENTIFIER ||
	previousToken.type === ParseTreeTokenType.DATA_TYPE) {
		return true;
	}
	return false;
}

function shouldNextBeConvertedToDataType(previousToken) {
	const parent = previousToken.parentNode;
	if (parent === null)
		return false;
	const grandParent = parent.parentNode;
	if (grandParent !== null && grandParent.type === ParseTreeTokenType.METHOD_CALL)
		return false;
	if (previousToken.type === ParseTreeTokenType.CURVED_LEFT_BRACKET &&
	parent.type === ParseTreeTokenType.ARG_LIST)
		return true;
	return false;
}

function shouldSetPreviousParentCodeBlock(previousToken) {
	const parent = previousToken.parentNode;
	if (parent === null ||
	parent.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return false;
	if (parent.children.length > 1) {
		const secondChild = parent.children[1];
		if (secondChild.type === ParseTreeTokenType.COLON)
			return false;
	}
	if (declaringTypes.has(previousToken.type))
		return true;
	return false;
}

export function processIdentifier(previousToken, nextToken) {
	if (addCodeBlockIfNeeded(previousToken, nextToken)) {
		return nextToken;
	}
	else {
		if (isExtends(previousToken, nextToken))
			nextToken.type = ParseTreeTokenType.EXTENDS;

		previousToken = getGoodPreviousForIdentifier(previousToken);
		if (canBeTypeCastingExpression(previousToken)) {
			const typeCasting = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.TYPE_CASTING);
			const parent = previousToken.parentNode;
			previousToken.remove();
			parent.appendChild(typeCasting);
			typeCasting.appendChild(previousToken);
			typeCasting.appendChild(nextToken);
			return typeCasting;
		}
		if (shouldBecomeDeclaration(previousToken)) {
			if (previousToken.type === ParseTreeTokenType.FOR_LOOP_SETTINGS ||
			previousToken.type === ParseTreeTokenType.TREE_ROOT)
				previousToken.appendChild(nextToken);
			else
				previousToken.appendSibling(nextToken);
			return addDeclaration(nextToken);
		}
		else if (shouldNextBeConvertedToDataType(previousToken)) {
			nextToken.type = ParseTreeTokenType.DATA_TYPE;
		}
		if (shouldSetPreviousParentCodeBlock(previousToken))
			previousToken.parentNode.type = ParseTreeTokenType.CODE_BLOCK;
		if (nextToken.type === ParseTreeTokenType.EXTENDS ||
		shouldAppendChild(previousToken, nextToken))
			previousToken.appendChild(nextToken);
		else
			previousToken.appendSibling(nextToken);
	}
};