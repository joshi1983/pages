import { flatten } from
'../../../../generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../js-parsing/parse.js';
import { ParseTreeToken } from
'../../../../generic-parsing-utilities/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../js-parsing/ParseTreeTokenType.js';
import { parseTreeTokensToCode } from
'../../../../js-parsing/parseTreeTokensToCode.js';
import { tokenToCommandInfo } from
'./token-classifiers/tokenToCommandInfo.js';

function isOfInterest(token) {
	const info = tokenToCommandInfo(token);
	if (info === undefined)
		return false;
	if (info.primaryName !== 'setProperty')
		return false;
	const argList = token.children[1];
	const mapToken = argList.children[1];
	if (mapToken.type !== ParseTreeTokenType.IDENTIFIER || mapToken.children.length !== 0)
		return false;
	return true;
}

/*
Converts something like context.plist.setProperty(result, "x", 3)
to something like result.set("x", 3)
*/
function convertSetPropertyToSet(token) {
	const argList = token.children[1];
	const mapIdentifier = argList.children[1];
	const firstComma = argList.children[2];
	mapIdentifier.lineIndex = token.lineIndex;
	mapIdentifier.colIndex = token.colIndex;
	const dotToken = new ParseTreeToken('.', mapIdentifier.lineIndex, mapIdentifier.colIndex + 1, ParseTreeTokenType.DOT);
	mapIdentifier.appendChild(dotToken);
	const setToken = new ParseTreeToken('set', dotToken.lineIndex, dotToken.colIndex + 1, ParseTreeTokenType.IDENTIFIER);
	dotToken.appendChild(setToken);
	mapIdentifier.remove();
	firstComma.remove();
	token.replaceChild(token.children[0], mapIdentifier);
}

export function optimizeSetProperty(jsCode) {
	const parseResult = parse(jsCode);
	const allTokens = flatten(parseResult.root);
	const interestingTokens = allTokens.filter(isOfInterest);
	if (interestingTokens.length === 0)
		return jsCode;
	interestingTokens.forEach(convertSetPropertyToSet);
	return parseTreeTokensToCode(flatten(parseResult.root));
};