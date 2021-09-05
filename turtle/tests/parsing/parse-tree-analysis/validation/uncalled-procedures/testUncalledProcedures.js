import { testGetUncalledProcedures } from './testGetUncalledProcedures.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testUncalledProcedures(logger) {
	wrapAndCall([
		testGetUncalledProcedures
	], logger);
};