import { ParseTreeToken } from '../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';
import { processSelectorChildToken } from './processSelectorChildToken.js';

export function processSquareLeftBracket(prev, next) {
	processSelectorChildToken(prev, next);
	const attSelector = new ParseTreeToken(null, next.lineIndex, next.colIndex, ParseTreeTokenType.ATTRIBUTE_SELECTOR);
	const nextParent = next.parentNode;
	next.remove();
	attSelector.appendChild(next);
	nextParent.appendChild(attSelector);
	return attSelector;
};