import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { processTokens } from
'../helpers/processTokens.js';

export function getToNameForPalette(token) {
	const argList = token.children[1];
	const argValues = argList.children.filter(mightBeDataValue);
	if (argValues.length === 0)
		return 'qbPalette_0';
	else if (argValues.length === 2)
		return 'qbPalette_2';
};

export function palette(token, result, options) {
	const name = getToNameForPalette(token);
	result.append(` ${name} `);
	processTokens(token.children[1].children.filter(mightBeDataValue), result, options);
};