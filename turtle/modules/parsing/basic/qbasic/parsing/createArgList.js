import { ParseTreeToken } from
'../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';

export function createEmptyArgList(location) {
	return new ParseTreeToken(null,
		location.lineIndex, location.colIndex,
		ParseTreeTokenType.ARG_LIST);
}

export function createArgList(next) {
	const result = createEmptyArgList(next);
	result.appendChild(next);
	return result;
};