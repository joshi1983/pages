import { shouldNotShowAutofixPromptForCode } from
'../../../modules/components/code-editor/shouldNotShowAutofixPromptForCode.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from
'../../helpers/parsing/webLogoExamplesContent.js';

export function testShouldNotShowAutofixPromptForCode(logger) {
	const cases = [
	{'in': '', 'out': false},
	{'in': 'print \'hello world\'', 'out': false},
	{'in': 'print \'http://www.google.com\'', 'out': false},
	{'in': 'print \'https://www.google.com\'', 'out': false},
	{'in': 'print "https://www.google.com', 'out': false},
	{'in': 'http://www.google.com', 'out': true},
	{'in': 'https://www.google.com', 'out': true},
	{'in': `make "darkColor "#780
http://www.cropcircleconnector.com/Sorensen/2001/NineSpheresTK.jpg`,
	'out': true}
	];
	webLogoExamplesContent.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, shouldNotShowAutofixPromptForCode, logger);
};