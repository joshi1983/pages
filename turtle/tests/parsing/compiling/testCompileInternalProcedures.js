import { Command } from
'../../../modules/parsing/Command.js';
import { compile } from
'../../../modules/parsing/compile.js';
import { InternalProcedures } from
'../../../modules/parsing/compiling/InternalProcedures.js';
import { LogoProgram } from
'../../../modules/parsing/execution/LogoProgram.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';
await Command.asyncInit();

export function testCompileInternalProcedures(logger) {
	const code = InternalProcedures.getAllCode();
	const initialVariables = new Map();
	const compileOptions = {
		'forProduction': true,
		'mergeJavaScriptInstructions': true,
		'parsedOptimize': true,
		'translateToJavaScript': true
	};
	const parseLogger = new TestParseLogger(logger, code);
	const extraProcedures = new Map();
	const proceduresMap = new Map();
	const options = {};
	const tree = LogoParser.getParseTree(code, parseLogger, proceduresMap, options);
	const program = compile(code, tree, parseLogger, extraProcedures,
		compileOptions, initialVariables);
	if (!(program instanceof LogoProgram)) {
		logger(`Expected a LogoProgram but found ${program}`);
	}
	else {
		// check that each and every command with commandGroup
		// internalProc group is found in the compiled program.
		for (const info of Command.getAllCommandsInfo()) {
			if (info.commandGroup === 'internalProc') {
				const name = info.primaryName.toLowerCase();
				if (!program.procedures.has(name)) {
					logger(`Expected to find a procedure named ${name} in the internal procedures but did not.  The procedures that are implemented are: ${Array.from(program.procedures.keys()).join(', ')}`);
				}
			}
		}
	}
};