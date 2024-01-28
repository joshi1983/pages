import { CachedParseTree } from '../../parse-tree-analysis/CachedParseTree.js';
import { convertChildren } from './helpers/convertChildren.js';
import { getNextToken } from '../../parse-tree-analysis/getNextToken.js';
import { getRootForParseTreeToken } from '../../../parse-tree-token/getRootForParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const restrictedParentTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.BINARY_OPERATOR,
	ParseTreeTokenType.FUNCTION_DEFINITION,
	ParseTreeTokenType.PRINT
]);

const unsafeToMoveParentTypes = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.FUNCTION_DEFINITION,
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.PRINT
]);

const typesNotToSkipOver = new Set([
	ParseTreeTokenType.IDENTIFIER,
	ParseTreeTokenType.FUNCTION_CALL,
	ParseTreeTokenType.FUNCTION_DEFINITION,
	ParseTreeTokenType.PRINT
]);

function isSafeToMoveToken(tokenToMove) {
	if (unsafeToMoveParentTypes.has(tokenToMove.type))
		return false;
	if (tokenToMove.children[tokenToMove.children.length - 1].type !==
	ParseTreeTokenType.CURVED_RIGHT_BRACKET)
		return false;
	return true;
}

function isChildlessSearchStopToken(token) {
	if (typesNotToSkipOver.has(token.type))
		return true;
	if (token.children.length === 0) {
		if (token.val !== null)
			return true;
	}
	return false;
}

export function convertMethodCallsToFunctionCalls(token) {
	if (token.type === ParseTreeTokenType.IDENTIFIER && token.children.length === 0 &&
	token.parentNode !== null &&
	!restrictedParentTypes.has(token.parentNode.type)
	) {
		const cachedParseTree = new CachedParseTree(getRootForParseTreeToken(token));
		const nextChildless = getNextToken(cachedParseTree, token, isChildlessSearchStopToken);
		if (nextChildless !== undefined && nextChildless.type === ParseTreeTokenType.CURVED_LEFT_BRACKET) {
			const nextChildParent = nextChildless.parentNode;
			if (isSafeToMoveToken(nextChildParent)) {
				token.type = ParseTreeTokenType.FUNCTION_CALL;
				token.appendChild(nextChildParent);
				return true;
			}
		}
	}
	else {
		return convertChildren(token, convertMethodCallsToFunctionCalls);
	}
};