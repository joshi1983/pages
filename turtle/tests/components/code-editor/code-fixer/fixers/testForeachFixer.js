import { foreachFixer } from
'../../../../../modules/components/code-editor/code-fixer/fixers/foreachFixer.js';
import { processTestCases } from './processTestCases.js';

export function testForeachFixer(logger) {
	const cases = [
		{'code': 'foreach :x []', 'to': 'repeat  count :x[]', 'logged': true},
		{'code': 'foreach :x [print ?]',
		'to': 'repeat  count :x [make "xItem item repcount :x print :xItem]', 'logged': true},
		{'code': 'foreach :x [print ? * ?]',
		'to': 'repeat  count :x [make  "xItem item repcount :x print :xItem*:xItem]', 'logged': true},
		{'code': 'foreach :x [print ?REST]',
		'to': 'repeat  count :x [make "xRest sublist :x repcount+ 1 count:x print :xRest]', 'logged': true},
		{'code': 'foreach [] []',
		'to': 'make "foreachList []\nrepeat count:foreachList[]', 'logged': true},

		{'code': 'make "foreachList [1 2 3]\nforeach [] []',
		'to': 'make "foreachList [1 2 3]\nmake "foreachList1 []\n' +
		'repeat count:foreachList1[]', 'logged': true},
		// Avoid reusing variable names that are already in the code.

		{'code': 'foreach [] [foreach [] []]',
		'to': 'make "foreachList [ ] \n' +
		'repeat count:foreachList[make "foreachList1[]\n' +
		'repeat count:foreachList1[]]', 'logged': true},
		// Avoid reusing variable names that are already used by other foreach translations.

		{'code': 'make "foreachListItem 4\nforeach [] [print ?]',
		'to': 'make "foreachListItem 4\n' +
		'make "foreachList  []\nrepeat count:foreachList[make "foreachListItem1 item repcount :foreachList print :foreachListItem1]', 'logged': true},
		// Avoid reusing variable names for items that are already used.

		{'code': 'foreach [1 2 3] []',
		'to': 'make "foreachList   [1 2 3]\nrepeat count:foreachList[]', 'logged': true},
		{'code': 'foreach [a b] []',
		'to': 'make "foreachList  [a b]\nrepeat count:foreachList[]', 'logged': true},
		{'code': 'FOREACH [a b c d] [PRINT (SENTENCE "index # "value ? "rest ?REST)]',
		'to': 'make "foreachList    [a b c d]      \nrepeat count:foreachList[' +
		'make "foreachListRest sublist :foreachList repcount+ 1 count:foreachList ' +
		'make "foreachListItem item repcount :foreachList PRINT(SENTENCE "index repcount "value :foreachListItem "rest :foreachListRest)]',
		'logged': true},
	];
	processTestCases(cases, foreachFixer, logger);
};