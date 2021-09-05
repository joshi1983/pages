import { CommandCalls } from '../CommandCalls.js';
import { getAllDescendentsAsArray } from '../../generic-parsing-utilities/getAllDescendentsAsArray.js';

export function validateNoParameterMustOutputProcedure(proc, parseLogger, outputDescription) {
	const startToken = proc.getStartToken();
	const procTokens = getAllDescendentsAsArray(startToken);
	if (proc.parameters.length !== 0)
		parseLogger.error(`${proc.name} procedure must take 0 inputs but your code specifies ${proc.parameters.length}.  Remove all the inputs to the procedure or remove the whole ${proc.name} procedure.`, startToken);
	const outputTokens = CommandCalls.filterCommandCalls(procTokens, 'output');
	if (outputTokens.length === 0)
		parseLogger.error(proc.name + ' must return the ' + outputDescription + ' which requires calling the output command.  No calls to output found in ' + proc.name + '.', startToken);
	const stopTokens = CommandCalls.filterCommandCalls(procTokens, 'stop');
	stopTokens.forEach(function(token) {
		parseLogger.error(proc.name + ' must never call stop because it must always return the ' + outputDescription + '.', token);
	});
};