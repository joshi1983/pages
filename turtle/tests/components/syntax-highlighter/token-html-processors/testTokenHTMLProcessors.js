import { testColorHTMLTokenProcessor } from './testColorHTMLTokenProcessor.js';
import { testGeneralHTMLTokenProcessor } from './testGeneralHTMLTokenProcessor.js';
import { testLongStringHTMLTokenProcessor } from './testLongStringHTMLTokenProcessor.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTokenHTMLProcessors(logger) {
	wrapAndCall([
		testColorHTMLTokenProcessor,
		testGeneralHTMLTokenProcessor,
		testLongStringHTMLTokenProcessor
	], logger);
};