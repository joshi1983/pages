import { CallProcedureInstruction } from
'../../modules/parsing/execution/instructions/CallProcedureInstruction.js';
import { compile } from '../../modules/parsing/compile.js';
import { compileOptionsArray } from './execution/compileOptionsArray.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';

export function testCompileCodeUsingInternalProc(logger) {
	const code = `print map "sin [0 90 -90]`;
	const parseLogger = new TestParseLogger(logger, code);
	const extraProcedures = new Map();
	const proceduresMap = new Map();
	const options = {};
	const tree = LogoParser.getParseTree(code, parseLogger, proceduresMap, options);
	const initialVariables = new Map();
	for (let i = 0; i < compileOptionsArray.length; i++) {
		const compileOptions = compileOptionsArray[i];
		const plogger = prefixWrapper(`Compile Options ${i}`, logger);
		const cParseLogger = new TestParseLogger(plogger, code);
		const program = compile(code, tree, cParseLogger, extraProcedures, compileOptions, initialVariables);
		if (!program.procedures.has('map'))
			plogger(`Expected map procedure to be included but it was not.  The included procedures are: ${Array.from(program.procedures.keys()).join(', ')}`);
		else {
			// look for a CallProcedureInstruction that calls map.
			const globalProcCalls = program.instructions.filter(i => i instanceof CallProcedureInstruction);
			if (globalProcCalls.length === 0)
				plogger(`Expected to find at least 1 CallProcedureInstruction but found 0`);
			else {
				if (!globalProcCalls.some(c => c.procedure.name === 'map'))
					plogger(`Expected to find a procedure call to map but did not.  ` +
					`The number of procedure calls in global instructions was ${globalProcCalls.length}`);
			}
		}
	}
};