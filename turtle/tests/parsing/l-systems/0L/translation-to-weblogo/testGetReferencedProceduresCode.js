import { getReferencedProceduresCode } from
'../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/getReferencedProceduresCode.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

export function testGetReferencedProceduresCode(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'pushState',
			'outContains': 'to pushState'},
		{'in': 'pushState\nincrementLineWidth',
			'outContains': 'to pushState'},
		{'in': 'pushState\nincrementLineWidth',
			'outContains': 'to incrementLineWidth'},
	];
	testInOutPairs(cases, getReferencedProceduresCode, logger);
};