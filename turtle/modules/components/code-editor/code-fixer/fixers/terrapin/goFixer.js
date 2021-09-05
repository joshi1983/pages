import { isAfterOrSame } from
'../../../../../parsing/generic-parsing-utilities/isAfterOrSame.js';
import { ParseTreeToken } from
'../../../../../parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../../../parsing/ParseTreeTokenType.js';

function getBestLabelMatch(goToken, labels) {
	let result;
	const parent = goToken.parentNode;
	for (const label of labels) {
		if (label.parentNode === parent &&
		isAfterOrSame(goToken, label)) {
			if (result === undefined ||
			isAfterOrSame(label, result))
				result = label;
		}
	}
	return result;
}

function isOfInterest(labelsMap) {
	return function(token) {
		if (token.val.toLowerCase() !== 'go')
			return false;
		const next = token.nextSibling;
		if (next === null ||
		next.type !== ParseTreeTokenType.STRING_LITERAL)
			return false;
		const info = labelsMap.get(next.val.toLowerCase());
		if (info === undefined)
			return false;
		const bestLabel = getBestLabelMatch(token, info);
		return bestLabel !== undefined;
	};
}

function isLabelToken(token) {
	if (token.val.toLowerCase() !== 'label' ||
	token.children.length !== 1 ||
	typeof token.children[0].val !== 'string')
		return false;
	return true;
}

function processGoToken(goToken, cachedParseTree, labelsMap) {
	const goChild = goToken.nextSibling;
	const info = labelsMap.get(goChild.val.toLowerCase());
	const bestLabel = getBestLabelMatch(goChild, info);
	bestLabel.val = 'forever';
	const labelChild = bestLabel.children[0];
	const leftBracket = new ParseTreeToken('[', null, labelChild.lineIndex,
		labelChild.colIndex, ParseTreeTokenType.LEAF);
	labelChild.type = ParseTreeTokenType.LIST;
	labelChild.val = null;
	labelChild.appendChild(leftBracket);
	// loop through adding instruction tokens.
	const parent = bestLabel.parentNode;
	const index = parent.children.indexOf(bestLabel) + 1;
	let tok = parent.children[index];
	while ( tok !== goToken) {
		tok.remove();
		labelChild.appendChild(tok);
		tok = parent.children[index];
	}
	
	goChild.remove();
	goToken.val = ']';
	goToken.type = ParseTreeTokenType.LEAF;
	goToken.remove();
	labelChild.appendChild(goToken);
	cachedParseTree.tokenAdded(leftBracket);
	cachedParseTree.tokenRemoved(goChild);
	cachedParseTree.tokenTypeChanged(labelChild, ParseTreeTokenType.STRING_LITERAL);
}

export function goFixer(cachedParseTree, fixLogger) {
	const labels = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP).
		filter(isLabelToken);
	if (labels.length === 0)
		return false;
	const labelsMap = new Map();
	labels.forEach(function(labelToken) {
		const name = labelToken.children[0].val.toLowerCase();
		let val = labelsMap.get(name);
		if (val === undefined) {
			val = [labelToken];
			labelsMap.set(name, val);
		}
		else {
			val.push(labelToken);
		}
	});
	const goCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isOfInterest(labelsMap));
	goCalls.forEach(function(goToken) {
		processGoToken(goToken, cachedParseTree, labelsMap);
		fixLogger.log(`Converted go to forever loop because WebLogo supports only structured programming.`, goToken);
	});
};