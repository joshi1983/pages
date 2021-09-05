import { cgjenningsExamples } from
'../../../helpers/parsing/l-systems/cgjenningsExamples.js';
import { fractintExamples } from
'../../../helpers/parsing/l-systems/fractintExamples.js';
import { isLikelyFractInt } from
'../../../../modules/parsing/l-systems/fractint/isLikelyFractInt.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';
import { zeroLExamples } from
'../../../helpers/parsing/l-systems/zeroLExamples.js';

export function testIsLikelyFractInt(logger) {
	const cases = [
	{
		'in': `import { x } from './x.js';
let axiom,F;
axiom =F

function f() {
}`, // This should be classified as JavaScript instead of Fractint.
	'out': false
	},
	{
		'in': `import { x } from './x.js';
let axiom,F;
axiom =F

F = {
}`, // This should be classified as JavaScript instead of Fractint.
	'out': false
	}
	];
	zeroLExamples.concat(cgjenningsExamples).
	forEach(function(code) {
		cases.push({
			'in': code,
			'out': false
		});
	});
	fractintExamples.forEach(function(code) {
		cases.push({
			'in': code,
			'out': true
		});
	});
	testInOutPairs(cases, isLikelyFractInt, logger);
};