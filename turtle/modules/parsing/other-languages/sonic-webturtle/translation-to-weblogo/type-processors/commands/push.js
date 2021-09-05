import { processToken } from '../processToken.js';

export function push(token, result, settings) {
	if (token.children.length === 1) {
		const child = token.children[0];
		result.append(`push "${settings.stackVariableName} `);
		processToken(child, result, settings);
	}
	else {
		result.append(`; Unable to translate call to push because\n`);
		result.append(`; 1 parameter was expected but ${token.children.length} was found\n`);
	}
};