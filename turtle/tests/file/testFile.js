import { testFileLoadExample } from './file-load-example/testFileLoadExample.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testFile(logger) {
	wrapAndCall([
		testFileLoadExample
	], logger);
};