import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testBufferedParseLogger } from './testBufferedParseLogger.js';
import { testConsoleParseLogger } from './testConsoleParseLogger.js';

export function testLoggers(logger) {
	testBufferedParseLogger(prefixWrapper('testBufferedParseLogger', logger));
	testConsoleParseLogger(prefixWrapper('testConsoleParseLogger', logger));
};