import { scrapeProceduresFromParseTreeTokens } from '../scrapeProceduresFromParseTreeTokens.js';

export function validateProcedureParametersUnique(cachedParseTree, parseLogger) {
	const procedures = cachedParseTree.getProceduresStrictlyFromTree();
	procedures.forEach(function(proc) {
		const paramNames = new Set();
		proc.parameters.forEach(function(paramName, index) {
			paramName = paramName.toLowerCase();
			if (paramNames.has(paramName))
				parseLogger.error('Parameter names must be unique', proc.getTokenForParameter(index));
			else
				paramNames.add(paramName);
		});
	});
};