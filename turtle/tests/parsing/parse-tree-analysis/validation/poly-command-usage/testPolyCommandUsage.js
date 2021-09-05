import { testIsSingleCallEnoughForFillablePath } from
'./testIsSingleCallEnoughForFillablePath.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testPolyCommandUsage(logger) {
	wrapAndCall([
		testIsSingleCallEnoughForFillablePath
	], logger);
};