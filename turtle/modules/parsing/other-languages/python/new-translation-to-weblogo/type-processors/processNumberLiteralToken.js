import { parsePythonNumberLiteral } from './helpers/parsePythonNumberLiteral.js';

export function processNumberLiteralToken(token, result, cachedParseTree) {
	const val = token.val;
	const parsed = parsePythonNumberLiteral(val);
	if (parsed !== undefined)
		result.append('' + parsed);
	else
		result.append(`${val}`);
};