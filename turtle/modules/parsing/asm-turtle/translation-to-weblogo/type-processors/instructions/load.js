import { processToken } from '../processToken.js';

export function load(token, result, settings) {
	if (token.children.length === 1) {
		result.append(`make "${settings.registerName} `);
		processToken(token.children[0], result, settings);
	}
	else {
		result.append(`;FIXME: Unable to translate load instruction`);
	}
};