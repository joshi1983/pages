import { filterBracketsAndCommas } from
'../helpers/filterBracketsAndCommas.js';
import { processToken } from '../processToken.js';

export function PrintLn(token, result, settings) {
	result.processCommentsUpToToken(token);
	const argList = token.children[1];
	const argValues = filterBracketsAndCommas(argList.children);
	if (argValues.length === 0) {
		return; // don't output any translation for this call.  no args means nothing can be printed.
	}
	for (let i = 0; i < argValues.length - 1; i++) {
		const argValue = argValues[i];
		result.append('\ntype ');
		processToken(argValue, result, settings);
	}
	result.append('\nprint ');
	processToken(argValues[argValues.length - 1], result, settings);
};