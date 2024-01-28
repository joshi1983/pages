import { CommandCalls } from '../../../../parsing/parse-tree-analysis/CommandCalls.js';
import { isInProcedure } from '../../../../parsing/parse-tree-analysis/isInProcedure.js';
import { ParseTreeTokenType } from '../../../../parsing/ParseTreeTokenType.js';

function isOfInterest(token) {
	// if is not in a procedure
	return !isInProcedure(token);
}

export function globalLocalmakeFixer(cachedParseTree, fixLogger) {
	const localmakes = CommandCalls.filterCommandCalls(
		cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP),
		'localmake').filter(isOfInterest);
	localmakes.forEach(function(localmakeCall) {
		const oldVal = localmakeCall.val;
		localmakeCall.val = 'make';
		fixLogger.log(`Replaced ${oldVal} with make because localmake can not be used outside of a procedure`, localmakeCall);
	});
};