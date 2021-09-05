import { addFunctionArgList } from
'../../../../../modules/parsing/js-parsing/translation-to-weblogo/simplifying/addFunctionArgList.js';
import { processFixerTestCases } from './processFixerTestCases.js';

export function testAddFunctionArgList(logger) {
	const cases = [
		{'code': 'function x() {}', 'changed': false},
		{'code': 'function x {}', 'to': 'function x() {}'},
		{'code': 'function p {}', 'to': 'function p() {}'},
		{'code': 'function x{}', 'to': 'function x() {}'}
	];
	processFixerTestCases(cases, addFunctionArgList, logger);
};