import { ForLoops } from '../ForLoops.js';

export function validateDistinctForLoopVariableNames(cachedParseTree, parseLogger) {
	const forLoops = cachedParseTree.getCommandCallsByName('for');
	const globalVariables = cachedParseTree.getAllGlobalVariablesMade();
	forLoops.forEach(function(forToken) {
		const forVariableName = ForLoops.getVariableName(forToken);
		if (forVariableName !== undefined && globalVariables.has(forVariableName))
			parseLogger.warn('The variable name matches a global variable which may cause confusion.  Consider renaming to a distinct variable name', 
				ForLoops.getVariableNameToken(forToken));
	});
};