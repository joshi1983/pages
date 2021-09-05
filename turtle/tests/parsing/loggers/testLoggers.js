import { testBufferedParseLogger } from './testBufferedParseLogger.js';
import { testConsoleParseLogger } from './testConsoleParseLogger.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testLoggers(logger) {
	return wrapAndCall([
		testBufferedParseLogger,
		testConsoleParseLogger
	], logger);
};