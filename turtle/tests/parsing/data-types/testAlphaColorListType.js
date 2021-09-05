import { AlphaColorListType } from '../../../modules/parsing/data-types/AlphaColorListType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function testMayBeCompatibleWithValue(logger) {
	const cases = [
		{'in': [], 'out': false},
		{'in': 'red', 'out': false},
		{'in': [1,2,3], 'out': false},
		{'in': [1,2,3,4], 'out': true},
		{'in': [1,2,3,4,5], 'out': false},
	];
	const c = new AlphaColorListType();
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, input: ${JSON.stringify(caseInfo.in)}`, logger);
		const actualResult = c.mayBeCompatibleWithValue(caseInfo.in);
		if (actualResult !== caseInfo.out)
			plogger('Expected ' + caseInfo.out + ' but got ' + actualResult);
	});
}

export function testAlphaColorListType(logger) {
	testMayBeCompatibleWithValue(prefixWrapper('testMayBeCompatibleWithValue', logger));
};