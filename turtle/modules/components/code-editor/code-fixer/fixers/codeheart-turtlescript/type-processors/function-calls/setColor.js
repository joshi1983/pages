import { argListToParameterValueTokens } from './argListToParameterValueTokens.js';
import { processColourArguments } from './processColourArguments.js';

export function setColor(callToken, result) {
	const paramValueTokens = argListToParameterValueTokens(callToken.children[1]);
	if (paramValueTokens.length !== 0) {
		result.append('setPenColor ');
		processColourArguments(paramValueTokens, result, 255);
		result.append('\n');
	}
};