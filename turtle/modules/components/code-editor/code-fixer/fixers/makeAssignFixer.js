import { insertColIndexSpanAt } from '../../../../parsing/generic-parsing-utilities/insertColIndexSpanAt.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

function getCompareToken(token) {
	if (token.children.length === 2) {
		const firstChild = token.children[0];
		if (firstChild.val === '=')
			return firstChild;
		else if (typeof firstChild.val !== 'string')
			return null;
		else if (firstChild.val.toLowerCase() === 'local') {
			return firstChild.nextSibling;
		}
	}
	else {
		while (token.nextSibling === null && token.parentNode !== null)
			token = token.parentNode;
		return token.nextSibling;
	}
	return null;
}

function isOfInterest(token) {
	if (token.val !== 'make')
		return false;
	const compareToken = getCompareToken(token);
	if (compareToken === null || compareToken.val !== '=' ||
	compareToken.type !== ParseTreeTokenType.BINARY_OPERATOR ||
	compareToken.children.length !== 2)
		return false;
	const varNameToken = compareToken.children[0];
	if (varNameToken.type !== ParseTreeTokenType.LEAF || typeof varNameToken.val !== 'string')
		return false;
	if (varNameToken.children.length !== 0)
		return false;
	return true;
}

function isVariableReadOfInterest(varNames) {
	return function(token) {
		if (!varNames.has(token.val))
			return false;
		// is token part of a make statement?
		const parent = token.parentNode;
		if (parent.val === '=') {
			const prevSibling = parent.previousSibling;
			if (prevSibling !== null && prevSibling.type === ParseTreeTokenType.LEAF &&
			prevSibling.val.toLowerCase() === 'make')
				return false;
		}
		return true;
	};
}

/*
Converts stuff like make x=4
into stuff like
make "x 4

This kind of make statement was found in a Logo interpreter called Logo 3D.
More data on the Logo 3D tool is at:
json/logo-migrations/Logo_3D.json
*/
export function makeAssignFixer(cachedParseTree, fixLogger) {
	const makeCallsOfInterest = cachedParseTree.getTokensByTypes([ParseTreeTokenType.LEAF,
		ParseTreeTokenType.PARAMETERIZED_GROUP]).
		filter(isOfInterest);
	if (makeCallsOfInterest.length === 0)
		return;
	const newVarNames = new Set();
	makeCallsOfInterest.forEach(function(makeToken) {
		const oldMakeTokenType = makeToken.type;
		const compareToken = getCompareToken(makeToken);
		const varNameToken = compareToken.children[0];
		const valToken = compareToken.children[1];
		const oldVarNameType = varNameToken.type;
		let localToken = null;
		if (compareToken.previousSibling !== null && compareToken.previousSibling.val === 'local')
			localToken = compareToken.previousSibling;
		makeToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
		varNameToken.type = ParseTreeTokenType.STRING_LITERAL;
		insertColIndexSpanAt(varNameToken, 1); // extra character for the quotation mark.
		varNameToken.remove();
		valToken.remove();
		compareToken.remove();
		if (makeToken.children.length === 1) {
			const nextToken = makeToken.children[0];
			nextToken.remove();
			makeToken.appendSibling(nextToken);
		}
		makeToken.appendChild(varNameToken);
		makeToken.appendChild(valToken);
		if (localToken !== null) {
			const oldVal = makeToken.val;
			makeToken.val = 'localmake';
			localToken.remove();
			cachedParseTree.tokenRemoved(localToken);
			cachedParseTree.tokenValueChanged(makeToken, oldVal);
		}
		cachedParseTree.tokenRemoved(compareToken);
		if (oldVarNameType !== varNameToken.type)
			cachedParseTree.tokenTypeChanged(varNameToken, oldVarNameType);
		if (oldMakeTokenType !== makeToken.type)
			cachedParseTree.tokenTypeChanged(makeToken, oldMakeTokenType);
		newVarNames.add(varNameToken.val);
		fixLogger.log(`Removed unneeded = in make command call and quoted variable name`, makeToken);
	});
	const varReadsOfInterest = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
		filter(isVariableReadOfInterest(newVarNames));
	varReadsOfInterest.forEach(function(varRead) {
		varRead.type = ParseTreeTokenType.VARIABLE_READ;
		insertColIndexSpanAt(varRead, 1);
		varRead.colIndex++;
		cachedParseTree.tokenTypeChanged(varRead, ParseTreeTokenType.LEAF);
	});
};

