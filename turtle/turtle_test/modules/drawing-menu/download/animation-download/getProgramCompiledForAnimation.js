import { AsyncParser } from '../../../parsing/AsyncParser.js';
import { AsyncParseTask } from '../../../parsing/AsyncParseTask.js';
import { Code } from '../../../components/code-editor/Code.js';
import { compile } from '../../../parsing/compile.js';
import { ParseLogger } from '../../../parsing/loggers/ParseLogger.js';

const parser = new AsyncParser();

export async function getProgramCompiledForAnimation() {
	const code = Code.sourceCode;
	const extraProcedures = new Map();
	const parseLogger = new ParseLogger();
	const tree = await parser.parse(code, AsyncParseTask.HIGH_PRIORITY, parseLogger, extraProcedures);
	if (parseLogger.hasLoggedErrors())
		return; // indicate failure.
	const compileOptions = {
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': true,
		'forProduction': true
	};
	const initialVariables = new Map();
	const program = compile(code, tree, parseLogger, extraProcedures, compileOptions, initialVariables);
	return program;
};