import { assertEquals } from
'../../../helpers/assertEquals.js';
import { createRootToken } from
'../../../helpers/createRootToken.js';
import { FixLogger } from
'../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { noop } from
'../../../../modules/noop.js';
import { ParseLogger } from
'../../../../modules/parsing/loggers/ParseLogger.js';
import { WrappedFixLogger } from
'../../../../modules/components/code-editor/code-fixer/WrappedFixLogger.js';

export function testWrappedFixLogger(logger) {
	const fixLogger = new FixLogger(new ParseLogger(noop));
	const wrappedFixLogger = new WrappedFixLogger(fixLogger);
	const token = createRootToken();
	assertEquals(false, wrappedFixLogger.hasLoggedAnything(), logger);
	wrappedFixLogger.log('test', token);
	assertEquals(true, wrappedFixLogger.hasLoggedAnything(), logger);	
};