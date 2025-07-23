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
	const startTime = Date.now();
	const procedures = getProceduresMap(tree, extraProcedures);
	const duration1 = Date.now() - startTime;
	if (duration1 > 1000) {
		console.log(`getProceduresMap took ${duration1}ms, code=${code}`);
	}
	const instructions = [];
	try {
		if (!compileOptions.forInternalProcs)
			addInternalProcs(tree, procedures);
		const duration1 = Date.now() - startTime;
		if (duration1 > 2000) {
			console.log(`after addInternalProcs took ${duration1}ms, code=${code}`);
		}
		addInstructionsForInitialVariables(tree, instructions, initialVariables);
		const duration2 = Date.now() - startTime;
		if (duration2 > 2000) {
			console.log(`after addInstructionsForInitialVariables took ${duration2}ms, code=${code}`);
		}
		getInstructionsFrom(tree, procedures, logger, instructions);
		const duration3 = Date.now() - startTime;
		if (duration3 > 2000) {
			console.log(`after getInstructionsFrom took ${duration3}ms, code=${code}`);
		}
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
		const duration4 = Date.now() - startTime;
		if (duration4 > 2000) {
			console.log(`after procedures loop took ${duration4}ms, code=${code}`);
		}
		simplifyInstructions(instructions, [], false, compileOptions);
		const duration5 = Date.now() - startTime;
		if (duration5 > 2000) {
			console.log(`after simplifyInstructions took ${duration5}ms, code=${code}`);
		}
	}
	catch (e) {
		console.error(e);
		logger.error(`Compilation failed due to an error. ${e}`, tree);
	}

	const duration = Date.now() - startTime;
	if (duration > 2000) {
		console.log(`compile took ${duration}ms, code=${code}`);
	}
	return new LogoProgram(code, tree, procedures, instructions);
};