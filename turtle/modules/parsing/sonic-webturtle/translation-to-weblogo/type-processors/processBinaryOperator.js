import { processToken } from './processToken.js';

export function processBinaryOperator(token, result, settings) {
	if (token.children.length === 2) {
		processToken(token.children[0], result, settings);
		result.append(' ' + token.val + ' ');
		processToken(token.children[1], result, settings);
	}
	else if (token.children.length === 1) {
		processToken(token.children[0], result, settings);
		result.append(' ' + token.val + ' ');
		result.append('; Translation incomplete because\n');
		result.append('; the expression containing operator ' + token.val + '\n');
		result.append('; appeared incomplete in the input code\n');
	}
};