import { testIsLikelySinclairBasic } from
'./testIsLikelySinclairBasic.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testSinclairBasic(logger) {
	wrapAndCall([
		testIsLikelySinclairBasic
	], logger);
};