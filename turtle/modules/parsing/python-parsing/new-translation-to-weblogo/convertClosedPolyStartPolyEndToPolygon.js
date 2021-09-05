import { ArrayUtils } from
'../../../ArrayUtils.js';
import { Command } from
'../../Command.js';
import { CommandCalls } from
'../../parse-tree-analysis/CommandCalls.js';
import { getAllDescendentsAsArray } from
'../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { getTokenValueBasic } from
'../../parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { mightContainExtraSideEffects, mightContainPositionRead } from
'../../../components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyWithPolygon.js';
import { ParseTreeToken } from
'../../ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function mightCauseUnacceptableSideEffect(token) {
	const children = token.children;
	if (children.some(mightContainPositionRead))
		return true;
	if (children.some(mightContainExtraSideEffects))
		return true;
	return false;
}

function isListEqual(listToken1, listToken2) {
	const children1 = listToken1.children;
	const children2 = listToken2.children;
	if (children1.length !== children2.length)
		return false;

	for (let i = 0; i < children1.length; i++) {
		const child1 = children1[i];
		const child2 = children2[i];
		if (child1.isBracket() !== child2.isBracket())
			return false;
		if (!child1.isBracket()) {
			if (child1.type === child2.type &&
			child1.type === ParseTreeTokenType.VARIABLE_READ) {
				if (child1.val.toLowerCase() !== child2.val.toLowerCase())
					return false;
			}
			else {
				const elementVal1 = getTokenValueBasic(child1);
				const elementVal2 = getTokenValueBasic(child2);
				if (elementVal1 !== elementVal2 || elementVal1 === undefined)
					return false;
			}
		}
	}
	return true;
}

function isOfInterest(token) {
	if (!CommandCalls.tokenMatchesPrimaryName(token, 'polyStart'))
		return false;

	const next = token.nextSibling;
	if (!CommandCalls.tokenMatchesPrimaryName(next, 'jumpTo'))
		return false;

	const child = next.children[0];
	if (child === undefined ||
	(child.type !== ParseTreeTokenType.LIST &&
	child.type !== ParseTreeTokenType.VARIABLE_READ))
		return false;
	
	let tok;
	let count = 0;
	for (tok = next.nextSibling; true; tok = tok.nextSibling) {
		if (tok === null ||
		tok.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
			return false;

		const info = Command.getCommandInfo(tok.val);
		if (info.primaryName === 'polyEnd')
			break;

		if (info.primaryName !== 'jumpTo' && info.primaryName !== 'setPos')
			return false;

		if (mightCauseUnacceptableSideEffect(tok))
			return false;

		count++;
	}
	if (count < 3)
		return false;

	const lastChild = tok.previousSibling.children[0];
	if (lastChild === undefined ||
	(child.type !== ParseTreeTokenType.LIST &&
	child.type !== ParseTreeTokenType.VARIABLE_READ))
		return false;

	if (child.type !== lastChild.type)
		return false;

	if (child.type === ParseTreeTokenType.VARIABLE_READ) {
		// For example, polyStart jumpTo :x jumpTo [0 100] jumpTo [100 100] jumpTo :x polyEnd
		return child.val.toLowerCase() === lastChild.val.toLowerCase();
	}
	if (!isListEqual(child, lastChild))
		return false;
	return true;
}

/*
This is similar to components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyWithPolygon 
but with some important differences.
1. This is specific to Python since code like this from Python expresses a filled shape that 
ignores the previous position of turtle.
turtle.begin_fill()
turtle.goto(100, 200)
turtle.goto(200, 200)
turtle.goto(0, 0)
turtle.goto(100, 200)
turtle.end_fill()

This fixer works on the WebLogo parse tree instead of the Python parse tree because
a lot of other fixers could optimize the parse tree before reaching this stage.  
Running the other fixers before convertClosedPolyStartPolyEndToPolygon helps this one catch more opportunities to work well
and with less complicated implementation of convertClosedPolyStartPolyEndToPolygon.js. 

2. Unlike simplifyWithPolygon, convertClosedPolyStartPolyEndToPolygon focuses completely on 
if the first and last jumpTo or setPos positions are the same.
*/
export function convertClosedPolyStartPolyEndToPolygon(cachedParseTree, fixLogger) {
	const polyStarts = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isOfInterest);
	polyStarts.forEach(function(polyStart) {
		const firstPosExpression = polyStart.nextSibling;
		let tok = firstPosExpression.nextSibling;
		const removed = [];
		ArrayUtils.pushAll(removed, getAllDescendentsAsArray(firstPosExpression));
		polyStart.val = 'polygon';
		firstPosExpression.val = '[';
		firstPosExpression.type = ParseTreeTokenType.LEAF;
		cachedParseTree.tokenTypeChanged(firstPosExpression, ParseTreeTokenType.PARAMETERIZED_GROUP);
		firstPosExpression.removeAllChildren();
		firstPosExpression.remove();
		const listToken = new ParseTreeToken(null, null, firstPosExpression.lineIndex, firstPosExpression.colIndex,
			ParseTreeTokenType.LIST);
		listToken.appendChild(firstPosExpression);
		while (!CommandCalls.tokenMatchesPrimaryName(tok, 'polyEnd')) {
			const next = tok.nextSibling;
			const tokChild = tok.children[0];
			tokChild.remove();
			listToken.appendChild(tokChild);
			tok.remove();
			removed.push(tok);
			tok = next;
		}
		tok.val = ']';
		tok.type = ParseTreeTokenType.LEAF;
		ArrayUtils.pushAll(removed, getAllDescendentsAsArray(tok));
		tok.remove();
		tok.removeAllChildren();
		listToken.appendChild(tok);
		polyStart.appendChild(listToken);
		cachedParseTree.tokenTypeChanged(tok, ParseTreeTokenType.PARAMETERIZED_GROUP);
		cachedParseTree.tokensRemoved(removed);
		cachedParseTree.tokenAdded(listToken);
		fixLogger.log(`Converted polyStart...polyEnd to polygon because it was equal`, polyStart);
	});
};