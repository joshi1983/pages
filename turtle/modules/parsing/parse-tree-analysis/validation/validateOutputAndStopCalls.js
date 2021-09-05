import { Command } from '../../Command.js';
import { CommandCalls } from '../CommandCalls.js';
import { doesTokenAlwaysOutput } from '../doesTokenAlwaysOutput.js';
import { getAllDescendentsAsArray } from '../../generic-parsing-utilities/getAllDescendentsAsArray.js';
import { isInProcedure } from '../isInProcedure.js';
import { isOutputOrStopToken } from '../isOutputOrStopToken.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { scrapeProceduresFromParseTreeTokens } from '../scrapeProceduresFromParseTreeTokens.js';

function getOutputCallTokens(cachedParseTree) {
	return cachedParseTree.getCommandCallsByNames(['output', 'stop']);
}

function validateMixingStopAndOutputInSameProcedure(cachedParseTree, parseLogger) {
	// get all procedures.
	const procs = cachedParseTree.getProceduresStrictlyFromTree();
	procs.forEach(function(proc) {
		const startToken = proc.getStartToken();
		if (startToken !== undefined) {
			const tokens = getAllDescendentsAsArray(startToken).filter(function(token) {
				if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
					return false;
				const info = Command.getCommandInfo(token.val);
				if (info === undefined)
					return false;
				return info.primaryName === 'output' || info.primaryName === 'stop';
			});
			// does proc use output?
			const outputs = tokens.filter(token => token.val.toLowerCase() === 'output');
			// does proc use stop?
			const stops = tokens.filter(token => token.val.toLowerCase() === 'stop');
			if (outputs.length !== 0 && stops.length !== 0) {
				stops.forEach(function(stopToken) {
					parseLogger.warn('The "' + proc.name + '" procedure also outputs a value.  It is difficult to use an output when there might not be one.  Try to find an appropriate output value and use output instead of stop here.', stopToken);
				});
			}
		}
	});
}

function validateOutputOnlyWithinProcedures(cachedParseTree, parseLogger) {
	const outputCalls = getOutputCallTokens(cachedParseTree);
	outputCalls.forEach(function(outputCallToken) {
		if (!isInProcedure(outputCallToken))
			parseLogger.error('Can only use <span class="command">' + outputCallToken.val + '</span> inside a procedure', outputCallToken, true);
	});
}

function validateNoStepsAfterOutput(cachedParseTree, parseLogger) {
	const outputingInProcedures = cachedParseTree.getAllTokens().
		filter(isInProcedure).
		filter(doesTokenAlwaysOutput);
	outputingInProcedures.forEach(function(outputCallToken) {
		const nextSibling = outputCallToken.nextSibling;
		if (nextSibling !== null && nextSibling.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
			parseLogger.error('This will never run because an output returned from the procedure', nextSibling);
		}
	});
}

export function validateOutputAndStopCalls(cachedParseTree, parseLogger) {
	validateMixingStopAndOutputInSameProcedure(cachedParseTree, parseLogger);
	validateOutputOnlyWithinProcedures(cachedParseTree, parseLogger);
	validateNoStepsAfterOutput(cachedParseTree, parseLogger);
};