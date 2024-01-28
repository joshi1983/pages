import { flatten } from
'../../../../generic-parsing-utilities/flatten.js';
import { isUsingContext } from './isUsingContext.js';
import { parse } from
'../../../../js-parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../js-parsing/ParseTreeTokenType.js';
import { removeSemicolonsImmediatelyAfter } from './removeSemicolonsImmediatelyAfter.js';

export function setValueStackDecreaseAmount(decreaseToken, decreaseTotal, tokensToRemove) {
	if (decreaseTotal === 0) {
		removeSemicolonsImmediatelyAfter(decreaseToken);
		decreaseToken.remove();
		return;
	}
	const useContext = isUsingContext(decreaseToken);
	decreaseToken.val = '-=';
	decreaseToken.type = ParseTreeTokenType.ASSIGNMENT_OPERATOR;
	tokensToRemove.forEach(token => token.remove());
	let lineOfCode;
	if (useContext)
		lineOfCode = `context.valueStack.length -= ${decreaseTotal};`;
	else
		lineOfCode = `valueStack.length -= ${decreaseTotal};`;
	const parseResult = parse(lineOfCode);
	const newTokens = flatten(parseResult.root);
	newTokens.forEach(tok => tok.lineIndex = decreaseToken.lineIndex);
	const newStartToken = newTokens.filter(tok => tok.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR && tok.val === '-=')[0];
	const newSemicolonToken = newTokens.filter(tok => tok.type === ParseTreeTokenType.SEMICOLON)[0];
	removeSemicolonsImmediatelyAfter(decreaseToken);
	decreaseToken.appendSibling(newSemicolonToken);
	decreaseToken.parentNode.replaceChild(decreaseToken, newStartToken);
};