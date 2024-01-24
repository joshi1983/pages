import { cheerfulNetherlandsExamplesAll } from
'../../../../../helpers/parsing/cheerfulNetherlandsLogoExamples.js';
import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateCheerfulToWebLogo } from
'../../../../../../modules/components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/translateCheerfulToWebLogo.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

function testTranslateExamples(logger) {
	cheerfulNetherlandsExamplesAll.forEach(function(content) {
		translateCheerfulToWebLogo(content);
	});
}

function testWithSpecificExpectedOutputs(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'VOORUIT 25', 'out': 'forward 25'},
		{'in': `HERHAAL 2
			VOORUIT 25
DOE`, 'out':
`repeat 2 [
	forward 25
]`}, {
	'in': `leer p
	VOORUIT 25
	eind`,
	'out':
`to p
	forward 25
end`
}
	];
	testInOutPairs(cases, translateCheerfulToWebLogo, logger);
}

export function testTranslateCheerfulToWebLogo(logger) {
	wrapAndCall([
		testTranslateExamples,
		testWithSpecificExpectedOutputs
	], logger);
};