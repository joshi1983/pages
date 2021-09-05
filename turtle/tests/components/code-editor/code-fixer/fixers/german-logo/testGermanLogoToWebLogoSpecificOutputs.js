import { germanLogoToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/german-logo/germanLogoToWebLogo.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';

export function testGermanLogoToWebLogoSpecificOutputs(logger) {
	const cases = [
		{
			'in': 'wenn :x dann dz "hi', 'out': `if :x [
	print "hi
]`
		},{
			'in': 'wenn :x dann dz "hi sonst dz "bye', 'out': `ifelse :x [
	print "hi
] [
	print "bye
]`}
	];
	testInOutPairs(cases, germanLogoToWebLogo, logger);
};