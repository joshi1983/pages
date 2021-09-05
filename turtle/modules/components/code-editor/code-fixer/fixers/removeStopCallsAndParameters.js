import { CommandCalls } from '../../../../parsing/parse-tree-analysis/CommandCalls.js';

export function removeStopCallsAndParameters(proc, fixLogger, cachedParseTree) {
	const startToken = proc.getStartToken();
	const procTokens = startToken.getAllDescendentsAsArray();
	proc.parameters.map((p, index) => proc.getTokenForParameter(index)).forEach(function(token) {
		token.parentNode.removeChild(token);
		cachedParseTree.tokenRemoved(token);
		fixLogger.log(`Removed input ${token.val} from ${proc.name} since animation.setup should not have any inputs`, token);
	});
	const stopCalls = CommandCalls.filterCommandCalls(procTokens, 'stop');
	stopCalls.forEach(function(token) {
		cachedParseTree.tokenRemoved(token);
		token.parentNode.removeChild(token);
		fixLogger.log('Removed a call to stop because ${proc.name} should always output a value', token);
	});
};