import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testDenoiseParseMessages } from './testDenoiseParseMessages.js';

export function testDenoising(logger) {
	testDenoiseParseMessages(prefixWrapper('testDenoiseParseMessages', logger));
};