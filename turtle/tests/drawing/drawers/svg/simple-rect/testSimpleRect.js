import { testIsSimpleRect } from './testIsSimpleRect.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testSimpleRect(logger) {
	wrapAndCall([
		testIsSimpleRect
	], logger);
};