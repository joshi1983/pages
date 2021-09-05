import { Breakpoint } from '../../../modules/parsing/execution/Breakpoint.js';

export function testBreakpoint(logger) {
	const breakpoint = new Breakpoint(0, undefined, undefined);
	const lineNumber = breakpoint.getLineNumber([]);
	if (lineNumber !== -1)
		logger('Expected getLineNumber([]) to return -1 but got ' + lineNumber);
};