import { getTestExecuterForCode } from '../helpers/getTestExecuterForCode.js';
import { LogoInstruction } from '../../modules/parsing/execution/instructions/LogoInstruction.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function testOrderOfOperation(logger) {
	const cases = [
		{'expr': '1', 'output': 1},
		{'expr': '1+2*3', 'output': 7},
		{'expr': '1+2*3', 'output': 7},
		{'expr': '2*3+1', 'output': 7},
		{'expr': '2*(3+1)', 'output': 8},
		{'expr': '5/4', 'output': 1.25},
		{'expr': '1+5/4', 'output': 2.25},
		{'expr': '5/4+1', 'output': 2.25},
		{'expr': '2*3/4', 'output': 1.5},
		{'expr': '3*2/4', 'output': 1.5},
		{'expr': '1+3*2/4-4', 'output': -1.5},
		{'expr': '2*PI', 'output': 6.283185307179586},
		{'expr': '2*sqrt 100', 'output': 20},
		{'expr': 'sqrt (10*arcsin 1) / 9', 'output': 10},
		{'expr': '1=1', 'output': true},
		{'expr': '1<>1', 'output': false},
	];
	cases.forEach(function(caseInfo) {
		const code = 'print ' + caseInfo.expr;
		try {
			const log = prefixWrapper('Failure while processing expression ' + caseInfo.expr, logger);
			const executer = getTestExecuterForCode(code, logger);
			const executionContext = executer.executionContext;
			const instructions = executionContext.logoProgram.instructions;
			const valueStack = executionContext.valueStack;
			const numInstructionsToExecute = instructions.length - 2; // just before running the print command
			if (numInstructionsToExecute < 0)
				log('Expected to get at least 2 instructions but got ' + instructions.length);
			else {
				executer.executeInstructionsSync(numInstructionsToExecute);
				if (valueStack.length !== 1)
					log('Expected valueStack to have 1 value in it but got ' + valueStack.length + ', instructions are ' + LogoInstruction.stringify(instructions));
				else {
					const actualValue = valueStack[0];
					if (actualValue !== caseInfo.output) {
						log('Expected ' + caseInfo.output + ' but got ' + actualValue);
					}
				}
			}
		}
		catch (e) {
			console.error(e);
			logger('Problem while processing code: ' + code);
		}
	});
};