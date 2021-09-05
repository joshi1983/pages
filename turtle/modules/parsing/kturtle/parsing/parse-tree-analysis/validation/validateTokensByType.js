import { flatten } from '../../../../generic-parsing-utilities/flatten.js';
import { validateToken } from './type-validators/validateToken.js';

export function validateTokensByType(tree, parseLogger) {
	const tokens = flatten(tree);
	for (let i = 0; i < tokens.length; i++) {
		validateToken(tokens[i], parseLogger);
	}
};