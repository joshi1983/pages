import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testAssets } from './assets/testAssets.js';
import { testFileLoadExample } from './file-load-example/testFileLoadExample.js';

export function testFile(logger) {
	testAssets(prefixWrapper('testAssets', logger));
	testFileLoadExample(prefixWrapper('testFileLoadExample', logger));
};