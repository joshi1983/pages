import { testIsLikelyHTBasic } from './testIsLikelyHTBasic.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testHTBasic(logger) {
	wrapAndCall([
		testIsLikelyHTBasic,
	], logger);
};