import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processMultiVariableAssignmentFromSingleVariable } from
'./processMultiVariableAssignmentFromSingleVariable.js';
import { processToken } from '../processToken.js';

const ignoredTypes = new Set([
	ParseTreeTokenType.COMMA,
	ParseTreeTokenType.SQUARE_LEFT_BRACKET,
	ParseTreeTokenType.SQUARE_RIGHT_BRACKET,
]);

function isPossibleValueToken(token) {
	return !ignoredTypes.has(token.type);
}

/*
Processes assignments like:
x, y = 1, 2
*/
export function processMultiVariableAssignment(token, result, cachedParseTree, isLocal) {
	const children = token.children;
	if (children.length !== 2)
		return false;

	const leftSide = children[0];
	const leftChildren = leftSide.children.filter(isPossibleValueToken);
	if (leftSide.val !== null || leftSide.children.length === 0 || leftChildren.length === 0)
		return false;

	const rightSide = children[1];
	if (rightSide.type === ParseTreeTokenType.IDENTIFIER)
		return processMultiVariableAssignmentFromSingleVariable(token, result, isLocal, leftChildren);

	const rightChildren = rightSide.children.filter(isPossibleValueToken);
	if (rightSide.children.length !== leftSide.children.length ||
	rightChildren.length !== leftChildren.length)
		return false;

	if (leftChildren.some(t => t.type !== ParseTreeTokenType.IDENTIFIER))
		return false;

	const makeCommand = isLocal ? 'localmake' : 'make';
	for (let i = 0; i < leftChildren.length; i++) {
		const varName = leftChildren[i].val;
		result.append(`\n${makeCommand} "${varName} `);
		processToken(rightChildren[i], result, cachedParseTree);
	}
	result.append('\n');
	return true;
};