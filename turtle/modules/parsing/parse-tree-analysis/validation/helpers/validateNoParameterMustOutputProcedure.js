import { validateMustOutputProcedure } from './validateMustOutputProcedure.js';

export function validateNoParameterMustOutputProcedure(proc, parseLogger, outputDescription) {
	const startToken = proc.getStartToken();
	if (proc.parameters.length !== 0)
		parseLogger.error(`${proc.name} procedure must take 0 inputs but your code specifies ${proc.parameters.length}.  Remove all the inputs to the procedure or remove the whole ${proc.name} procedure.`, startToken);
	validateMustOutputProcedure(proc, parseLogger, outputDescription);
};