import { processToken } from '../processToken.js';
import { shouldUseLocalmake } from './shouldUseLocalmake.js';

export function moduloAssignment(token, result, settings) {
	const children = token.children;
	const variableName = children[0].val;
	if (children.length === 2 && typeof variableName === 'string') {
		const secondChild = children[1];
		result.append(' ');
		if (shouldUseLocalmake(token))
			result.append('local');
		result.append(`make "${variableName} modulo :${variableName} `);
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