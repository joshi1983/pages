import { testDefFixer } from './testDefFixer.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testFixers(logger) {
	wrapAndCall([
		testDefFixer
	], logger);
};