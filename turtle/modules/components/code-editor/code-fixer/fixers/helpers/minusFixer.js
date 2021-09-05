import { flatten } from
'../../../../../parsing/generic-parsing-utilities/flatten.js';
import { getParseTokensSorted } from
'../../../../../parsing/parse-tree-token/getParseTokensSorted.js';
import { insertIntoCode } from
'./insertIntoCode.js';
import { isInstructionList } from
'../../../../../parsing/parse-tree-analysis/isInstructionList.js';
import { LogoParser } from
'../../../../../parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function getPreviousToken(allTokens, token) {
	const index = allTokens.indexOf(token);
	if (index > 0) {
		const prev = allTokens[index - 1];
		return prev;
	}
}

function isOfInterest(allTokens) {
	return function(token) {
		if (token.type !== ParseTreeTokenType.NUMBER_LITERAL)
			return false;
		const parent = token.parentNode;
		if (parent === null)
			return false;
		if (parent.type !== ParseTreeTokenType.TREE_ROOT &&
		!isInstructionList(parent))
			return false;
		if (token.children.length !== 0)
			return false;
		if (token.previousSibling === null)
			return false;
		if (token.type !== ParseTreeTokenType.NUMBER_LITERAL)
			return false;
		if (token.originalString !== undefined) {
			if (token.val >= 0)
				return false;
			const prev = getPreviousToken(allTokens, token);
			if (prev !== undefined) {
				if (prev.lineIndex === token.lineIndex) {
					const prevColIndex = token.colIndex - token.originalString.length + 1;
					if (prev.colIndex >= prevColIndex)
						return false;
				}
				return true;
			}
			else
				return false;
		}
		return false;
	}
}

/*
Converts unary operator - to binary operator - in cases where it should be.
Adds a space between the - and the token right of it to help the parser treat it as a binary operator.
*/
export function minusFixer(code, fixLogger) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined)
		return code;
	const allTokens = flatten(tree);
	getParseTokensSorted(allTokens);
	const tokens = allTokens.filter(isOfInterest(allTokens));
	if (tokens.length === 0)
		return code;
	const insertionPoints = tokens.map(function(token) {
		const s = token.toString();
		const colIndex = token.colIndex - s.length + 2;
		fixLogger.log(`Inserted a space after the - sign to turn it into a binary operator`, token);
		return {
			'lineIndex': token.lineIndex,
			'colIndex': colIndex
		};
	});
	return insertIntoCode(code, insertionPoints, ' ');
};