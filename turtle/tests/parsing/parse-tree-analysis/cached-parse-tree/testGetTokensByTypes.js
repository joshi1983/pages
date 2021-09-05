import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getTokensByTypes } from '../../../../modules/parsing/parse-tree-analysis/cached-parse-tree/getTokensByTypes.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';

export function testGetTokensByTypes(logger) {
	const code = 'fd 100';
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const result = getTokensByTypes(cachedParseTree, [
		ParseTreeTokenType.PARAMETERIZED_GROUP,
		ParseTreeTokenType.NUMBER_LITERAL
	]);
	if (result.length !== 2) {
		logger(`Length expected to be 2 but got ${result.length}`);
	}
};