import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	if (token.val !== '#timeout')
		return false;
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.BINARY_OPERATOR) {
		if (parent.val !== '=')
			return false;
		if (parent.children.indexOf(token) !== 0)
			return false;
	}
	return true;
}

function isSecondOperandToBeRemoved(secondOperand) {
	if (secondOperand === undefined)
		return false;
	if (secondOperand.type === ParseTreeTokenType.NUMBER_LITERAL)
		return true;
	return false;
}

export function timeoutFixer(cachedParseTree, fixLogger) {
	const timeouts = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(isOfInterest);
	const removed = [];
	timeouts.forEach(function(timeoutToken) {
		const parent = timeoutToken.parentNode;
		if (parent.type === ParseTreeTokenType.BINARY_OPERATOR) {
			const second = parent.children[1];
			if (isSecondOperandToBeRemoved(second)) {
				second.remove();
				removed.push(second);
			}
			else if (second !== undefined) {
				second.remove();
				parent.appendSibling(second);
			}
			parent.remove();
			removed.push(parent);
		}
		if (timeoutToken.nextSibling !== null &&
		timeoutToken.nextSibling.type === ParseTreeTokenType.NUMBER_LITERAL) {
			const numToken = timeoutToken.nextSibling;
			numToken.remove();
			cachedParseTree.tokenRemoved(numToken);
		}
		timeoutToken.remove();
		removed.push(timeoutToken);
		fixLogger.log(`Removed #timeout because nothing similar is supported in WebLogo`, timeoutToken);
	});
	cachedParseTree.tokensRemoved(removed);
};