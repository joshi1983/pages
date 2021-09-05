import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testBreakLine } from './testBreakLine.js';
import { testFormatCode } from './testFormatCode.js';
import { testFormatLogger } from './testFormatLogger.js';
import { testLoggedSection } from './testLoggedSection.js';
import { testWhitespaceUtils } from './testWhitespaceUtils.js';

export function testFormat(logger) {
	testBreakLine(prefixWrapper('testBreakLine', logger));
	testFormatCode(prefixWrapper('testFormatCode', logger));
	testFormatLogger(prefixWrapper('testFormatLogger', logger));
	testLoggedSection(prefixWrapper('testLoggedSection', logger));
	testWhitespaceUtils(prefixWrapper('testWhitespaceUtils', logger));
};