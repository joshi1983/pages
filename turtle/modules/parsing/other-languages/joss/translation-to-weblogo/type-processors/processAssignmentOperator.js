import { processToken } from './processToken.js';

function getMakeCommandFor(token) {
	return 'make';
	// FIXME: if token should be translated to part of a procedure, 
	// localmake should be returned.
}

export function processAssignmentOperator(token, result) {
	const children = token.children;
	if (children.length === 2) {
		const makeCommand = getMakeCommandFor(token);
		const variableName = children[0].val;
		result.append(`\n${makeCommand} "${variableName} `);
		processToken(children[1], result);
		result.append('\n');
	}
};