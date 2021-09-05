import { testIsNameMainCondition } from './testIsNameMainCondition.js';
import { wrapAndCall } from '../../../../../helpers/wrapAndCall.js';

export function testIf(logger) {
	wrapAndCall([
		testIsNameMainCondition
	], logger);
};