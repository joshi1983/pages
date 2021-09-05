import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { testComments } from './testComments.js';
import { testTabs } from './testTabs.js';

export function testLogoTextarea(logger) {
	testComments(prefixWrapper('testComments', logger));
	testTabs(prefixWrapper('testTabs', logger));
};