import { parsePythonNumberLiteral } from '../../../translation-to-weblogo/type-processors/helpers/parsePythonNumberLiteral.js';

export function getNumberLiteralValue(token) {
	return parsePythonNumberLiteral(token.val);
};