import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processColorStringLiteral } from './processColorStringLiteral.js';
import { processToken } from '../processToken.js';

export function processColorValueToken(colourValueToken, result, cachedParseTree) {
	if (colourValueToken.type === ParseTreeTokenType.STRING_LITERAL)
		processColorStringLiteral(colourValueToken, result);
	else {
		processToken(colourValueToken, result, cachedParseTree);
	}
};