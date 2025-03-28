import { addInstructionsForInitialVariables } from './compiling/addInstructionsForInitialVariables.js';
import { addInternalProcs } from './compiling/addInternalProcs.js';
import { getInstructionsFrom } from './compiling/getInstructionsFrom.js';
import { getProceduresMap } from './parse-tree-analysis/getProceduresMap.js';
import { isInternalProcedure } from './compiling/isInternalProcedure.js';
import { LogoProgram } from './execution/LogoProgram.js';
import { OutputNullInstruction } from './execution/instructions/OutputNullInstruction.js';
import { simplifyInstructions } from './compiling/instruction-list-optimization/simplifyInstructions.js';

export function compile(code, tree, logger, extraProcedures, compileOptions, initialVariables) {
	if (code !== undefined && typeof code !== 'string')
		throw new Error('code must either be undefined or a string. Not: ' + code);
	if (typeof logger !== 'object' || typeof logger.error !== 'function' || typeof logger.warn !== 'function')
		throw new Error('logger must be an object with warn and error methods.');
	if (!(initialVariables instanceof Map))
		throw new Error('initialVariables must be a Map.  Not: ' + initialVariables);
	if (compileOptions.translateToJavaScript === undefined)
		compileOptions.translateToJavaScript = false;
	const procedures = getProceduresMap(tree, extraProcedures);
	const instructions = [];
	try {
		if (!compileOptions.forInternalProcs)
			addInternalProcs(tree, procedures);
		addInstructionsForInitialVariables(tree, instructions, initialVariables);
		getInstructionsFrom(tree, procedures, logger, instructions);
		procedures.forEach(function(proc) {
			if (!compileOptions.forInternalProcs && isInternalProcedure(proc))
				return;

			const startToken = proc.getStartToken();
			const instructionsToken = startToken.children[2];
			const procInstructions = [];
			getInstructionsFrom(instructionsToken.children, procedures, logger, procInstructions);
			// in case the procedure isn't guaranteed to output, let's output something.
			procInstructions.push(new OutputNullInstruction(proc.getEndToken()));
			simplifyInstructions(procInstructions, proc.parameters, true, compileOptions);
			proc.setInstructions(procInstructions);
		});
		simplifyInstructions(instructions, [], false, compileOptions);
	}
	catch (e) {
		console.error(e);
		logger.error(`Compilation failed due to an error. ${e}`, tree);
	}

	return new LogoProgram(code, tree, procedures, instructions);
};