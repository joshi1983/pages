import { argListToParameterValueTokens } from './argListToParameterValueTokens.js';
import { processColourArguments } from './processColourArguments.js';

export function clear(token, result) {
	result.append('clearScreen\n');
	const argValueTokens = argListToParameterValueTokens(token.children[1]);
	if (argValueTokens.length > 0) {
		result.append('setScreenColor ');
		processColourArguments(argValueTokens, result, 255);
	}
};