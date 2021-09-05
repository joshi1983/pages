import { processTestCases } from './processTestCases.js';
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
			// If define is used within a procedure,
			// don't change it.
			// Procedure definitions can't be nested in WebLogo.
			// It is better that the end user translate it manually than dump
			// the equivalent procedure translation within another procedure which
			// will still have errors.
			'code': `to q
	Define "p [ [size] [ fd :size ]]
end`, 
			'logged': false
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
		},
		{
			'code': 'DEFINE "ABC [[a b] [PRINT :a]]',
			'to': 'to ABC :a :b PRINT :a end',
			'logged': true
		},
		{
			// I didn't see another version of Logo write a define this way Button
			// I want the fixer to accomodate this case anyway.
			'code': 'DEFINE "ABC [[a b] PRINT :a]',
			'to': 'to ABC :a :b PRINT :a end',
			'logged': true
		},
		{
			// another case not seen in another Logo varient but 
			// want to handle the case well anyway.
			'code': 'DEFINE "ABC [[a b] PRINT :a PRINT :b]',
			'to': 'to ABC :a :b PRINT :a PRINT :b end',
			'logged': true
		},
		{
			// this case is from:
			// https://fmslogo.sourceforge.io/manual/command-define.html
			'code': 'DEFINE "ABC [[a b] [PRINT :a] [PRINT :b]]',
			'to': 'to ABC :a :b PRINT :a PRINT :b end',
			'logged': true
		}
	];
	processTestCases(cases, defineFixer, logger);
};