import { parsePythonNumberLiteral } from '../../../new-translation-to-weblogo/type-processors/helpers/parsePythonNumberLiteral.js';

export function getNumberLiteralValue(token) {
	return parsePythonNumberLiteral(token.val);
};