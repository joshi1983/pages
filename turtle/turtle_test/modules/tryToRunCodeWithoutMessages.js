import { Code } from './components/code-editor/Code.js';
import { ParseLogger } from './parsing/loggers/ParseLogger.js';

/*
This mainly intended to be run when WebLogo loads.
This hides any error messages and warnings.
The program doesn't run if any errors are found.
It will run if only warnings are found, though.
*/
export function tryToRunCodeWithoutMessages() {
	const parseLogger = new ParseLogger();
	Code.refreshProgram(parseLogger);
	if (!parseLogger.hasLoggedErrors()) // if no quality problems found, run it.
		Code.run();
};