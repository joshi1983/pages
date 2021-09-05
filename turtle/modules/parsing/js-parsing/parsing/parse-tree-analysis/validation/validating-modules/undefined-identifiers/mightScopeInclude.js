import { declaringTypes } from '../../../../declaringTypes.js';
import { getClosestOfTypes } from '../../../../../../generic-parsing-utilities/getClosestOfTypes.js';
import { getLastTokenForScope } from '../../../getLastTokenForScope.js';
import { hasAncestor } from '../../../../../../generic-parsing-utilities/hasAncestor.js';
import { isAfterOrSame } from '../../../../../../generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeTokenType } from '../../../../../ParseTreeTokenType.js';

function getAssignedToToken(descendentToken) {
	let tok = descendentToken.parentNode;
	while (tok.parentNode !== null) {
		if (tok.parentNode.type === ParseTreeTokenType.CODE_BLOCK)
			return null;
		if (declaringTypes.has(tok.parentNode.type)) {
			if (tok.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR)
				return tok.children[0];
			return null;
		}
		tok = tok.parentNode;
	}
	return null;
}

function hasWideScope(definingToken) {
	if (definingToken.parentNode.type === ParseTreeTokenType.FUNCTION)
		return true;
	return false;
}

export function mightScopeInclude(identifierToken) {
	const excluded = new Set();
	let tok = getAssignedToToken(identifierToken);
	if (tok !== null)
		excluded.add(tok);
	const nearestCodeBlock = getClosestOfTypes(identifierToken, [ParseTreeTokenType.CODE_BLOCK, ParseTreeTokenType.TREE_ROOT]);
	return function(definingToken) {
		if (excluded.has(definingToken))
			return false;
		if (nearestCodeBlock !== null) {
			if (hasWideScope(definingToken)) {
				if (hasAncestor(nearestCodeBlock, definingToken))
					return true;
			}
			const nearestCodeBlockForDefiningToken = getClosestOfTypes(definingToken, [ParseTreeTokenType.CODE_BLOCK, ParseTreeTokenType.TREE_ROOT]);
			if (nearestCodeBlockForDefiningToken === nearestCodeBlock) {
				if (isAfterOrSame(definingToken, identifierToken))
					return false;
			}
			else if (nearestCodeBlockForDefiningToken !== null) {
				if (isAfterOrSame(nearestCodeBlockForDefiningToken, nearestCodeBlock)) {
					return false;
				}
			}
		}
		const lastTokenInScope = getLastTokenForScope(definingToken);
		if (identifierToken !== lastTokenInScope && isAfterOrSame(identifierToken, lastTokenInScope))
			return false;
		return true;
	};
};