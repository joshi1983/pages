import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { translateBBCBasicToQBasic } from
'../../../modules/parsing/bbc-basic/translateBBCBasicToQBasic.js';

export function testTranslateBBCBasicToQBasicSpecificOutputs(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'REM comment', 'out': 'REM comment '},
		{'in': 'REM comment1\nREM comment2', 'out': 'REM comment1 \nREM comment2 '},
	];
	testInOutPairs(cases, translateBBCBasicToQBasic, logger);
};