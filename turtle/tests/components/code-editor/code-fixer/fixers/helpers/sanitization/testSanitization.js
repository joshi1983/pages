import { testRemoveSquareBracketsForNumberArguments } from './testRemoveSquareBracketsForNumberArguments.js';
import { wrapAndCall } from '../../../../../../helpers/wrapAndCall';

export function testSanitization(logger) {
	wrapAndCall([
		testRemoveSquareBracketsForNumberArguments
	], logger);
};