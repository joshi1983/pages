import { translateKojoToWebLogo } from
'../../../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateClass(logger) {
	const cases = [
		{
			'in': 'class', 'out': ''
		},
		{
			'in': 'class A', 'out': ''
		},
		{
			'in': `class derived_class_name extends base_class_name
{
}`, 'out': ''
		},
		{
			'in': `class Bicycle (val gearVal:Int, val speedVal: Int)
{`, 'out': ''
		},
		{
			'in': `class A {}
println("hi")`,
			'out': 'print "hi'
		}
	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};