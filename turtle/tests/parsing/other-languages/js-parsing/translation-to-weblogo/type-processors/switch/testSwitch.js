import { testHasACase } from './testHasACase.js';
import { wrapAndCall } from
'../../../../../../helpers/wrapAndCall.js';

export function testSwitch(logger) {
	return wrapAndCall([
		testHasACase
	], logger);
};