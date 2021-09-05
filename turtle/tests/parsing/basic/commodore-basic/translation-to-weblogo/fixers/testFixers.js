import { testDefFixer } from './testDefFixer.js';
import { testFixQBasicParseTree } from './testFixQBasicParseTree.js';
import { testLineFixer } from './testLineFixer.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testFixers(logger) {
	wrapAndCall([
		testDefFixer,
		testFixQBasicParseTree,
		testLineFixer
	], logger);
};