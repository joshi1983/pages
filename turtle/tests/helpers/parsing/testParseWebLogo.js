import { LogoParser } from '../../../modules/parsing/LogoParser.js';
import { TestParseLogger } from '../TestParseLogger.js';

await LogoParser.asyncInit();

/*
This is intended to simplify parsing for testing code.
This does not include all the options of LogoParser.getParseTree because supporting them would defeat the purpose of 
creating this module.
If you want more options like specifying pre-existing global variables, pre-existing procedures, use LogoParser.getParseTree instead.
*/
export function testParseWebLogo(code, logger) {
	if (typeof code !== 'string')
		throw new Error(`code must be a string but found ${code}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but found ${logger}`);
	
	const parseLogger = new TestParseLogger(logger, code);
	return LogoParser.getParseTree(code, parseLogger);
};