import { testShouldUseCustomProcessTokenForToken } from './testShouldUseCustomProcessTokenForToken.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testTypeProcessors(logger) {
	wrapAndCall([
		testShouldUseCustomProcessTokenForToken
	], logger);
};