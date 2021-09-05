import { canBeTranslatedToIf } from './switch/canBeTranslatedToIf.js';
import { hasACase } from './switch/hasACase.js';
import { mightHaveSideEffects } from
'../../mightHaveSideEffects.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processInGeneral } from './processInGeneral.js';
import { processSwitchAsIf } from './switch/processSwitchAsIf.js';
import { processSwitchValueToken } from './switch/processSwitchValueToken.js';
import { processTokens } from './helpers/processTokens.js';

const unprocessedSwitchBlockChildTypes = new Set([
ParseTreeTokenType.CURLY_LEFT_BRACKET,
ParseTreeTokenType.CURLY_RIGHT_BRACKET
]);

function processSwitchBlock(processToken, block, result) {
	processTokens(processToken, block.children.filter(c => !unprocessedSwitchBlockChildTypes.has(c.type)), result);
}

export function processSwitch(processToken) {
	if (typeof processToken !== 'function')
		throw new Error(`processToken expected to be a function but got ${processToken}`);
	return function(token, result, settings) {
		result.processCommentsUpToToken(token);
		if (token.children.length === 0)
			return;
		if (canBeTranslatedToIf(token)) {
			processSwitchAsIf(processToken, token, result, settings);
			return;
		}
		if (!hasACase(token))
			processSwitchValueToken(processToken, token.children[0], result, settings);
		if (token.children.length === 1)
			return;
		const codeBlock = token.children[1];
		if (codeBlock.type === ParseTreeTokenType.CODE_BLOCK)
			processSwitchBlock(processToken, codeBlock, result, settings);
		else
			processInGeneral(processToken)(codeBlock, result, settings);
	};
};