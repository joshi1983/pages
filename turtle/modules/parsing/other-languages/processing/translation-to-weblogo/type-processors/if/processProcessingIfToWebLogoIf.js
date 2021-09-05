import { processCodeBlock } from '../processCodeBlock.js';
import { processToken } from '../processToken.js';

export function processProcessingIfToWebLogoIf(token, result, settings) {
	const children = token.children;
	const conditionToken = children[0];
	const codeBlock = children[1];
	result.append('if ');
	processToken(conditionToken, result, settings);
	result.append(' [\n');
	processCodeBlock(codeBlock, result, settings, false);
	result.append('\n]\n');
};