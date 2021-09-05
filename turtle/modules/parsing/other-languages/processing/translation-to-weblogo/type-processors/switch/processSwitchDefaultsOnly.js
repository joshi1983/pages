import { doNotTranslateBreaks } from './doNotTranslateBreaks.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processCodeBlock } from '../processCodeBlock.js';
import { switchToCodeBlock } from './switchToCodeBlock.js';

export function processSwitchDefaultsOnly(switchToken, result, settings) {
	const codeBlock = switchToCodeBlock(switchToken);
	for (const default1 of codeBlock.children.filter(t => t.type === ParseTreeTokenType.DEFAULT)) {
		const defaultCodeBlock = default1.children.filter(t => t.type === ParseTreeTokenType.CODE_BLOCK)[0];
		if (defaultCodeBlock !== undefined) {
			doNotTranslateBreaks(defaultCodeBlock, settings);
			processCodeBlock(defaultCodeBlock, result, settings, false);
		}
	}
};