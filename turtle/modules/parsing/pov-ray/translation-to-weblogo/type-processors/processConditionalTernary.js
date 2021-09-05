import { processToken } from './processToken.js';
import { processTokens } from './processTokens.js';

export function processConditionalTernary(token, result) {
	if (token.children.length === 5) {
		result.append(` ifelse `);
		processToken(token.children[0], result);
		result.append(' ');
		processToken(token.children[2], result);
		result.append(' ');
		processToken(token.children[4], result);
	}
	else {
		result.append(`; Failed to translate ternary operator because the expected number of children was 5 but found ${token.children.length}\n`);
	}
};