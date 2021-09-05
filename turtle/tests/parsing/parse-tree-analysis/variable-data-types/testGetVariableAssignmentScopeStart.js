import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getTokensByType } from '../../../../modules/parsing/parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { getVariableAssignmentScopeStart } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/getVariableAssignmentScopeStart.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

function isTestCaseVariableRead(token) {
	if (token.val !== 'x' || token.parentNode === null)
		return false;
	if (token.parentNode.type === ParseTreeTokenType.PARAMETERIZED_GROUP && ['localmake', 'make'].indexOf(token.parentNode.val) === -1)
		return false;
	if (token.parentNode.type === ParseTreeTokenType.LIST) {
		if (token.parentNode.parentNode === null)
			return false;
		if (token.parentNode.parentNode.type !== ParseTreeTokenType.PARAMETERIZED_GROUP ||
		token.parentNode.parentNode.val !== 'for')
			return false;
	}

	return true;
}

export function testGetVariableAssignmentScopeStart(logger) {
	const cases = [
		{'code': 'make "x 5', 'startLineIndex': 0},
		{'code': 'fd 100\nmake "x 5', 'startLineIndex': 1},
		{'code': 'repeat 2 [\nmake "x 5\nfd 100\n]', 'startLineIndex': 1},
		{'code': 'repeat 2 [\nfd 100\nmake "x 5\n]', 'startLineIndex': 1},
		{'code': 'repeat 2 [\nfd 100\nif true [\nmake "x 5\n]\n]', 'startLineIndex': 1},
		{'code': 'repeat 1 [\nmake "x 5\nfd 100\n]', 'startLineIndex': 1},
		{'code': 'repeat 1 [\nfd 100\nmake "x 5\n]', 'startLineIndex': 2}, 
		// since it is not repeating more than once, ignore the loop.

		{'code': 'to p\nlocalmake "x 5\nend', 'startLineIndex': 1},
		{'code': 'to p\nrepeat 2 [\nlocalmake "x 5\n]\nend', 'startLineIndex': 2},
		{'code': 'for ["x 0 5 1] [\nprint :x\n]', 'startLineIndex': 1},
		{'code': 'make "x 0\nUNTIL :x>3 [\nmake "x :x+1\nPRINT :x\n]', 'startLineIndex': 0},
		{'code': 'make "i 0\nUNTIL :i>3 [\nmake "x :i+1\nPRINT :x\nmake "i :i+1\n]', 'startLineIndex': 2},
		{'code': 'make "x [1 2]\nqueue "x 5', 'startLineIndex': 0},
		{'code': 'to p :x\n repeat 4 [\n fd :x\n  right 90\n localmake "x 10\n]\n end', 'startLineIndex': 2},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index} with code ${caseInfo.code}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const variableReferenceToken = getTokensByType(cachedParseTree, ParseTreeTokenType.STRING_LITERAL).
			filter(isTestCaseVariableRead)[0];
		if (variableReferenceToken === undefined)
			plogger('Expected to find a localmake or make that assigns a value to variable x but did not.');
		else {
			let assignmentToken = variableReferenceToken.parentNode;
			if (assignmentToken.type === ParseTreeTokenType.LIST)
				assignmentToken = assignmentToken.parentNode;
			const start = getVariableAssignmentScopeStart(cachedParseTree, assignmentToken, assignmentToken);
			if (start.lineIndex !== caseInfo.startLineIndex)
				plogger(`Expected start lineIndex to be ${caseInfo.startLineIndex} but got ${start.lineIndex}`);
		}
	});
};