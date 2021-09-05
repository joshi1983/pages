import { processToken } from '../processToken.js';

export function make(token, result) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	const variableName = children[0].val;
	const valToken = children[1];
	if (valToken !== undefined &&
	typeof variableName === 'string') {
		result.append(`\n${variableName} = `);
		processToken(valToken, result);
	}
};