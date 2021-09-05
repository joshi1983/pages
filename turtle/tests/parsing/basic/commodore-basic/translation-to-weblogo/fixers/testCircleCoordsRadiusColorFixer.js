import { circleCoordsRadiusColorFixer } from
'../../../../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/fixers/circleCoordsRadiusColorFixer.js';
import { processQBasicFixerTestCases } from
'../../../../../helpers/parsing/basic/processQBasicFixerTestCases.js';

export function testCircleCoordsRadiusColorFixer(logger) {
	const cases = [
		{'code': '', 'to': ''},
		{'code': 'CIRCLE C,X1,Y1,20', 'to': 'CIRCLE (X1,Y1),20,C'},
		{
			'code': 'circle C,X,Y,R',
			'to': 'circle (X,Y),R,C'
		},
		{
			'code': 'circle 1,2,3,4+x',
			'to': 'circle (2,3),4+x,1'
		}
	];
	processQBasicFixerTestCases(cases, circleCoordsRadiusColorFixer, logger);
};