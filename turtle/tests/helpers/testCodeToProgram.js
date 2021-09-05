import { compile } from '../../modules/parsing/compile.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { TestParseLogger } from './TestParseLogger.js';

export function testCodeToProgram(code, logger) {
	if (typeof logger !== 'function')
		throw new Error('logger must be a function. Not ' + logger);

	const parseLogger = new TestParseLogger(logger, code);
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (parseLogger.hasLoggedErrors())
		logger('Parse errors unexpectedly found in code: ' + code);
	return compile(code, tree, parseLogger, new Map(), {'translateToJavaScript': false}, new Map());
};
