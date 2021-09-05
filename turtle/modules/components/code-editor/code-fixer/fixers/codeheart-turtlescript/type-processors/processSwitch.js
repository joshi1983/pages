import { canBeTranslatedToIf } from './switch/canBeTranslatedToIf.js';
import { hasACase } from './switch/hasACase.js';
import { mightHaveSideEffects } from
'../../../../../../parsing/js-parsing/mightHaveSideEffects.js';
import { ParseTreeTokenType } from
'../../../../../../parsing/js-parsing/ParseTreeTokenType.js';
import { processInGeneral } from './processInGeneral.js';
import { processSwitchAsIf } from './switch/processSwitchAsIf.js';
import { processSwitchValueToken } from './switch/processSwitchValueToken.js';
import { processToken } from './processToken.js';
import { processTokens } from './helpers/processTokens.js';

const unprocessedSwitchBlockChildTypes = new Set([
ParseTreeTokenType.CURLY_LEFT_BRACKET,
ParseTreeTokenType.CURLY_RIGHT_BRACKET
]);

function processSwitchBlock(block, result) {
	processTokens(block.children.filter(c => !unprocessedSwitchBlockChildTypes.has(c.type)), result);
}

export function processSwitch(token, result) {
	result.processCommentsUpToToken(token);
	if (token.children.length === 0)
		return;
	if (canBeTranslatedToIf(token)) {
		processSwitchAsIf(token, result);
		return;
	}
	if (!hasACase(token))
		processSwitchValueToken(token.children[0], result);
	if (token.children.length === 1)
		return;
	const codeBlock = token.children[1];
	if (codeBlock.type === ParseTreeTokenType.CODE_BLOCK)
		processSwitchBlock(codeBlock, result);
	else
		processInGeneral(codeBlock, result);
};