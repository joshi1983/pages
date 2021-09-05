import { declaringTypes } from '../declaringTypes.js';
import { getClosestOfType } from '../../../generic-parsing-utilities/getClosestOfType.js';
import { getClosestOfTypes } from '../../../generic-parsing-utilities/getClosestOfTypes.js';
import { getRootForParseTreeToken } from '../../../parse-tree-token/getRootForParseTreeToken.js';
import { getSortedLastDescendentTokenOf } from '../../../generic-parsing-utilities/getSortedLastDescendentTokenOf.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const blockScopedTypes = new Set([
ParseTreeTokenType.CONST,
ParseTreeTokenType.LET
]);

export function getLastTokenForScope(definingToken) {
	const parent = definingToken.parentNode;
	if (parent !== null && parent.type === ParseTreeTokenType.BINARY_OPERATOR &&
	parent.val === '=>' && parent.children.length === 2) {
		return getSortedLastDescendentTokenOf(parent.children[1]);
	}
	let declareToken = getClosestOfTypes(definingToken, declaringTypes);
	if (definingToken.parentNode.type === ParseTreeTokenType.ARG_LIST) {
		const argListParent = definingToken.parentNode.parentNode;
		if (argListParent.type === ParseTreeTokenType.BINARY_OPERATOR &&
		argListParent.val === '=>') {
			return getSortedLastDescendentTokenOf(argListParent.children[1]);
		}
		else if (argListParent.type === ParseTreeTokenType.FUNCTION ||
		argListParent.type === ParseTreeTokenType.IDENTIFIER ||
		argListParent.type === ParseTreeTokenType.CATCH) {
			return getSortedLastDescendentTokenOf(argListParent.children[argListParent.children.length - 1]);
		}
	}
	if (declareToken !== null) {
		if (blockScopedTypes.has(declareToken.type)) {
			const nearestBlock = getClosestOfType(declareToken, ParseTreeTokenType.CODE_BLOCK);
			if (nearestBlock !== null) {
				return getSortedLastDescendentTokenOf(nearestBlock);
			}
		}
		else if (declareToken.type === ParseTreeTokenType.VAR) {
			const nearestFunction = getClosestOfType(declareToken, ParseTreeTokenType.FUNCTION);
			if (nearestFunction !== null) {
				// try to get the function's code block.
				const codeBlock = nearestFunction.children[nearestFunction.children.length - 1];
				if (codeBlock.type === ParseTreeTokenType.CODE_BLOCK)
					return getSortedLastDescendentTokenOf(codeBlock);
			}
		}
	}
	// return the very last token of the parse tree.
	const root = getRootForParseTreeToken(definingToken);
	return getSortedLastDescendentTokenOf(root);
};