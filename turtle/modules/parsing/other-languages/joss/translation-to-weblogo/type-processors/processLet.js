import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';

function getAssignmentToken(letToken) {
	for (const child of letToken.children) {
		if (child.type === ParseTreeTokenType.BINARY_OPERATOR &&
		child.val === '=') {
			const leftOperand = child.children[0];
			if (leftOperand === undefined ||
			leftOperand.type !== ParseTreeTokenType.FUNCTION_CALL)
				return;

			return child;
		}
	}
}

export function processLet(token, result) {
	const assignmentToken = getAssignmentToken(token);
	if (assignmentToken === undefined) {
		// weird case but lets handle it as gracefully as possible.
		processTokens(token.children, result);
		return;
	}
	const functionCall = assignmentToken.children[0];
	result.append(`\nto `);
	processToken(functionCall, result);
	if (assignmentToken.children.length > 1) {
		result.append('\n\toutput ');
		processToken(assignmentToken.children[1], result);
	}
	result.append('\nend\n');
};