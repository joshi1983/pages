import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { validateIdentifier } from '../../../../parsing/parse-tree-analysis/validateIdentifier.js';

/*
dotimes is a command from the Microworlds Logo interpreter.
It is very similar to the for command in FMSLogo, WebLogo...

The settings in Microworlds dotimes don't have the initial value that is required
by the for command, though.
*/
function isOfInterest(token) {
	const name = token.val.toLowerCase();
	if (name !== 'dotimes')
		return false;
	const nextSibling = token.nextSibling;
	if (nextSibling === null ||
	nextSibling.type !== ParseTreeTokenType.LIST ||
	nextSibling.nextSibling === null ||
	nextSibling.nextSibling.type !== ParseTreeTokenType.LIST)
		return false;
	if (nextSibling.children.length < 4)
		return false; // too few children to be a valid Microworlds dotimes command parameter
	if (typeof nextSibling.children[1].val !== 'string')
		return false; // can't be a variable name so it can't be translated to one in a for-loop.
	if (validateIdentifier(nextSibling.children[1].val) !== undefined)
		return false; // invalid identifier so can't be translated to a for-loop variable.
	if (nextSibling.children[2].type !== ParseTreeTokenType.NUMBER_LITERAL)
		return false; 
		// not yet converting non-number-literal dotimes iteration count values.
		// Maybe later.  Adding the tokens for a "- 1" 
		// after a variable reference is just more complexity than needed for now.

	return true;
}

export function doTimesFixer(cachedParseTree, fixLogger) {
	const doTimesCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest);
	if (doTimesCalls.length !== 0) {
		doTimesCalls.forEach(function(doTimesCall) {
			const oldName = doTimesCall.val;
			const loopInstructionList = doTimesCall.nextSibling.nextSibling;
			const settings = doTimesCall.nextSibling;
			const varNameToken = settings.children[1];
			const endValueToken = settings.children[2];
			settings.remove();
			loopInstructionList.remove();
			doTimesCall.appendChild(settings);
			doTimesCall.appendChild(loopInstructionList);
			const initialValueToken = new ParseTreeToken(0, null, varNameToken.lineIndex, varNameToken.colIndex + 1, ParseTreeTokenType.NUMBER_LITERAL);
			initialValueToken.originalString = '0';
			varNameToken.appendSibling(initialValueToken);
			cachedParseTree.tokenAdded(initialValueToken);
			if (varNameToken.type !== ParseTreeTokenType.STRING_LITERAL) {
				const oldType = varNameToken.type;
				varNameToken.type = ParseTreeTokenType.STRING_LITERAL;
				cachedParseTree.tokenTypeChanged(varNameToken, oldType);
			}
			if (endValueToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
				const oldVal = endValueToken.val;
				endValueToken.val--;
				endValueToken.originalString = '' + endValueToken.val;
				cachedParseTree.tokenValueChanged(endValueToken, oldVal);
			}
			doTimesCall.val = 'for';
			cachedParseTree.tokenValueChanged(doTimesCall, oldName);
			doTimesCall.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
			cachedParseTree.tokenTypeChanged(doTimesCall, ParseTreeTokenType.LEAF);
			fixLogger.log(`${oldName} was converted to a for command call because dotimes is not supported in WebLogo.`, doTimesCall);
 		});
	}
};