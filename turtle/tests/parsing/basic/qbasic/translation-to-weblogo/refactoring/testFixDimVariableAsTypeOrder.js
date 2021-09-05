import { fixDimVariableAsTypeOrder } from
'../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/refactoring/fixDimVariableAsTypeOrder.js';
import { processFixerCases } from './processFixerCases.js';

/*
This fixes some coding errors or inconsistencies found in some of the copied example programs.
One specific example with the error is at tests/data/basic/qbasic/qb64/3dsurf2.txt.

You see in this discussion that "dim varName as DataType" is the usual format:
https://qb64phoenix.com/forum/showthread.php?tid=2651&page=2
*/
export function testFixDimVariableAsTypeOrder(logger) {
	const cases = [
		{'code': '', 'changed': false},
		{'code': 'dim x', 'changed': false},
		{'code': 'dim x as integer', 'changed': false},
		{'code': 'dim as integer x', 'to': 'dim x as integer'},
		{'code': 'Dim Shared As Long handle', 'to': 'Dim Shared handle As Long'}
	];
	processFixerCases(cases, fixDimVariableAsTypeOrder, logger);
};