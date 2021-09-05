import { compile } from
'../../../modules/parsing/compile.js';
import { convertLogoProgramToSerializableObject } from
'../../../modules/parsing/serialization/convertLogoProgramToSerializableObject.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { TestParseLogger } from
'../../helpers/TestParseLogger.js';
await LogoParser.asyncInit();

export function codeToProgram(code, logger) {
	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	const extraProcedures = new Map();
	const compileOptions = {
		'forProduction': true,
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': true,
		'parsedOptimize': true
	};
	const initialVariables = new Map();
	return compile(code, tree, parseLogger, extraProcedures,
		compileOptions, initialVariables);
};

export function testConvertLogoProgramToSerializableObject(logger) {
	const code = 'forward 100';
	const program = codeToProgram(code, logger);
	const serialized = convertLogoProgramToSerializableObject(program);
	if (typeof serialized !== 'object' || serialized === null)
		logger(`serialized should be an object but found ${serialized}`);
};