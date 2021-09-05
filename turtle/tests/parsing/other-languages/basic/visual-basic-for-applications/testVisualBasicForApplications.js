import { testIsLikelyVisualBasicForApplications } from
'./testIsLikelyVisualBasicForApplications.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testVisualBasicForApplications(logger) {
	wrapAndCall([
		testIsLikelyVisualBasicForApplications
	], logger);
};