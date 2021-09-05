import { testFont } from './font/testFont.js';
import { wrapAndCall } from
'../../../../../../../../helpers/wrapAndCall.js';

export function testProperties(logger) {
	wrapAndCall([
		testFont
	], logger);
};