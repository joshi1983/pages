import { isArrayToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/isArrayToken.js';
import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { processToken } from
'../processToken.js';

function getMainArgValueToken(token) {
	const argList = token.children[1];
	if (argList === undefined)
		return;

	const argValueTokens = argList.children.filter(mightBeDataValue);
	if (argValueTokens.length === 0)
		return;

	return argValueTokens[0];
}

export function getToName(token, options) {
	const mainArgValueToken = getMainArgValueToken(token);

	// if the argument is an array, return undefined.
	if (isArrayToken(mainArgValueToken, options))
		return;
	return 'qbPointGetCoordinate';
};

export function point(token, result, options) {
	const name = getToName(token, options);
	if (name === undefined) {
		result.append(' -1 ');
		return;
	}
	const mainValueToken = getMainArgValueToken(token);
	result.append(` ${name} `);
	processToken(mainValueToken, result, options);
	result.append('\n');
};