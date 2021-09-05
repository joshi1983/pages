import { testGetURLMatches } from './testGetURLMatches.js';
import { testProcessComments } from './testProcessComments.js';
import { testProcessHyperlinks } from './testProcessHyperlinks.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testProcessorsDirectory(logger) {
	wrapAndCall([
		testGetURLMatches,
		testProcessComments,
		testProcessHyperlinks
	], logger);
};