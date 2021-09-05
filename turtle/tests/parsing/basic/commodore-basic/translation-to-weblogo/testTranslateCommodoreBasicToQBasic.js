import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateCommodoreBasicToQBasic } from
'../../../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/translateCommodoreBasicToQBasic.js';

export function testTranslateCommodoreBasicToQBasic(logger) {
	const cases = [
		{'in': 'line 1,2,3,4', 'out': 'line ( 1 , 2 ) - ( 3 , 4 ) '},
		{'in': 'line 1,2,3,4,5', 'out': 'line ( 1 , 2 ) - ( 3 , 4 ) , 5 '},
		{'in': 'line,1,2,3,4', 'out': 'line ( 1 , 2 ) - ( 3 , 4 ) '},
		{'in': 'plot 1,2', 'out': 'pset ( 1 , 2 ) '},
		{'in': 'line x,y,z,4', 'out': 'line ( x , y ) - ( z , 4 ) '},
		{'in': '60 GRAPHIC 3,1', 'out': '60 '}
	];
	testInOutPairs(cases, translateCommodoreBasicToQBasic, logger);
};