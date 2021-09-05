import { filterBracketsAndCommas } from '../helpers/filterBracketsAndCommas.js';
import { forToInitToken } from './forToInitToken.js';
import { forToConditionToken } from './forToConditionToken.js';
import { forToIncrementToken } from './forToIncrementToken.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';
import { processTokens } from '../helpers/processTokens.js';

export function canBeTranslatedAsComplexWhile(forToken) {
	const stepToken = forToIncrementToken(forToken);
	return stepToken !== undefined;
};

export function translateToComplexWhile(forToken, result, settings) {
	const initToken = forToInitToken(forToken);
	const conditionToken = forToConditionToken(forToken);
	const stepToken = forToIncrementToken(forToken);
	const children = forToken.children;
	let codeBlock = children[children.length - 1];
	if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK)
		codeBlock = undefined;

	processToken(initToken, result, settings);
	result.append('\nwhile ');
	processToken(conditionToken, result, settings);
	result.append(' [\n');
	if (codeBlock !== undefined)
		processTokens(filterBracketsAndCommas(codeBlock.children), result, settings);

	processToken(stepToken, result, settings);
	result.append('\n]\n');
};