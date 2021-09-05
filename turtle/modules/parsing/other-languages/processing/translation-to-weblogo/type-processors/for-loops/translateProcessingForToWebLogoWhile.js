import { forToConditionToken } from './forToConditionToken.js';
import { forToInitToken } from './forToInitToken.js';
import { forTokenToCodeBlock } from './forTokenToCodeBlock.js';
import { forToStepToken } from './forToStepToken.js';
import { processCodeBlock } from '../processCodeBlock.js';
import { processToken } from '../processToken.js';

export function translateProcessingForToWebLogoWhile(forToken, result, settings) {
	const initToken = forToInitToken(forToken);
	const codeBlock = forTokenToCodeBlock(forToken);
	const conditionToken = forToConditionToken(forToken);
	const stepToken = forToStepToken(forToken);
	if (initToken !== null)
		processToken(initToken, result, settings);

	result.append('\nwhile ');
	processToken(conditionToken, result, settings);

	result.append(' [ ');
	if (codeBlock !== null) {
		processCodeBlock(codeBlock, result, settings, false);
	}
	if (stepToken !== null) {
		processToken(stepToken, result, settings);
	}
	result.append(' ] ');
};