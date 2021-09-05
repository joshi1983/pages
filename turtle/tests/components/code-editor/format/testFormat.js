import { testBreakLine } from './testBreakLine.js';
import { testFormatCode } from './testFormatCode.js';
import { testFormatLogger } from './testFormatLogger.js';
import { testLoggedSection } from './testLoggedSection.js';
import { testWhitespaceUtils } from './testWhitespaceUtils.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testFormat(logger) {
	wrapAndCall([
		testBreakLine,
		testFormatCode,
		testFormatLogger,
		testLoggedSection,
		testWhitespaceUtils
	], logger);
};