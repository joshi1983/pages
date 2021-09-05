import { compile } from
'../../../modules/parsing/compile.js';
import { convertObjectToLogoProgram } from
'../../../modules/parsing/serialization/convertObjectToLogoProgram.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../modules/parsing/loggers/ParseLogger.js';

export function testConvertObjectToLogoProgram(logger) {
	const code = 'forward 100';
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	const extraProcedures = new Map();
	const compileOptions = {
		'forProduction': true,
		'translateToJavaScript': true,
		'mergeJavaScriptInstructions': true,
		'parsedOptimize': true
	};
	const initialVariables = new Map();
	const program = compile(code, tree, parseLogger, extraProcedures,
		compileOptions, initialVariables);
	const serialized = convertObjectToLogoProgram(program);
	if (typeof serialized !== 'object' || serialized === null)
		logger(`serialized should be an object but found ${serialized}`);
};