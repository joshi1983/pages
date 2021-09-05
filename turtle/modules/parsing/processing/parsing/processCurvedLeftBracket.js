import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { endsWithSquareRightBracket } from './endsWithSquareRightBracket.js';
import { getDataTypeToken } from './getDataTypeToken.js';
import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { shouldAppendChild } from './shouldAppendChild.js';

const argListPreviousTypes = new Set([
	ParseTreeTokenType.CATCH,
	ParseTreeTokenType.DATA_TYPE,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.INDEX_EXPRESSION,
	ParseTreeTokenType.METHOD,
	ParseTreeTokenType.METHOD_CALL,
	ParseTreeTokenType.NEW,
	ParseTreeTokenType.STRING_LITERAL,
]);
const methodCallTokenTypes = new Set([
	ParseTreeTokenType.DOT,
	ParseTreeTokenType.EXPRESSION_DOT,
	ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.INDEX_EXPRESSION,
	ParseTreeTokenType.METHOD_CALL,
	ParseTreeTokenType.STRING_LITERAL,
	ParseTreeTokenType.THIS
]);
const nonMethodCallParentTypes = new Set([
	ParseTreeTokenType.CLASS_BODY,
	ParseTreeTokenType.METHOD,
	ParseTreeTokenType.STATIC,
]);
const prevWithCodeBlockParentTypes = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.IF
]);

function addNext(previousToken, nextToken) {
	if (shouldAppendChild(previousToken, nextToken))
		previousToken.appendChild(nextToken);
	else
		previousToken.appendSibling(nextToken);
}

function setCodeBlockParentIfNeeded(previousToken) {
	if (shouldMakeArgList(previousToken)) {
		if (isForMethodCall(previousToken)) {
			previousToken = getMethodCallRootToken(previousToken);
		}
	}
	const parent = previousToken.parentNode;
	if (parent === null ||
	parent.type !== ParseTreeTokenType.CURLY_BRACKET_EXPRESSION)
		return;
	if (prevWithCodeBlockParentTypes.has(previousToken.type))
		parent.type = ParseTreeTokenType.CODE_BLOCK;
}

function shouldMakeArgList(previousToken) {
	return argListPreviousTypes.has(previousToken.type);
}

function isForMethodImplementation(previousToken) {
	return previousToken.parentNode.type === ParseTreeTokenType.METHOD;
}

function canBeMethodCallRootToken(token) {
	const parent = token.parentNode;
	if (parent === null || parent.type === ParseTreeTokenType.NEW)
		return true;
	if (parent.type === ParseTreeTokenType.INDEX_EXPRESSION) {
		return !endsWithSquareRightBracket(parent);
	}
	if (methodCallTokenTypes.has(parent.type)) {
		const firstChild = parent.children[0];
		if (firstChild !== undefined && firstChild.type === ParseTreeTokenType.COLON)
			return true;
		return false;
	}
	return true;
}

function getMethodCallRootToken(token) {
	if (token.type === ParseTreeTokenType.NEW &&
	token.children.length !== 0) {
		return token.children[token.children.length - 1];
	}
	while (!canBeMethodCallRootToken(token))
		token = token.parentNode;
	return token;
}

function isForMethodCall(token) {
	if (!methodCallTokenTypes.has(token.type))
		return false;
	const root = getMethodCallRootToken(token);
	const rootParent = root.parentNode;
	if (rootParent === null)
		return false;
	if (nonMethodCallParentTypes.has(rootParent.type))
		return false;
	return true;
}

function isForConstructor(token) {
	if (token.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	const parent = token.parentNode;
	if (parent.type !== ParseTreeTokenType.CLASS_BODY)
		return false;
	const grandParent = parent.parentNode;
	if (grandParent.type !== ParseTreeTokenType.CLASS)
		return false;
	const first = grandParent.children[0];
	if (first.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return first.val === token.val;
}

function isGoodPrevious(token) {
	if (token.type === ParseTreeTokenType.ARG_LIST && endsWithClosingCurvedBracket(token))
		return false;
	if (token.type === ParseTreeTokenType.IDENTIFIER && token.children.length >= 1)
		return false;
	if (token.type === ParseTreeTokenType.DOT && token.children.length >= 1)
		return false;
	return true;
}

function getGoodPrevious(token) {
	while (!isGoodPrevious(token))
		token = token.parentNode;
	return token;
}

export function processCurvedLeftBracket(previousToken, nextToken) {
	previousToken = getGoodPrevious(previousToken);
	setCodeBlockParentIfNeeded(previousToken);
	if (shouldMakeArgList(previousToken)) {
		const dataTypeToken = getDataTypeToken(previousToken);
		let type = ParseTreeTokenType.METHOD;
		if (previousToken.type === ParseTreeTokenType.DATA_TYPE)
			type = ParseTreeTokenType.METHOD_CALL;
		if (type === ParseTreeTokenType.METHOD && dataTypeToken !== undefined) {
			if (dataTypeToken.type === ParseTreeTokenType.IDENTIFIER)
				dataTypeToken.type = ParseTreeTokenType.DATA_TYPE;
			const methodNameToken = previousToken;
			const dataTypeParent = dataTypeToken.parentNode;
			const method = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, type);
			dataTypeToken.remove();
			methodNameToken.remove();
			method.appendChild(dataTypeToken);
			method.appendChild(methodNameToken);
			dataTypeParent.appendChild(method);
		}
		else if (type === ParseTreeTokenType.METHOD_CALL) {
			previousToken.type = ParseTreeTokenType.IDENTIFIER;
		}
		const argListToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.ARG_LIST);
		argListToken.appendChild(nextToken);
		if (isForMethodCall(previousToken)) {
			previousToken = getMethodCallRootToken(previousToken);
			const methodCallParent = previousToken.parentNode;
			const methodCallToken = new ParseTreeToken(null, previousToken.lineIndex,
			previousToken.colIndex, ParseTreeTokenType.METHOD_CALL);
			previousToken.remove();
			methodCallToken.appendChild(previousToken);
			methodCallToken.appendChild(argListToken);
			methodCallParent.appendChild(methodCallToken);
		}
		else {
			if (isForMethodImplementation(previousToken))
				previousToken.appendSibling(argListToken);
			else {
				if (isForConstructor(previousToken))
					previousToken.type = ParseTreeTokenType.CONSTRUCTOR;
				previousToken.appendChild(argListToken);
			}
		}
	}
	else if (previousToken.type === ParseTreeTokenType.FOR) {
		const forLoopSettings = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.FOR_LOOP_SETTINGS);
		forLoopSettings.appendChild(nextToken);
		previousToken.appendChild(forLoopSettings);
	}
	else {
		let groupType = ParseTreeTokenType.CURVED_BRACKET_EXPRESSION;
		if (previousToken.type === ParseTreeTokenType.DECLARATION) {
			previousToken.type = ParseTreeTokenType.METHOD;
			groupType = ParseTreeTokenType.ARG_LIST;
		}
		else if (previousToken.type === ParseTreeTokenType.CURVED_BRACKET_EXPRESSION) {
			const typeCasting = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, ParseTreeTokenType.TYPE_CASTING);
			const parent = previousToken.parentNode;
			previousToken.remove();
			typeCasting.appendChild(previousToken);
			parent.appendChild(typeCasting);
			previousToken = typeCasting;
		}
		const exprToken = new ParseTreeToken(null, nextToken.lineIndex, nextToken.colIndex, groupType);
		exprToken.appendChild(nextToken);
		addNext(previousToken, exprToken);
	}
};