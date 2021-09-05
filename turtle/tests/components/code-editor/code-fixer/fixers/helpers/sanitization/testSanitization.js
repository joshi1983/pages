import { testRemoveSquareBracketsForNumberArguments } from './testRemoveSquareBracketsForNumberArguments.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall.js';

export function testSanitization(logger) {
	wrapAndCall([
		testRemoveSquareBracketsForNumberArguments
	], logger);
};