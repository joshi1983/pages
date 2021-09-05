import { processArrow } from './processArrow.js';
import { processAssignment } from './processAssignment.js';
import { processColon } from './processColon.js';
import { processCommandSymbol } from './processCommandSymbol.js';
import { processIdentifier } from './processIdentifier.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

const processors = new Map([
	[ParseTreeTokenType.ARROW, processArrow],
	[ParseTreeTokenType.ASSIGNMENT, processAssignment],
	[ParseTreeTokenType.COLON, processColon],
	[ParseTreeTokenType.COMMAND_SYMBOL, processCommandSymbol],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier]
]);

export function addToken(previousToken, nextToken) {
	const processor = processors.get(nextToken.type);
	if (processor !== undefined) {
		return processor(previousToken, nextToken);
	}
	previousToken.appendChild(nextToken);
	return nextToken;
};