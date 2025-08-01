import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { asmTurtleExamples } from
'../../../helpers/parsing/asmTurtleExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { billNyeExamples } from
'../../../helpers/parsing/billNyeExamples.js';
import { cheerfulNetherlandsLogoExamples } from
'../../../helpers/parsing/cheerfulNetherlandsLogoExamples.js';
import { cgjenningsExamples } from
'../../../helpers/parsing/cgjenningsExamples.js';
import { codeHeartTurtleScriptExamples } from
'../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { codeToTranslator } from
'../../../../modules/components/code-editor/code-fixer/codeToTranslator.js';
import { fmsLogoExamples } from
'../../../helpers/parsing/fmsLogoExamples.js';
import { fractintExamples } from
'../../../helpers/parsing/fractintExamples.js';
import { javascript2DCanvasExamples } from
'../../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExampleFiles } from
'../../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from
'../../../helpers/parsing/logo3DExamples.js';
import { logo3DToWebLogo } from
'../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/logo3DToWebLogo.js';
import { logoInterpreterExamples } from
'../../../helpers/parsing/logoInterpreterExamples.js';
import { logoInterpreterToWebLogo } from
'../../../../modules/components/code-editor/code-fixer/fixers/logo-interpreter/logoInterpreterToWebLogo.js';
import { odinExamples } from
'../../../helpers/parsing/odinExamples.js';
import { osmosianExamples } from
'../../../helpers/parsing/osmosianExamples.js';
import { papertExamples } from
'../../../helpers/parsing/papertExamples.js';
import { papertToWebLogo } from
'../../../../modules/components/code-editor/code-fixer/fixers/papert/papertToWebLogo.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { processingExamples } from
'../../../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFilesContent } from
'../../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { smallVisualBasicExamples } from
'../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { sonicWebTurtleExamples } from
'../../../helpers/parsing/sonicWebTurtleExamples.js';
import { sugarLabsTurtleBlocksExamples } from
'../../../helpers/parsing/sugarLabsTurtleBlocksExamples.js';
import { sugarLabsTurtleBlocksHTMLExamples } from
'../../../helpers/parsing/sugarLabsTurtleBlocksHTMLExamples.js';
import { terrapinExamples } from
'../../../helpers/parsing/terrapinExamples.js';
import { terrapinToWebLogo } from
'../../../../modules/components/code-editor/code-fixer/fixers/terrapin/terrapinToWebLogo.js';
import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translateAppleSoftBasicToWebLogo } from
'../../../../modules/parsing/basic/applesoft-basic/translation-to-weblogo/translateAppleSoftBasicToWebLogo.js';
import { translate as translateASMTurtle } from
'../../../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';
import { translateBBCBasicToWebLogo } from
'../../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/translateBBCBasicToWebLogo.js';
import { translateToWebLogo as translateCanvas2d } from
'../../../../modules/components/code-editor/code-fixer/fixers/canvas-2d/translateToWebLogo.js';
import { translateCheerfulToWebLogo } from
'../../../../modules/components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/translateCheerfulToWebLogo.js';
import { translate as translateFMSLogoCode } from
'../../../../modules/parsing/fms-logo/translation-to-weblogo/translate.js';
import { translate as translateKTurtle } from
'../../../../modules/parsing/kturtle/translation-to-weblogo/translate.js';
import { translateToWebLogo as translateCodeHeartTurtleScriptToWebLogo } from
'../../../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateToWebLogo.js';
import { translate as translatePovRay } from
'../../../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';
import { translate as translateQBasic } from
'../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translate.js';
import { translate as translateSonicWebTurtle } from
'../../../../modules/parsing/sonic-webturtle/translation-to-weblogo/translate.js';
import { translateTurtleBlocksToWebLogo } from
'../../../../modules/parsing/sugarlabs-turtle-blocks/translation-to-weblogo/translateTurtleBlocksToWebLogo.js';
import { translatePythonCodeToWebLogo } from
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
	`; Inspired by
; https://de.pinterest.com/pin/9218374220582684
to `,
	'to',
	'to p',
	'to p\nend',
	`make "darkColor "#780
http://www.cropcircleconnector.com/Sorensen/2001/NineSpheresTK.jpg`,
	`imageAlpha :height :height 'local://Military_Officers_Association_of_America_logo.svg'`
]).concat(billNyeExamples, cgjenningsExamples, fractintExamples, processingExamples,
odinExamples, osmosianExamples, smallVisualBasicExamples);
// Processing, Odin, Osmosian plain English... don't have corresponding translators.
// Until a translator is made for them, Processing and Odin code
// should be classified as WebLogo.

const nonWebLogoTranslators = new Set([
	logo3DToWebLogo,
	papertToWebLogo,
	terrapinToWebLogo,
	translateAppleSoftBasicToWebLogo,
	translateASMTurtle,
	translateBBCBasicToWebLogo,
	translateCanvas2d,
	translateCheerfulToWebLogo,
	translateCodeHeartTurtleScriptToWebLogo,
	translateFMSLogoCode,
	translateKTurtle,
	translatePovRay,
	translatePythonCodeToWebLogo,
	translateQBasic,
	translateSonicWebTurtle,
	translateTurtleBlocksToWebLogo
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

addCases(applesoftExamples, translateAppleSoftBasicToWebLogo, false);
addCases(asmTurtleExamples, translateASMTurtle, false);
addCases(bbcBasicExamples, translateBBCBasicToWebLogo, false);
addCases(cheerfulNetherlandsLogoExamples, translateCheerfulToWebLogo, false);
addCases(filteredCodeHeartTurtleScriptExamples, translateCodeHeartTurtleScriptToWebLogo, false);
addCases(fmsLogoExamples, translateFMSLogoCode, false);
addCases(javascript2DCanvasExamples, translateCanvas2d, false);
addCases(kturtleExampleFiles, translateKTurtle, false);
addCases(logo3DExamples, logo3DToWebLogo, true);
addCases(logoInterpreterExamples, logoInterpreterToWebLogo, false);
addCases(papertExamples, papertToWebLogo, true);
addCases(povRayExamples, translatePovRay, false);
addCases(pythonTurtleExampleFilesContent, translatePythonCodeToWebLogo, false);
addCases(qbasicExamples, translateQBasic, false);
addCases(sonicWebTurtleExamples, translateSonicWebTurtle, false);
addCases(sugarLabsTurtleBlocksExamples, translateTurtleBlocksToWebLogo, false);
addCases(sugarLabsTurtleBlocksHTMLExamples, translateTurtleBlocksToWebLogo, false);
addCases(terrapinExamples, terrapinToWebLogo, false);

function testWebLogoCases(logger) {
	webLogoExampleCases.forEach(function(content, index) {
		const [translator, adjustAesthetics] = codeToTranslator(content);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (typeof adjustAesthetics !== 'boolean')
			plogger(`adjustAesthetics expected to be boolean but got ${adjustAesthetics}`);
		if (nonWebLogoTranslators.has(translator)) {
			let translatorName = 'undefined';
			if (typeof translator === 'function')
				translatorName = translator.name;
			plogger(`WebLogo code should not get translated but codeToTranslator returned ${translator}, which has name ${translatorName} for WebLogo example ${index} which has the code: ${content}`);
		}
	});
};

function testNonWebLogoCases(logger) {
	testInOutPairs(cases, codeToTranslator, logger);
}

export function testCodeToTranslator(logger) {
	wrapAndCall([
		testNonWebLogoCases,
		testWebLogoCases
	], logger);
};