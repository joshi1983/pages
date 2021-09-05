import { testCurlyBracketFixer } from './testCurlyBracketFixer.js';
import { testDeclareMissingEqualFixer } from './testDeclareMissingEqualFixer.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

export function testSanitization(logger) {
	wrapAndCall([
		testCurlyBracketFixer,
		testDeclareMissingEqualFixer
	], logger);
};