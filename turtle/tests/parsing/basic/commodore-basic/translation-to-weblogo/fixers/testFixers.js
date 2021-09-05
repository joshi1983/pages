import { testCircleCoordsRadiusColorFixer } from './testCircleCoordsRadiusColorFixer.js';
import { testDefFixer } from './testDefFixer.js';
import { testFixQBasicParseTree } from './testFixQBasicParseTree.js';
import { testLineFixer } from './testLineFixer.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testFixers(logger) {
	wrapAndCall([
		testCircleCoordsRadiusColorFixer,
		testDefFixer,
		testFixQBasicParseTree,
		testLineFixer
	], logger);
};