import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processCodeBlock } from '../processCodeBlock.js';
import { processToken } from '../processToken.js';

export function processProcessingIfToWebLogoIfelse(token, result, settings) {
	const children = token.children;
	const conditionToken = children[0];
	const codeBlock = children[1];
	result.append('ifelse ');
	processToken(conditionToken, result, settings);
	result.append(' [\n');
	processCodeBlock(codeBlock, result, settings, false);
	result.append('\n] [\n');

	let nestLevel = 0;
	for (const ifelse of children.filter(t => t.type === ParseTreeTokenType.ELSE_IF)) {
		const ifToken = ifelse.children[0];
		if (ifToken !== undefined && ifToken.type === ParseTreeTokenType.IF &&
		ifToken.children.length === 2) {
			const ifChildren = ifToken.children;
			const condition = ifChildren[0];
			const codeBlock = ifChildren[1];
			if (codeBlock.type === ParseTreeTokenType.CODE_BLOCK) {
				result.append('\nifelse ');
				processToken(condition, result, settings);
				result.append(' [\n');
				processCodeBlock(codeBlock, result, settings, false);
				result.append('\n] [\n');
				nestLevel++;
			}
		}
	}
	const else1 = children.filter(t => t.type === ParseTreeTokenType.ELSE)[0];
	if (else1 !== undefined &&
	else1.children.length === 1) {
		const codeBlock1 = else1.children[0];
		if (codeBlock1.type === ParseTreeTokenType.CODE_BLOCK) {
			processCodeBlock(codeBlock1, result, settings, false);
		}
	}
	
	for (let i = 0; i < nestLevel; i++) {
		result.append('\n]\n');
	}
};