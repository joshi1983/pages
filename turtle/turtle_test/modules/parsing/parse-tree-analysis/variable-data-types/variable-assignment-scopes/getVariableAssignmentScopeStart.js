import { CommandCalls } from '../../CommandCalls.js';
import { getFromLoopToken } from '../variable-scope-start/getFromLoopToken.js';
import { getHighestLoopToken } from '../variable-scope-start/getHighestLoopToken.js';
import { isInProcedure } from '../../isInProcedure.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { safelyMoveGlobalFromTokenDown } from '../variable-scope-start/safelyMoveGlobalFromTokenDown.js';

const rootTypes = new Set([
	ParseTreeTokenType.TREE_ROOT,
	ParseTreeTokenType.PROCEDURE_START_KEYWORD
]);
const terminatingTypes = new Set([
	ParseTreeTokenType.PROCEDURE_START_KEYWORD,
	ParseTreeTokenType.PROCEDURE_END_KEYWORD,
	ParseTreeTokenType.TREE_ROOT
]);

export function getVariableAssignmentScopeStart(cachedParseTree, fromToken, assignToken) {
	if (fromToken.type === ParseTreeTokenType.PROCEDURE_END_KEYWORD) {
		if (isInProcedure(assignToken))
			return fromToken;
	}
	if (fromToken.type === ParseTreeTokenType.LIST || terminatingTypes.has(fromToken.type)) {
		if (fromToken.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
			return safelyMoveGlobalFromTokenDown(fromToken);
		}
		return fromToken;
	}
	if (fromToken.parentNode === null || rootTypes.has(fromToken.parentNode.type)) {
		if (CommandCalls.tokenMatchesPrimaryName(fromToken, 'for')) {
			return getFromLoopToken(fromToken);
		}
		return fromToken;
	}
	const parentNode = fromToken.parentNode;
	const highestLoopToken = getHighestLoopToken(parentNode);
	if (highestLoopToken !== undefined && highestLoopToken.children.length !== 0) {
		fromToken = getFromLoopToken(highestLoopToken);
	}
	return fromToken;
};