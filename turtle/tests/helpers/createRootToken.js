import { ParseTreeToken } from '../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../modules/parsing/ParseTreeTokenType.js';

export function createRootToken(logger) {
	return new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
};