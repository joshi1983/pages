import { filterBracketsAndCommas } from
'./helpers/filterBracketsAndCommas.js';
import { forToCodeBlock } from
'./for-loops/forToCodeBlock.js';
import { forToRepeatCount } from
'./for-loops/forToRepeatCount.js';
import { getReadsForTranslation } from
'./for-loops/getReadsForTranslation.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from
'./processToken.js';
import { processTokens } from
'./helpers/processTokens.js';
import { shouldTranslateToRepeat } from
'./for-loops/shouldTranslateToRepeat.js';
import { canBeTranslatedAsComplexWhile, translateToComplexWhile } from
'./for-loops/translateToComplexWhile.js';

function shouldTranslateToForever(children) {
	return children.length === 1 &&
		children[0].type === ParseTreeTokenType.CODE_BLOCK;
}

function shouldTranslateToWhile(children) {
	if (!(children instanceof Array))
		throw new Error(`children must be an Array but found ${children}`);
	const codeBlock = children[1];
	if (codeBlock === undefined || codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
		return false;
	if (children.length > 2)
		return false;
	return true;
}

function addRepcountsFor(map, tokens) {
	for (const token of tokens) {
		map.set(token, function(token, result) {
			result.append('repcount ');
		});
	}
}

export function processFor(token, result, settings) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (shouldTranslateToForever(children)) {
		result.append('\nforever [\n');
		processTokens(filterBracketsAndCommas(children[0].children), result, settings);
		result.append('\n]\n');
	}
	else if (shouldTranslateToWhile(children)) {
		result.append('\nwhile ');
		processToken(children[0], result, settings);
		result.append(' [\n');
		processTokens(filterBracketsAndCommas(children[1].children), result, settings);
		result.append('\n]\n');
	}
	else {
		const useRepeat = shouldTranslateToRepeat(token);
		const repeatCount = forToRepeatCount(token);
		const codeBlock = forToCodeBlock(token);
		if (useRepeat && repeatCount !== undefined) {
			const reads = getReadsForTranslation(token);
			addRepcountsFor(settings.tokenProcessors, reads);
			result.append(`\nrepeat ${repeatCount} [`);
			if (codeBlock !== undefined)
				processTokens(filterBracketsAndCommas(codeBlock.children), result, settings);
			result.append('\n]\n');
			return;
		}
		else if (canBeTranslatedAsComplexWhile(token)) {
			translateToComplexWhile(token, result, settings);
		}
	}
};