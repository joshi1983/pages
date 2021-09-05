import { addLineOfCodeIfNeeded } from
'./addLineOfCodeIfNeeded.js';
import { addSquareCaseIfNeeded } from
'./addSquareCaseIfNeeded.js';
import { isCompleteWithNext } from
'./isCompleteWithNext.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { processBinaryOperator } from './processBinaryOperator.js';
import { processCurvedLeftBracket } from './processCurvedLeftBracket.js';
import { processIdentifier } from './processIdentifier.js';
import { processPipe } from './processPipe.js';
import { processSquareLeftBracket } from './processSquareLeftBracket.js';

const processors = new Map([
	[ParseTreeTokenType.BINARY_OPERATOR, processBinaryOperator],
	[ParseTreeTokenType.CURVED_LEFT_BRACKET, processCurvedLeftBracket],
	[ParseTreeTokenType.IDENTIFIER, processIdentifier],
	[ParseTreeTokenType.PIPE, processPipe],
	[ParseTreeTokenType.SQUARE_LEFT_BRACKET, processSquareLeftBracket]
]);

const addTokensIfNeeded = [
	addLineOfCodeIfNeeded,
	addSquareCaseIfNeeded
];

export function addToken(prev, next) {
	while (isCompleteWithNext(prev, next))
		prev = prev.parentNode;

	for (const addTokenIfNeeded of addTokensIfNeeded) {
		prev = addTokenIfNeeded(prev, next);
	}

	const processor = processors.get(next.type);
	if (processor !== undefined) {
		return processor(prev, next);
	}
	prev.appendChild(next);
	return next;
};