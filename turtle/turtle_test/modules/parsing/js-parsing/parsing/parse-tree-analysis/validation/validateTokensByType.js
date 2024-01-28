import { validateToken } from './type-validators/validateToken.js';

export function validateTokensByType(tokens, parseLogger) {
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		validateToken(token, parseLogger);
	}
};