import { ForLoops } from '../ForLoops.js';
import { getParseTokensSorted } from '../../parse-tree-token/getParseTokensSorted.js';
import { isVariableAssignmentToken } from './isVariableAssignmentToken.js';

function shouldBeExcludedDueToCodingErrors(token) {
	if (ForLoops.isAForLoopToken(token)) {
		if (token.children.length !== 2)
			return true;
		if (token.children[0].children.length < 3)
			return true;
	}
	return false;
}

export function getAllVariableAssigningTokens(cachedParseTree) {
	const result = cachedParseTree.getCommandCallsByNames(['make', 'localmake', 'for']).
	filter(isVariableAssignmentToken).filter(token => !shouldBeExcludedDueToCodingErrors(token));
	getParseTokensSorted(result);
	return result;
};