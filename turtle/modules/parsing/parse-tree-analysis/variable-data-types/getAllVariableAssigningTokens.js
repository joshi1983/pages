import { getParseTokensSorted } from '../../parse-tree-token/getParseTokensSorted.js';
import { isVariableAssignmentToken } from './isVariableAssignmentToken.js';

export function getAllVariableAssigningTokens(cachedParseTree) {
	const result = cachedParseTree.getCommandCallsByNames(['make', 'localmake', 'for']).
	filter(isVariableAssignmentToken);
	getParseTokensSorted(result);
	return result;
};