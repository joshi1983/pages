import { testComments } from './testComments.js';
import { testTabs } from './testTabs.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testLogoTextarea(logger) {
	wrapAndCall([
		testComments,
		testTabs
	], logger);
};