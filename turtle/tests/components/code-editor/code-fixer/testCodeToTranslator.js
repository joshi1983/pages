import { asmTurtleExamples } from
'../../../helpers/parsing/asmTurtleExamples.js';
import { codeHeartTurtleScriptExamples } from
'../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { codeToTranslator } from
'../../../../modules/components/code-editor/code-fixer/codeToTranslator.js';
import { javascript2DCanvasExamples } from
'../../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExampleFiles } from
'../../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from
'../../../helpers/parsing/logo3DExamples.js';
import { logo3DToWebLogo } from
'../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/logo3DToWebLogo.js';
import { papertExamples } from
'../../../helpers/parsing/papertExamples.js';
import { papertToWebLogo } from
'../../../../modules/components/code-editor/code-fixer/fixers/papert/papertToWebLogo.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { sonicWebTurtleExamples } from
'../../../helpers/parsing/sonicWebTurtleExamples.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate as translateASMTurtle } from
'../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';
import { translateToWebLogo as translateCanvas2d } from
'../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/translateToWebLogo.js';
import { translate as translateKTurtle } from
'../../../../modules/parsing/kturtle/translation-to-weblogo/translate.js';
import { translateToWebLogo as translateCodeHeartTurtleScriptToWebLogo } from
'../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateToWebLogo.js';
import { translate as translatePovRay } from
'../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';
import { translate as translateSonicWebTurtle } from
'../../../../modules/parsing/sonic-webturtle/translation-to-weblogo/translate.js';
import { asyncInit, translatePythonCodeToWebLogo } from
'../../../../modules/parsing/python-parsing/translatePythonCodeToWebLogo.js';
import { webLogoExamplesContent } from
'../../../helpers/parsing/webLogoExamplesContent.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

const webLogoExampleCases = webLogoExamplesContent.concat([
	`; Inspired by
; https://www.youtube.com/watch?v=hFj5-YwFCCY
to `,
`; https://www.youtube.com/watch?v=hFj5-YwFCCY
to`,
	'to',
	'to p',
	'to p\nend',
	`make "darkColor "#780
http://www.cropcircleconnector.com/Sorensen/2001/NineSpheresTK.jpg`
]);

const nonWebLogoTranslators = new Set([
	logo3DToWebLogo,
	papertToWebLogo,
	translateASMTurtle,
	translateCanvas2d,
	translateCodeHeartTurtleScriptToWebLogo,
	translateKTurtle,
	translatePovRay,
	translatePythonCodeToWebLogo,
	translateSonicWebTurtle,
]);
const cases = [];
function addCases(examples, translate, aesthetic) {
	if (!(examples instanceof Array))
		throw new Error(`Expected examples to be an Array but got ${examples}`);
	for (const example of examples) {
		cases.push({
			'in': example,
			'out': [translate, aesthetic],
			'equals': function(v1, v2) {
				if ((v1 instanceof Array) !== (v2 instanceof Array))
					return false;
				if (v1.length !== v2.length)
					return false;
				if (v1[0] !== v2[0])
					return false;
				if (v1[1] !== v2[1])
					return false;
				return true;
			}
		});
	}
}

const filteredCodeHeartTurtleScriptExamples = codeHeartTurtleScriptExamples.filter(function(tsContent, index) {
	if (tsContent.startsWith('fd(100)')&&tsContent.endsWith('rt(90)') &&
	index === 6) {
		// Skip a special example that will run fine in WebLogo.
		return;
	}
});

addCases(asmTurtleExamples, translateASMTurtle, false);
addCases(filteredCodeHeartTurtleScriptExamples, translateCodeHeartTurtleScriptToWebLogo, false);
addCases(javascript2DCanvasExamples, translateCanvas2d, false);
addCases(kturtleExampleFiles, translateKTurtle, false);
addCases(logo3DExamples, logo3DToWebLogo, true);
addCases(papertExamples, papertToWebLogo, true);
addCases(povRayExamples, translatePovRay, false);
addCases(pythonTurtleExampleFilesContent, translatePythonCodeToWebLogo, false);
addCases(sonicWebTurtleExamples, translateSonicWebTurtle, false);

function testWebLogoCases(logger) {
	webLogoExampleCases.forEach(function(content, index) {
		const [translator, adjustAesthetics] = codeToTranslator(content);
		if (typeof adjustAesthetics !== 'boolean')
			logger(`adjustAesthetics expected to be boolean but got ${adjustAesthetics}`);
		if (nonWebLogoTranslators.has(translator))
			logger(`WebLogo code should not get translated but codeToTranslator returned ${translator} for WebLogo example ${index} which has the code: ${content}`);
	});
};

function testNonWebLogoCases(logger) {
	testInOutPairs(cases, codeToTranslator, logger);
}

export function testCodeToTranslator(logger) {
	testWebLogoCases(logger);
	wrapAndCall([
		testNonWebLogoCases,
		testWebLogoCases
	], logger);
};