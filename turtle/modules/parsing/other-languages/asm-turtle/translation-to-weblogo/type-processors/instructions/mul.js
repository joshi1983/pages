import { processToken } from '../processToken.js';

export function mul(token, result, settings) {
	if (token.children.length === 1) {
		result.append(`make "${settings.registerName} :${settings.registerName} * `);
		processToken(token.children[0], result, settings);
	}
	else {
		result.append(`; Unable to translate mul instruction because the expected operand was missing`);
	}
};