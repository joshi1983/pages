import { parseDataTypeString } from '../../data-types/data-type-parsing/parseDataTypeString.js';
import { toString } from '../../data-types/data-type-parsing/toString.js';

const inputOutputPairs = new Map([
	['alphacolorlist', 'list<num>'], // list<num> of lengths 3 or 4 becomes list<num> of length 2 or 3.
	// We'd return 'colorlist' except that would exclude list<num> of length 2 which is also possible.

	['alphacolorlist|alphacolorstring', 'list<num>|string'],
	['alphacolorlist|colorstring', 'list<num>|string'],
	['alphacolorstring', 'string'],
	['alphacolorstring|list', 'list|string'],
	['colorlist', 'list<num>'],
	['colorlist|string', 'list<num>|string'],
	['colorlist|colorstring', 'list<num>|string'],
	['colorstring', 'string'],
	['colorstring|list', 'list|string'],
	['string', 'string'],
	['list', 'list'],
	['list|string', 'list|string'],
]);

function butFirstUsingParsedTypes(parameterTypes) {
	parameterTypes = parseDataTypeString(parameterTypes);
	const result = [];
	const listTypeTokens = parameterTypes.children.filter(token => token.val.indexOf('list') !== -1);
	if (listTypeTokens.length !== 0) {
		if (listTypeTokens.length === 1)
			result.push(toString(listTypeTokens[0]));
		else
			result.push('list');
	}
	if (parameterTypes.children.some(token => token.val.indexOf('string') !== -1))
		result.push('string');
	return result.join('|');
}

export function butFirstAndButLast(parameterTypes) {
	if (parameterTypes === undefined)
		return 'list|string';
	if (inputOutputPairs.has(parameterTypes))
		return inputOutputPairs.get(parameterTypes);
	if (parameterTypes.indexOf('<') !== -1)
		return butFirstUsingParsedTypes(parameterTypes);
	if (parameterTypes.indexOf('string') !== -1) {
		if (parameterTypes.indexOf('list') !== -1)
			return 'list|string';
		return 'string';
	}
	if (parameterTypes.indexOf('list') !== -1)
		return 'list';
	return 'list|string';
};