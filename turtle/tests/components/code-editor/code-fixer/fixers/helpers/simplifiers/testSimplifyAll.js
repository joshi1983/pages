import { processTestCases } from
'../../processTestCases.js';
import { simplifyAll } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/helpers/simplifiers/simplifyAll.js';

export function testSimplifyAll(logger) {
	const cases = [
		{'code': `jumpTo [ -87 -356 ]
setScreenColor "red
polyStart
penUp
setPos [ -55 347 ]
setPos [ -75 355 ]
setPos [ -95 358 ]
penDown
polyEnd`, 'to': `    
setScreenColor "red
penUp penDown polygon[[-87 -356]

 [ -55 347 ]
 [ -75 355 ]
 [ -95 358 ]

]`, 'logged': true}
	];
	processTestCases(cases, simplifyAll, logger);
};