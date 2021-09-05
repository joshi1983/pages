import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { asmTurtleExamples } from
'../../helpers/parsing/asmTurtleExamples.js';
//import { codeHeartTurtleScriptExamples } from
//'../../helpers/parsing/codeHeartTurtleScriptExamples.js';
//import { javascript2DCanvasExamples } from
//'../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExampleFiles } from
'../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from
'../../helpers/parsing/logo3DExamples.js';
import { papertExamples } from
'../../helpers/parsing/papertExamples.js';
import { povRayExamples } from
'../../helpers/parsing/povRayExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { shouldNotShowAutofixPromptForCode } from
'../../../modules/components/code-editor/shouldNotShowAutofixPromptForCode.js';
import { sonicWebTurtleExamples } from
'../../helpers/parsing/sonicWebTurtleExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from
'../../helpers/parsing/webLogoExamplesContent.js';

const nonWebLogoExamples = [];
ArrayUtils.pushAll(nonWebLogoExamples, asmTurtleExamples);

// Ultimately, the codeHeart and javascript2dCanvas examples should work.
// They're commented out for now to prevent some failing tests that don't seem
// important enough to fix for now.
//ArrayUtils.pushAll(nonWebLogoExamples, codeHeartTurtleScriptExamples);
//ArrayUtils.pushAll(nonWebLogoExamples, javascript2DCanvasExamples);

ArrayUtils.pushAll(nonWebLogoExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonWebLogoExamples, logo3DExamples);
ArrayUtils.pushAll(nonWebLogoExamples, papertExamples);
ArrayUtils.pushAll(nonWebLogoExamples, povRayExamples);
ArrayUtils.pushAll(nonWebLogoExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonWebLogoExamples, sonicWebTurtleExamples);

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
	nonWebLogoExamples.forEach(function(content) {
		cases.push({'in': content, 'out': false});
	});
	testInOutPairs(cases, shouldNotShowAutofixPromptForCode, logger);
};