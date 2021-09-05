import { ConsoleParseLogger } from '../../../modules/parsing/loggers/ConsoleParseLogger.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';

export function testConsoleParseLogger(logger) {
	const consoleParseLogger = new ConsoleParseLogger();
	const parseToken = new ParseTreeToken(null, null, 0, 0, ParseTreeTokenType.TREE_ROOT);
	let errorLogged = false;
	const error = console.error;
	console.error = function(msg) {
		errorLogged = true;
	};
	consoleParseLogger.error('Hello world', parseToken);
	if (errorLogged !== true)
		logger(`Expected error method to call console.error but did not.  errorLogged = ${errorLogged}`);
	console.error = error;
};