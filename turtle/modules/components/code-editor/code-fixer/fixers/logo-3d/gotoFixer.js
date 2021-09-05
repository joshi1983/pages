import { ParseTreeToken } from '../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';

function isGotoOfInterest(token) {
	if (token.val.toLowerCase() !== 'goto')
		return false;
	const next = token.nextSibling;
	return next !== null && next.type === ParseTreeTokenType.LEAF;
}

function isMarkOrOmark(token) {
	const val = token.val.toLowerCase();
	if (val !== 'mark' && val !== 'omark')
		return false;
	const next = token.nextSibling;
	if (next === null || next.type !== ParseTreeTokenType.LEAF)
		return false;
	return true;
}

export function gotoFixer(cachedParseTree, fixLogger) {
	const leafs = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF);
	const gotos = leafs.filter(isGotoOfInterest);
	const marks = leafs.filter(isMarkOrOmark);
	const nameTypeMap = new Map();
	marks.forEach(function(markToken) {
		const oldVal = markToken.val.toLowerCase();
		const varNameToken = markToken.nextSibling;
		markToken.val = 'make';
		markToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		varNameToken.type = ParseTreeTokenType.STRING_LITERAL;
		varNameToken.remove();
		markToken.appendChild(varNameToken);
		cachedParseTree.tokenTypeChanged(markToken, ParseTreeTokenType.LEAF);
		cachedParseTree.tokenTypeChanged(varNameToken, ParseTreeTokenType.LEAF);
		let cmdName;
		if (oldVal === 'mark')
			cmdName = 'pos';
		else
			cmdName = 'turtleState';
		const posToken = new ParseTreeToken(cmdName, null, varNameToken.lineIndex, varNameToken.colIndex + 1, ParseTreeTokenType.PARAMETERIZED_GROUP);
		markToken.appendChild(posToken);
		cachedParseTree.tokenAdded(posToken);
		fixLogger.log(`Converted ${oldVal} to make "${varNameToken.val} ${cmdName} because that is how WebLogo stores positions`, markToken);
		nameTypeMap.set(varNameToken.val, cmdName);
	});
	gotos.forEach(function(gotoToken) {
		const oldGotoVal = gotoToken.val;
		const nameToken = gotoToken.nextSibling;
		nameToken.type = ParseTreeTokenType.VARIABLE_READ;
		if (nameTypeMap.get(nameToken.val) === 'pos')
			gotoToken.val = 'jumpTo';
		else
			gotoToken.val = 'setTurtleState';
		gotoToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		nameToken.remove();
		gotoToken.appendChild(nameToken);
		cachedParseTree.tokenTypeChanged(gotoToken, ParseTreeTokenType.LEAF);
		cachedParseTree.tokenTypeChanged(nameToken, ParseTreeTokenType.LEAF);
		cachedParseTree.tokenValueChanged(gotoToken, oldGotoVal);
		fixLogger.log(`Converted call to ${oldGotoVal} to ${gotoToken.val} because that is how we move to a specified location in WebLogo`, gotoToken);
	});
};