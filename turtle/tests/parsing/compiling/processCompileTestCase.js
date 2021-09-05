import { compareInstructionsDTOWithInstructions } from '../../helpers/compareInstructionsDTOWithInstructions.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testCodeToProgram } from '../../helpers/testCodeToProgram.js';

export function processCompileTestCase(caseInfo, index, logger) {
	const prefix = `Case ${index}. Problem while processing code: ${caseInfo.code}.`;
	const prefixLogger = prefixWrapper(prefix, logger);
	const numInstructions = caseInfo.instructionsDTO instanceof Array ? caseInfo.instructionsDTO.length : caseInfo.numInstructions;
	try {
		const result = testCodeToProgram(caseInfo.code, logger, undefined, false);
		if (result === undefined) {
			logger(`Failed to compile code: ${caseInfo.code}`);
			return;
		}
		if (!(result.parseTree instanceof ParseTreeToken))
			prefixLogger('Expected parseTree to be an instance of ParseTreeToken but got ' + result.parseTree);
		if (result.procedures.size !== caseInfo.numProcedures)
			prefixLogger('Number of procedures expected to be ' + caseInfo.numProcedures + ' but got ' + result.procedures.size);
		else if (typeof caseInfo.procedures === 'object') {
			for (let procedureName in caseInfo.procedures) {
				const procInfo = caseInfo.procedures[procedureName];
				if (!result.procedures.has(procedureName.toLowerCase()))
					prefixLogger('Expected to compile procedure ' + procedureName + ' but it was not found.');
				else {
					const proc = result.procedures.get(procedureName.toLowerCase());
					if (proc.parameters.length !== procInfo.parameters.length)
						prefixLogger('Expected ' + procInfo.parameters.length + ' parameters but got ' + proc.parameters.length);
					else {
						procInfo.parameters.forEach(function(paramName, index) {
							const actual = proc.parameters[index];
							if (paramName !== actual)
								prefixLogger('Expected parameter ' + paramName + ' but got ' + actual + ' at parameter index ' +
								index + ' in procedure ' + procedureName);
						});
					}
					compareInstructionsDTOWithInstructions(procInfo.instructionsDTO, proc.instructions, prefixLogger);
				}
			}
		}
		if (caseInfo.instructionsDTO !== undefined && result.instructions !== undefined)
			compareInstructionsDTOWithInstructions(caseInfo.instructionsDTO, result.instructions, prefixLogger);
		else if (result.instructions.length !== numInstructions)
			prefixLogger('Number of instructions expected to be ' +
				numInstructions + ' but got ' + result.instructions.length +
				', actual instructions are: ' + JSON.stringify(result.instructions.map(function(instruction) {
				return instruction.toDTO();
			})));
	}
	catch (e) {
		console.error('Exception thrown while processing code ' + caseInfo.code, e);
		prefixLogger('error thrown: ' + e);
	}
};
	