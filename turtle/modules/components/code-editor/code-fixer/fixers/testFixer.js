import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';
import { wrapInNot } from './helpers/wrapInNot.js';

function isOfInterest(options) {
	return function(token) {
		if (!options.testNames.has(token.val.toLowerCase()))
			return false;
		const conditionToken = token.nextSibling;
		if (conditionToken === null)
			return false;
		const next = conditionToken.nextSibling;
		if (next === null || next.type !== ParseTreeTokenType.LEAF)
			return false;
		const val = next.val.toLowerCase();
		if (!options.iftrueNames.has(val) && !options.iffalseNames.has(val))
			return false;
		const instructionListToken = next.nextSibling;
		if (instructionListToken === null ||
		instructionListToken.type !== ParseTreeTokenType.LIST)
			return false;

		return true;
	};
}

function processTestToken(testToken, cachedParseTree, options) {
	const conditionToken = testToken.nextSibling;
	const firstControlLeaf = conditionToken.nextSibling;
	let instructionList1 = firstControlLeaf.nextSibling;
	let secondControlLeaf = instructionList1.nextSibling;
	let instructionList2 = null;
	if (secondControlLeaf !== null)
		instructionList2 = secondControlLeaf.nextSibling;
	testToken.val = 'if';
	if (secondControlLeaf !== null &&
	secondControlLeaf.type === ParseTreeTokenType.LEAF &&
	(options.iffalseNames.has(secondControlLeaf.val.toLowerCase()) ||
	options.iftrueNames.has(secondControlLeaf.val.toLowerCase())) &&
	instructionList2 !== null &&
	instructionList2.type === ParseTreeTokenType.LIST)
		testToken.val = 'ifelse';
	let oldType = testToken.type;
	testToken.type = ParseTreeTokenType.PARAMETERIZED_GROUP;
	cachedParseTree.tokenTypeChanged(testToken, oldType);
	conditionToken.remove();
	testToken.appendChild(conditionToken);
	if (options.iffalseNames.has(firstControlLeaf.val.toLowerCase())) {
		wrapInNot(conditionToken, cachedParseTree);
	}
	firstControlLeaf.remove();
	instructionList1.remove();
	testToken.appendChild(instructionList1);
	cachedParseTree.tokenRemoved(firstControlLeaf);
	if (testToken.val === 'ifelse') {
		secondControlLeaf.remove();
		cachedParseTree.tokenRemoved(secondControlLeaf);
		instructionList2.remove();
		testToken.appendChild(instructionList2);
	}
}

/*
@param options should specify things like iftrueNames, iffalseNames, testNames.
	The options are intended to help this fixer work for different versions of Logo 
	which may use other sets of lower case names.
*/
export function testFixer(options) {
	return function(cachedParseTree, fixLogger) {
		const tests = cachedParseTree.getTokensByType(ParseTreeTokenType.LEAF).
			filter(isOfInterest(options));
		tests.forEach(function(testToken) {
			const oldVal = testToken.val;
			processTestToken(testToken, cachedParseTree, options);
			fixLogger.log(`Replaced ${oldVal} and subsequent conditional command calls with ${testToken.val} statement because that is how WebLogo expresses conditional structures like this.`, testToken);
		});
	};
};