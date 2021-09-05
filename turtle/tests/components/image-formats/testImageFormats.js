import { testPCX } from './testPCX.js';
import { testPCXDirectory } from './pcx/testPCXDirectory.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testImageFormats(logger) {
	wrapAndCall([
		testPCX,
		testPCXDirectory
	], logger);
};