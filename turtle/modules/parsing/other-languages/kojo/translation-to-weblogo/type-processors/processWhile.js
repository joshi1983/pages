import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { processToken } from
'./processToken.js';
import { processTokens } from
'./helpers/processTokens.js';

export function processWhile(token, result, settings) {
	result.processCommentsUpToToken(token);
	const condition = token.children[0];
	const codeBlock = token.children[1];
	if (condition === undefined)
		return;

	result.append('\nwhile ');
	processToken(condition, result, settings);
	result.append(' [\n');
	if (codeBlock !== undefined)
		processTokens(filterBracketsAndCommas(codeBlock.children), result, settings);

	result.append('\n]\n');
};