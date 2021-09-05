import { codeToTranslator } from
'../../modules/components/code-editor/code-fixer/codeToTranslator.js';
import { isLikelyAnsiBasic } from
'../../modules/parsing/basic/ansi-basic/isLikelyAnsiBasic.js';
import { isLikelyAppleSoftBasic } from
'../../modules/parsing/basic/applesoft-basic/isLikelyAppleSoftBasic.js';
import { isLikelyASMTurtle } from
'../../modules/parsing/asm-turtle/isLikelyASMTurtle.js';
import { isLikelyBBCBasic } from
'../../modules/parsing/basic/bbc-basic/isLikelyBBCBasic.js';
import { isLikelyCanvas2D } from
'../../modules/components/code-editor/code-fixer/fixers/canvas-2d/isLikelyCanvas2D.js';
import { isLikelyCheerfulNetherlandsLogo } from
'../../modules/components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/isLikelyCheerfulNetherlandsLogo.js';
import { isLikelyCodeHeartTurtleScript } from
'../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/isLikelyCodeHeartTurtleScript.js';
import { isLikelyCommodoreBasic } from
'../../modules/parsing/basic/commodore-basic/isLikelyCommodoreBasic.js';
import { isLikelyCSS } from
'../../modules/parsing/css/isLikelyCSS.js';
import { isLikelyFMSLogo } from
'../../modules/parsing/fms-logo/isLikelyFMSLogo.js';
import { isLikelyKTurtle } from
'../../modules/parsing/kturtle/isLikelyKTurtle.js';
import { isLikelyLogo3D } from
'../../modules/components/code-editor/code-fixer/fixers/logo-3d/isLikelyLogo3D.js';
import { isLikelyLogoInterpreter } from
'../../modules/components/code-editor/code-fixer/fixers/logo-interpreter/isLikelyLogoInterpreter.js';
import { isLikelyPapert } from
'../../modules/components/code-editor/code-fixer/fixers/papert/isLikelyPapert.js';
import { isLikelyPovRay } from
'../../modules/parsing/pov-ray/isLikelyPovRay.js';
import { isLikelyPythonCode } from
'../../modules/parsing/python-parsing/isLikelyPythonCode.js';
import { isLikelyQBasic } from
'../../modules/parsing/basic/qbasic/isLikelyQBasic.js';
import { isLikelySinclairBasic } from
'../../modules/parsing/basic/sinclair-basic/isLikelySinclairBasic.js';
import { isLikelySmallVisualBasic } from
'../../modules/parsing/basic/small-visual-basic/isLikelySmallVisualBasic.js';
import { isLikelySonicWebTurtle } from
'../../modules/parsing/sonic-webturtle/isLikelySonicWebTurtle.js';
import { isLikelySugarLabsTurtleBlocks } from
'../../modules/parsing/sugarlabs-turtle-blocks/isLikelySugarLabsTurtleBlocks.js';
import { isLikelyTektronix405XBasic } from
'../../modules/parsing/basic/tektronix-405x-basic/isLikelyTektronix405XBasic.js';
import { isLikelyTerrapin } from
'../../modules/components/code-editor/code-fixer/fixers/terrapin/isLikelyTerrapin.js';
import { isLikelyTRS80Basic } from
'../../modules/parsing/basic/trs-80-basic/isLikelyTRS80Basic.js';
import { logo3DToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/logo-3d/logo3DToWebLogo.js';
import { logoInterpreterToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/logo-interpreter/logoInterpreterToWebLogo.js';
import { papertToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/papert/papertToWebLogo.js';
import { terrapinToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/terrapin/terrapinToWebLogo.js';
import { translateAppleSoftBasicToWebLogo } from
'../../modules/parsing/basic/applesoft-basic/translation-to-weblogo/translateAppleSoftBasicToWebLogo.js';
import { translate as translateASMTurtle } from
'../../modules/parsing/asm-turtle/translation-to-weblogo/translate.js';
import { translateCheerfulToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/translateCheerfulToWebLogo.js';
import { translate as translateFMSLogo } from
'../../modules/parsing/fms-logo/translation-to-weblogo/translate.js';
import { translate as translateKTurtle } from
'../../modules/parsing/kturtle/translation-to-weblogo/translate.js';
import { translate as translatePovRay } from
'../../modules/parsing/pov-ray/translation-to-weblogo/translate.js';
import { translateQBASICToWebLogo } from
'../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';
import { translate as translateSonicWebTurtle } from
'../../modules/parsing/sonic-webturtle/translation-to-weblogo/translate.js';
import { translateToWebLogo as translateCanvas2DToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/canvas-2d/translateToWebLogo.js';
import { translateToWebLogo as translateCodeHeartTurtleScriptToWebLogo } from
'../../modules/components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateToWebLogo.js';
import { translateBBCBasicToWebLogo } from
'../../modules/parsing/basic/bbc-basic/translation-to-weblogo/translateBBCBasicToWebLogo.js';
import { translateTurtleBlocksToWebLogo } from
'../../modules/parsing/sugarlabs-turtle-blocks/translation-to-weblogo/translateTurtleBlocksToWebLogo.js';
import { asyncInit, translatePythonCodeToWebLogo } from
'../../modules/parsing/python-parsing/translatePythonCodeToWebLogo.js';

await asyncInit();
const initialCode = `100 PAGE
110 SET DEGREES
120 PRINT "MULTIPLIER ";
130 INPUT M
140 MOVE 65,50
150 FOR A=3 TO 7200 STEP 3
160 R0=2+A/160
170 R=SIN(M*A)
180 X=65+R0*R*COS(A)
190 Y=50+R0*R*SIN(A)
200 DRAW X,Y
210 NEXT A
220 HOME
230 PRINT
240 PRINT`;
let codeElement, outputElement;
const translatorNameMap = new Map([
	[logo3DToWebLogo, 'Logo3D'],
	[logoInterpreterToWebLogo, 'Logo Interpreter'],
	[papertToWebLogo, 'Papert'],
	[terrapinToWebLogo, 'Terrapin'],
	[translateAppleSoftBasicToWebLogo, 'AppleSoft BASIC'],
	[translateASMTurtle, 'ASM Turtle(Josh Greig\'s educational assembly language with turtle graphics)'],
	[translateCheerfulToWebLogo, 'Cheerful'],
	[translateFMSLogo, 'FMSLogo'],
	[translateKTurtle, 'KTurtle'],
	[translatePovRay, 'POV Ray Script'],
	[translateQBASICToWebLogo, 'QBASIC'],
	[translateSonicWebTurtle, 'Sonic WebTurtle'],
	[translateCanvas2DToWebLogo, 'Canvas2D'],
	[translateCodeHeartTurtleScriptToWebLogo, 'CodeHeart TurtleScript'],
	[translateBBCBasicToWebLogo, 'BBC BASIC'],
	[translateTurtleBlocksToWebLogo, 'TurtleBlocks'],
	[translatePythonCodeToWebLogo, 'Python']
]);
const isLikelyNamePairs = [
	[isLikelyAnsiBasic, 'ANSI BASIC'],
	[isLikelyAppleSoftBasic, 'AppleSoft BASIC'],
	[isLikelyASMTurtle, 'ASM Turtle'],
	[isLikelyBBCBasic, 'BBC BASIC'],
	[isLikelyCanvas2D, 'Canvas2D'],
	[isLikelyCheerfulNetherlandsLogo, 'Cheerful Netherlands'],
	[isLikelyCodeHeartTurtleScript, 'CodeHeart TurtleScript'],
	[isLikelyCommodoreBasic, 'Commodore Basic'],
	[isLikelyCSS, 'CSS'],
	[isLikelyFMSLogo, 'FMS Logo'],
	[isLikelyKTurtle, 'KTurtle'],
	[isLikelyLogo3D, 'Logo3D'],
	[isLikelyLogoInterpreter, 'Logo Interpreter'],
	[isLikelyPapert, 'Papert'],
	[isLikelyPovRay, 'POV Ray'],
	[isLikelyPythonCode, 'Python'],
	[isLikelyQBasic, 'QBASIC'],
	[isLikelySinclairBasic, 'Sinclair BASIC'],
	[isLikelySmallVisualBasic, 'Small Visual Basic'],
	[isLikelySonicWebTurtle, 'Sonic Web Turtle'],
	[isLikelySugarLabsTurtleBlocks, 'Sugar Labs Turtle Blocks'],
	[isLikelyTektronix405XBasic, 'Tektronix 405X BASIC'],
	[isLikelyTerrapin, 'Terrapin'],
	[isLikelyTRS80Basic, 'TRS-80 BASIC'],
];

function translatorToLanguageName(translator) {
	if (translator instanceof Array)
		translator = translator[0];
	const result = translatorNameMap.get(translator);
	if (result === undefined)
		return `Unknown Language(${translator.constructor.name})`;
	else
		return result;
}

function addPairElements(container, pairs, cssClasses) {
	for (const pair of pairs) {
		const div = document.createElement('div');
		if (cssClasses !== undefined && cssClasses.length !== 0) {
			const iconSpan = document.createElement('span');
			for (const cssClass of cssClasses) {
				iconSpan.classList.add(cssClass);
			}
			div.appendChild(iconSpan);
		}
		const nameSpan = document.createElement('span');
		nameSpan.classList.add('name');
		nameSpan.innerText = pair[1];
		div.appendChild(nameSpan);
		container.appendChild(div);
	}
}

function updateClassificationReport() {
	const code = codeElement.value;
	const translator = codeToTranslator(code);
	outputElement.innerText = '';
	const nameDiv = document.createElement('div');
	const nameSpan = document.createElement('span');
	outputElement.innerText = '';
	nameSpan.innerText = translatorToLanguageName(translator);
	nameDiv.appendChild(nameSpan);
	outputElement.appendChild(nameDiv);
	const likelies = isLikelyNamePairs.filter((pair) => pair[0](code));
	const unlikelies = isLikelyNamePairs.filter((pair) => !pair[0](code));
	const likelyContainer = document.createElement('div');
	const unlikelyContainer = document.createElement('div');
	likelyContainer.classList.add('likely');
	unlikelyContainer.classList.add('unlikely');
	addPairElements(likelyContainer, likelies, ['fa', 'fa-solid', 'fa-check']);
	addPairElements(unlikelyContainer, unlikelies, ['fa', 'fa-solid', 'fa-not-equal']);
	if (likelies.length > 1) {
		const tooManyLikelyDiv = document.createElement('div');
		tooManyLikelyDiv.classList.add('warning');
		tooManyLikelyDiv.innerText = `Too many likely functions are returning true.  At most only 1 should return true for given code but ${likelies.length} are returning true.`;
		likelyContainer.appendChild(tooManyLikelyDiv);
	}
	outputElement.appendChild(likelyContainer);
	outputElement.appendChild(unlikelyContainer);
}

function init() {
	codeElement = document.getElementById('code');
	outputElement = document.getElementById('classification-report');
	codeElement.addEventListener('change', updateClassificationReport);
	codeElement.addEventListener('input', updateClassificationReport);
	codeElement.value = initialCode;
	updateClassificationReport();
}

init();