import { translatePitrifiedGoTurtleToWebLogo } from
'../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/translatePitrifiedGoTurtleToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateArrays(logger) {
	const cases = [
		{
			'in': 'var a [1]int',
			'outContains': 'make "a ['
		},
		{
			'in': 'var a [1000]int',
			'outContains': 'make "a duplicate 0 1000'
		},
		{
			'in': 'a := make([]int64, 0)',
			'out': 'make "a [ ]'
		},
		{
			'in': 'a := make([]string, 0)',
			'out': 'make "a [ ]'
		},
		{
			'in': 'a := make([]string, 5)',
			'out': 'make "a duplicate " 5'
		},
		{
			'in': 'b := make([]int64, 0)',
			'out': 'make "b [ ]'
		},
		{
			'in': 'a := make([]int64, 5)',
			'out': 'make "a duplicate 0 5'
		}
	];
	testInOutPairs(cases, translatePitrifiedGoTurtleToWebLogo, logger);
};