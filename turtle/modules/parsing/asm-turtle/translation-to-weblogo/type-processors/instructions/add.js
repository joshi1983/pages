import { processToken } from '../processToken.js';

export function add(token, result, settings) {
	if (token.children.length === 1) {
		result.append(`make "${settings.registerName} :${settings.registerName} + `);
		processToken(token.children[0], result, settings);
	}
	else {
		result.append(`; Unable to translate add instruction because ${token.children.length} operands were found when 1 was expected`);
	}
};