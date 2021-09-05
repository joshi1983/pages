import { optimizeMapInitializations } from
'../../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/optimize-js/optimizeMapInitializations.js';
import { testInOutPairs } from '../../../../../helpers/testInOutPairs.js';

export function testOptimizeMapInitializations(logger) {
	const cases = [
		{'in': '', 'changed': false},
		{'in': `context.plist.setProperty(result, "x", 3)`,
		'changed': false},
		{'in': `result = new Map()`,
		'changed': false},
		{'in': `result = new Map();
context.plist.setProperty(result, "x", 3)`,
		'out': `result = new Map([
["x" , 3 ]
]);`},
		{'in': `result = new Map();
context.plist.setProperty(result, "x", 3);
context.plist.setProperty(result, "y", 4);`,
		'out': `result = new Map([
["x" , 3 ],
["y" , 4 ]
]);`},
		{'in': `result = new Map();
context.plist.setProperty(result, "x", 3);
context.plist.setProperty(result, "x", 4);`,
		'out': `result = new Map([
["x" , 3 ],
["x" , 4 ]
]);`}, 
// a little weird case because the ["x", 3] pair will be ignored but we want to be clear about handling the case.
// If no side effects are caused by removing the first pair, we might want to eventually remove the pair for efficiency's sake.
{'in': `colorStops = new Map();
context.plist.setProperty(colorStops,0,"white");
context.plist.setProperty(colorStops,context.math.mix(sunRatio, 1, 0.5),"yellow");`,
'out': `colorStops = new Map([
[ 0 ,"white" ],
[context.math.mix(sunRatio, 1, 0.5) ,"yellow" ]
]);`},
{'in': `colorstops=new Map() ;
context.plist.setProperty(colorstops ,context.math.mix( localVariables.get("sunratio"),1,0.5),"yellow");`,
'out': `colorstops=new Map([
[context.math.mix( localVariables.get("sunratio"),1,0.5) ,"yellow" ]
]);`}
	];
	testInOutPairs(cases, optimizeMapInitializations, logger);
};