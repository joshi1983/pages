import { compile } from '../../../../../modules/parsing/compile.js';
import { LogoParser } from '../../../../../modules/parsing/LogoParser.js';
import { TestParseLogger } from '../../../../helpers/TestParseLogger.js';

export function testAvoidValueStackPush(logger) {
	const code= `make "x []
queue "X 5`;
	const compileOptions = {'translateToJavaScript': true};
	const extraProcedures = new Map();
	const initialVariables = new Map();
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const program = compile(code, tree, parseLogger, extraProcedures, compileOptions, initialVariables);
	program.instructions.forEach(function(i, index) {
		if (i.code !== undefined) {
			if (i.code.indexOf('context.valueStack.push') !== -1)
				logger(`Expected to not find context.valueStack.push but found it in instruction ${index}.  The instruction's code is ${i.code}`);
		}
	});
};