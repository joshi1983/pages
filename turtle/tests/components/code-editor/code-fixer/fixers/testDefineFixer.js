import { processTestCase } from './processTestCase.js';
import { defineFixer } from '../../../../../modules/components/code-editor/code-fixer/fixers/defineFixer.js';

export function testDefineFixer(logger) {
	const cases = [
		{'code': 'print "Define', 'logged': false},
		{
			'code': 'Define "p [ [size] [ fd :size ]]', 
			'to': 'to p  :size  fd :size end',
			'logged': true
		},
		{
			'code': 'define "spin [[ ][repeat 25 [fd 100]]] print "hi',
			'to': 'to spin  repeat 25 [fd 100] end print "hi',
			'logged': true
		},
		{
			'code': 'define "spin [[ ][repeat 25 [fd 100 bk 100 rt 15]]] repeat 24 [spin fd 100]',
			'to': 'to spin  repeat 25 [fd 100 bk 100 rt 15] end repeat 24 [spin fd 100]',
			'logged': true
		}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		caseInfo.compareTreeSettings = {'excludeIndexProperties': true};
		processTestCase(caseInfo, defineFixer, logger);
	});
};