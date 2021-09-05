import { compareTokenLocations } from '../../../../parsing/parse-tree-token/compareTokenLocations.js';
import { getLastDescendentTokenOf } from '../../../../parsing/parse-tree-token/getLastDescendentTokenOf.js';
import { getParseTokensSorted } from '../../../../parsing/parse-tree-token/getParseTokensSorted.js';
import { getTokenBefore } from './getTokenBefore.js';
import { ParseTreeToken } from '../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
await ParseTreeToken.asyncInit();

export function endifFixer(cachedParseTree, fixLogger) {
	const elses = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(token => token.val.toLowerCase() === 'else');
	if (elses.length !== 0)
		return; // Prevent messing up if-else statements. 
		// The code might use 'else' like a special keyword as it works in many other programming languages but 
		// this fixer won't process that kind of code properly.

	let endifs = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).filter(token =>
		token.val.toLowerCase() === 'endif');
	if (endifs.length !== 0) {
		const ifs = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
			filter(token => token.val.toLowerCase() === 'if' || token.val.toLowerCase() === 'ifelse');
		getParseTokensSorted(ifs);
		endifs.forEach(function(endifToken) {
			const ifToken = getTokenBefore(ifs, endifToken);
			if (ifToken === undefined)
				return; // don't fix an 'endif' that has no if-statement before it.
			if (ifToken.children.length > 1 && ifToken.children[ifToken.children.length - 1].type !== ParseTreeTokenType.LIST) {
				// ifToken.children[0] should be a token representing a boolean expression.
				// Children at index 1 or 2 should be lists.  
				// If it isn't, remove it to make room for a new instruction list.
				const lastChild = ifToken.children[ifToken.children.length - 1];
				ifToken.removeChild(lastChild);
				ifToken.appendSibling(lastChild);
			}
			const ifTokenLastChild = getLastDescendentTokenOf(ifToken);
			const instructionList = new ParseTreeToken(null, null, ifTokenLastChild.lineIndex, ifTokenLastChild.colIndex + 1, ParseTreeTokenType.LIST);
			const firstBracket = new ParseTreeToken('[', null, ifTokenLastChild.lineIndex, ifTokenLastChild.colIndex + 1, ParseTreeTokenType.LEAF);
			instructionList.appendChild(firstBracket);
			for (let n = ifToken.nextSibling; n !== null && compareTokenLocations(n, endifToken) < 0;) {
				const oldN = n;
				n = n.nextSibling;
				oldN.remove();
				instructionList.appendChild(oldN);
			}
			endifToken.remove();
			instructionList.appendChild(endifToken);
			ifToken.appendChild(instructionList);
			const oldValue = endifToken.val;
			endifToken.val = ']';
			cachedParseTree.tokensAdded([firstBracket, instructionList]);
			cachedParseTree.tokenValueChanged(endifToken, oldValue);
			fixLogger.log('Replaced endif with ] in if-statement because WebLogo marks the end of an instruction list with ] instead of endif', endifToken);
		});
	}
};