import { compile } from '../../../../../modules/parsing/compile.js';
import { LogoParser } from '../../../../../modules/parsing/LogoParser.js';
import { TestParseLogger } from '../../../../helpers/TestParseLogger.js';

export function testAvoidUnneededErrorCheck(logger) {
	const code = 'setPenSize 0';
	const compileOptions = {'translateToJavaScript': true};
	const extraProcedures = new Map();
	const initialVariables = new Map();
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const program = compile(code, tree, parseLogger, extraProcedures, compileOptions, initialVariables);
	program.instructions.forEach(function(i, index) {
		if (i.code !== undefined) {
			if (i.code.indexOf('errorCaseCheck') !== -1)
				logger(`Expected to not find errorCaseCheck but found it in instruction ${index}.  The instruction's code is ${i.code}`);
		}
	});
};