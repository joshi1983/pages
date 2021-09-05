import { testFindSpanAtLocation } from './testFindSpanAtLocation.js';
import { testFindSpanAtLocationWithSelectiveHTMLSetter } from './testFindSpanAtLocationWithSelectiveHTMLSetter.js';
import { testUnwrapStringValue } from './testUnwrapStringValue.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testHighlighters(logger) {
	wrapAndCall([
		testFindSpanAtLocation,
		testFindSpanAtLocationWithSelectiveHTMLSetter,
		testUnwrapStringValue
	], logger);
};