import { denoiseParseMessages } from '../../../../modules/parsing/parse-tree-analysis/denoising/denoiseParseMessages.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';

export function testDenoiseParseMessages(logger) {
	const code = 'to p\nend\nto p\nend';
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const messages = [];
	denoiseParseMessages(cachedParseTree, messages);
};