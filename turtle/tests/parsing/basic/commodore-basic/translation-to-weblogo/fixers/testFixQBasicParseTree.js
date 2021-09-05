import { fixQBasicParseTree } from
'../../../../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/fixers/fixQBasicParseTree.js';
import { processQBasicFixerTestCases } from
'../../../../../helpers/parsing/basic/processQBasicFixerTestCases.js';

export function testFixQBasicParseTree(logger) {
	const cases = [{'code': `def fnx(x) = x * 3
80 def fny(x) = x * 20`,
		'to': `def fnx(x)
	fnx = x * 3
end def

80 def fny(x)
	fny = x * 20
end def`}
	];
	processQBasicFixerTestCases(cases, fixQBasicParseTree, logger);
};
		