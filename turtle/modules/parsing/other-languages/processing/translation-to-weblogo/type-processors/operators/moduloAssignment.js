import { processToken } from '../processToken.js';
import { processAssignmentPrefix } from './processAssignmentPrefix.js';
import { processReadExpression } from './processReadExpression.js';

export function moduloAssignment(token, result, settings) {
	const children = token.children;
	const firstOperandToken = children[0];
	if (children.length === 2) {
		const secondChild = children[1];
		result.append(' ');
		processAssignmentPrefix(firstOperandToken, result, settings);
		result.append(` modulo `);
		processReadExpression(firstOperandToken, result, settings);
		result.append(' ');
		processToken(secondChild, result, settings);
		result.append(' ');
	}
	else {
		result.append(`; Unable to translate usage of %= operator\n`);
		if (children.length !== 2)
			result.append(`; Parsed with ${children.length} child tokens when 2 were expected\n`);
		else
			result.append(`; Failed to get the variable name\n`);
	}
};