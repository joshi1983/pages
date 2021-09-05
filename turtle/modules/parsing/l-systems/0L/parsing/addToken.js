import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processArrow } from './processArrow.js';
import { processAssignment } from './processAssignment.js';
import { processColon } from './processColon.js';
import { processCommandSymbol } from './processCommandSymbol.js';
import { processIdentifier } from './processIdentifier.js';
import { processNumberLiteral } from './processNumberLiteral.js';

const processors = new Map([
	[ParseTreeTokenType.ARROW, processArrow],
	[ParseTreeTokenType.ASSIGNMENT, processAssignment],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.COMMAND_SYMBOL, processCommandSymbol],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.NUMBER_LITERAL, processNumberLiteral]
]);

export function addToken(previousToken, nextToken) {
	const processor = processors.get(nextToken.type);
	if (processor !== undefined) {
		return processor(previousToken, nextToken);
	}
	previousToken.appendChild(nextToken);
	return nextToken;
};