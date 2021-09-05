import { LogoParser } from
'../../modules/parsing/LogoParser.js';
import { codeToTranslator } from
'../../modules/components/code-editor/code-fixer/codeToTranslator.js';
import { asyncInit as asyncInitCreateParameterizedGroups } from '../../modules/parsing/createParameterizedGroups.js';
import { ready } from '../../modules/ready.js';

// Some of the following imports must wait
// to prevent an error like: "isInstructionList is not a function"
await LogoParser.asyncInit();
const likelies = [
	['0L L-Systems', 'parsing/other-languages/l-systems/0L/isLikely0L.js'],
	['Ada', 'parsing/other-languages/ada/isLikelyAda.js'],
	['AMOS Basic', 'parsing/other-languages/basic/amos-basic/isLikelyAmosBasic.js'],
	['ANSI Basic', 'parsing/other-languages/basic/ansi-basic/isLikelyAnsiBasic.js'],
	['Apex (from Salesforce)', 'parsing/other-languages/apex/isLikelyApex.js'],
	['AppleSoft BASIC', 'parsing/other-languages/basic/applesoft-basic/isLikelyAppleSoftBasic.js'],
	['Arc (a dialect of Lisp by Paul Graham and Robert Morris)', 'parsing/other-languages/lisp/arc/isLikelyArc.js'],
	['ASM Turtle', 'parsing/other-languages/asm-turtle/isLikelyASMTurtle.js'],
	['Atari Turbo Basic XL', 'parsing/other-languages/basic/atari-turbo-basic-xl/isLikelyAtariTurboBasicXL.js'],
	['Basic in general(no specific dialect)', 'parsing/other-languages/basic/isLikelyBasic.js', true],
	['Basic 256', 'parsing/other-languages/basic/basic-256/isLikelyBasic256.js'],
	['Basic Fusion ( https://basicfusion.org )', 'parsing/other-languages/basic/basic-fusion/isLikelyBasicFusion.js'],
	['Basil Basic', 'parsing/other-languages/basic/basil/isLikelyBasilBasic.js'],
	['Batch', 'parsing/other-languages/batch/isLikelyBatch.js'],
	['Bazz Basic', 'parsing/other-languages/basic/bazz-basic/isLikelyBazzBasic.js'],
	['BBC BASIC', 'parsing/other-languages/basic/bbc-basic/isLikelyBBCBasic.js'],
	['BCPL (Basic Combined Programming Language)', 'parsing/other-languages/bcpl/isLikelyBCPL.js'],
	['BeanShell', 'parsing/other-languages/beanShell/isLikelyBeanShell.js'],
	['Canvas2D', 'components/code-editor/code-fixer/fixers/canvas-2d/isLikelyCanvas2D.js'],
	['CGJennings L-Systems', 'parsing/other-languages/l-systems/cgjennings/isLikelyCGJennings.js'],
	['Cheerful Netherlands Logo', 'components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/isLikelyCheerfulNetherlandsLogo.js'],
	['Cobol', 'parsing/other-languages/cobol/isLikelyCobol.js'],
	['CodeHeart TurtleScript', 'components/code-editor/code-fixer/fixers/codeheart-turtlescript/isLikelyCodeHeartTurtleScript.js'],
	['Commodore Basic', 'parsing/other-languages/basic/commodore-basic/isLikelyCommodoreBasic.js'],
	['CSS', 'parsing/other-languages/css/isLikelyCSS.js'],
	['Dart', 'parsing/other-languages/dart/isLikelyDart.js'],
	['Elm', 'parsing/other-languages/elm/isLikelyElm.js'],
	['FMS Logo', 'parsing/other-languages/fms-logo/isLikelyFMSLogo.js'],
	['Forth ( a stack-oriented programming language )', 'parsing/other-languages/forth/isLikelyForth.js'],
	['Fractint', 'parsing/other-languages/l-systems/fractint/isLikelyFractInt.js'],
	['German Logo(Commodore 64 or Apple II)', 'components/code-editor/code-fixer/fixers/german-logo/isLikelyGermanLogo.js'],
	['Gleam', 'parsing/other-languages/gleam/isLikelyGleam.js'],
	['GLSL(OpenGL Shader Language)', 'parsing/other-languages/shaders/glsl/isLikelyGLSL.js'],
	['Groovy', 'parsing/other-languages/groovy/isLikelyGroovy.js'],
	['Haskell', 'parsing/other-languages/haskell/isLikelyHaskell.js'],
	['HLSL(High level shading language from Microsoft DirectX)', 'parsing/other-languages/shaders/hlsl/isLikelyHLSL.js'],
	['HP-GL', 'parsing/other-languages/hp-gl/isLikelyHPGL.js'],
	['Holy C', 'parsing/other-languages/holy-c/isLikelyHolyC.js'],
	['JavaScript in general(no specific graphics library)', 'parsing/other-languages/js-parsing/isLikelyJavaScript.js', true],
	['JS Processing(ie. P5.js)', 'parsing/other-languages/processing/js-processing/isLikelyJavaScriptProcessing.js'],
	['Julia', 'parsing/other-languages/math/julia/isLikelyJulia.js'],
	['Kojo(basically Scala + turtle graphics)', 'parsing/other-languages/kojo/isLikelyKojo.js'],
	['Kotlin', 'parsing/other-languages/kotlin/isLikelyKotlin.js'],
	['KTurtle', 'parsing/other-languages/kturtle/isLikelyKTurtle.js'],
	['Logo3D', 'components/code-editor/code-fixer/fixers/logo-3d/isLikelyLogo3D.js'],
	['Logo Interpreter', 'components/code-editor/code-fixer/fixers/logo-interpreter/isLikelyLogoInterpreter.js'],
	['Lua', 'parsing/other-languages/lua/isLikelyLua.js'],
	['MatLab', 'parsing/other-languages/math/matlab/isLikelyMatLab.js'],
	['ML (Meta Language)', 'parsing/other-languages/ml/isLikelyMetaLanguage.js', true],
	['Micro(A) BASIC', 'parsing/other-languages/basic/micro-a/isLikelyMicroABasic.js'],
	['Modula-2', 'parsing/other-languages/modula-2/isLikelyModula2.js'],
	['Ocaml', 'parsing/other-languages/ml/ocaml/isLikelyOcaml.js'],
	['Papert', 'components/code-editor/code-fixer/fixers/papert/isLikelyPapert.js'],
	['pBasic (a dialect of Basic by John Roland Penner)', 'parsing/other-languages/basic/pbasic/isLikelyPBasic.js'],
	['Perl', 'parsing/other-languages/perl/isLikelyPerl.js'],
	['PHP (language mostly for programming web servers)', 'parsing/other-languages/php/isLikelyPHP.js'],
	['Pitrified Go Turtle', 'parsing/other-languages/pitrified-go-turtle/isLikelyPitrifiedGoTurtle.js'],
	['PlayBasic', 'parsing/other-languages/basic/playbasic/isLikelyPlayBasic.js'],
	['POV Ray', 'parsing/other-languages/pov-ray/isLikelyPovRay.js'],
	['Processing', 'parsing/other-languages/processing/isLikelyProcessing.js'],
	['Prolog', 'parsing/other-languages/prolog/isLikelyProlog.js'],
	['Python', 'parsing/other-languages/python/isLikelyPythonCode.js'],
	['QBASIC', 'parsing/other-languages/basic/qbasic/isLikelyQBasic.js'],
	['Ruby', 'parsing/other-languages/ruby/isLikelyRuby.js'],
	['Rust Turtle', 'parsing/other-languages/rust-turtle/isLikelyRustTurtle.js'],
	['SeaTurtle( https://oaksnow.com/seaturtle/ )', 'components/code-editor/code-fixer/fixers/sea-turtle/isLikelySeaTurtle.js'],
	['Sinclair BASIC', 'parsing/other-languages/basic/sinclair-basic/isLikelySinclairBasic.js'],
	['Small Visual Basic', 'parsing/other-languages/basic/small-visual-basic/isLikelySmallVisualBasic.js'],
	['Sonic Web Turtle', 'parsing/other-languages/sonic-webturtle/isLikelySonicWebTurtle.js'],
	['Sugar Labs Turtle Blocks', 'parsing/other-languages/sugarlabs-turtle-blocks/isLikelySugarLabsTurtleBlocks.js'],
	['Super Logo', 'components/code-editor/code-fixer/fixers/super-logo/isLikelySuperLogo.js'],
	['Swift', 'parsing/other-languages/swift/isLikelySwift.js'],
	['Tektronix 405X BASIC', 'parsing/other-languages/basic/tektronix-405x-basic/isLikelyTektronix405XBasic.js'],
	['Terrapin', 'components/code-editor/code-fixer/fixers/terrapin/isLikelyTerrapin.js'],
	['Texas Instruments 99/4A BASIC', 'parsing/other-languages/basic/texas-instruments-99-4a/isLikelyTexasInstruments99_4a.js'],
	['TRS-80(Tandy\'s) BASIC', 'parsing/other-languages/basic/trs-80-basic/isLikelyTRS80Basic.js'],
	['TRUE BASIC', 'parsing/other-languages/basic/true-basic/isLikelyTrueBasic.js'],
	['Turing', 'parsing/other-languages/pascal/turing/isLikelyTuring.js'],
	['Turtle Graphics Fun ( https://www.turtlegraphics.fun )', 'parsing/other-languages/turtle-graphics-fun/isLikelyTurtleGraphicsFun.js'],
	['TurtleToy.net', 'parsing/other-languages/turtletoy-net/isLikelyTurtleToyNet.js'],
	['WGSL (Shader language used with WebGPU)', 'parsing/other-languages/shaders/wgsl/isLikelyWGSL.js'],
	['VBA (Microsoft\'s Visual Basic for Applications)', 'parsing/other-languages/basic/visual-basic-for-applications/isLikelyVisualBasicForApplications.js'],
	['Verse (Epic Games scripting language)', 'parsing/other-languages/verse/isLikelyVerse.js'],
	['Zig', 'parsing/other-languages/zig/isLikelyZig.js']
];

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
const translators = [
	['AppleSoft BASIC',
	'parsing/other-languages/basic/applesoft-basic/translation-to-weblogo/translateAppleSoftBasicToWebLogo.js'
	],
	['ASM Turtle(Josh Greig\'s educational assembly language with turtle graphics)',
	'parsing/other-languages/asm-turtle/translation-to-weblogo/translate.js'
	],
	['BBC BASIC', 'parsing/other-languages/basic/bbc-basic/translation-to-weblogo/translateBBCBasicToWebLogo.js'],
	['Canvas2D', 'components/code-editor/code-fixer/fixers/canvas-2d/translateToWebLogo.js'],
	['Cheerful',
	'components/code-editor/code-fixer/fixers/cheerful-netherlands-logo/translateCheerfulToWebLogo.js'],
	['CodeHeart TurtleScript', 'components/code-editor/code-fixer/fixers/codeheart-turtlescript/translateToWebLogo.js'],
	['FMSLogo', 'parsing/other-languages/fms-logo/translation-to-weblogo/translate.js'],
	['KTurtle', 'parsing/other-languages/kturtle/translation-to-weblogo/translate.js'],
	['Logo3D', 'components/code-editor/code-fixer/fixers/logo-3d/logo3DToWebLogo.js'],
	['Logo Interpreter', 'components/code-editor/code-fixer/fixers/logo-interpreter/logoInterpreterToWebLogo.js'],
	['Papert', 'components/code-editor/code-fixer/fixers/papert/papertToWebLogo.js'],
	['POV Ray Script', 'parsing/other-languages/pov-ray/translation-to-weblogo/translate.js'],
	['Processing', 'parsing/other-languages/processing/translation-to-weblogo/translateProcessingToWebLogo.js'],
	['Python', 'parsing/other-languages/python/newTranslatePythonCodeToWebLogo.js'],
	['QBASIC', 'parsing/other-languages/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js'],
	['Sonic WebTurtle', 'parsing/other-languages/sonic-webturtle/translation-to-weblogo/translate.js'],
	['Terrapin', 'components/code-editor/code-fixer/fixers/terrapin/terrapinToWebLogo.js'],
	['TurtleBlocks', 'parsing/other-languages/sugarlabs-turtle-blocks/translation-to-weblogo/translateTurtleBlocksToWebLogo.js']
];

const translatorNameMap = new Map([
]);
const isLikelyNamePairs = [
];
const genericIsLikelies = new Set();

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
	const dialectSpecificLiklies = likelies.filter(L => !genericIsLikelies.has(L[0]));
	if (dialectSpecificLiklies.length > 1) {
		const tooManyLikelyDiv = document.createElement('div');
		tooManyLikelyDiv.classList.add('warning');
		tooManyLikelyDiv.innerText = `Too many likely functions are returning true.  At most only 1 dialect-specific should return true for given code but ${dialectSpecificLiklies.length} are returning true.`;
		likelyContainer.appendChild(tooManyLikelyDiv);
	}
	outputElement.appendChild(likelyContainer);
	outputElement.appendChild(unlikelyContainer);
}

function modulePathToExportName(moduleURL) {
	const index = moduleURL.lastIndexOf('/');
	let key = moduleURL.substring(index + 1);
	if (key.endsWith('.js'))
		key = key.substring(0, key.length - 3);
	return key;
}

async function loadModules() {
	const loadingStatusElement = document.getElementById('loading-status');
	for (const likelyInfo of likelies) {
		const name = likelyInfo[0];
		const isLikelyModuleURL = likelyInfo[1];
		const moduleURL = '../../modules/' + isLikelyModuleURL;
		loadingStatusElement.innerText = `Loading ${name} detector`;
		const m = await import(moduleURL);
		const key = modulePathToExportName(moduleURL);
		const func = m[key];
		if (typeof func !== 'function') {
			const msg = `Unable to find a function for ${key} in module ${moduleURL}`;
			console.error(msg);
			loadingStatusElement.innerText = msg;
			return;
		}
		else {
			if (likelyInfo.length > 2 && likelyInfo[2] === true)
				genericIsLikelies.add(func);

			isLikelyNamePairs.push([func, name]);
		}
	}
	for (const pair of translators) {
		const name = pair[0];
		const moduleURL = '../../modules/' + pair[1];
		loadingStatusElement.innerText = `Loading ${name} detector`;
		const key = modulePathToExportName(moduleURL);
		const m = await import(moduleURL);
		const func = m[key];
		if (typeof func !== 'function') {
			const msg = `Unable to find a function for ${key} in module ${moduleURL}`;
			console.error(msg);
			loadingStatusElement.innerText = msg;
			return;
		}
		else {
			translatorNameMap.set(func, name);
		}
	}
	loadingStatusElement.remove();
}

function init() {
	codeElement = document.getElementById('code');
	outputElement = document.getElementById('classification-report');
	codeElement.addEventListener('change', updateClassificationReport);
	codeElement.addEventListener('input', updateClassificationReport);
	loadModules().then(function() {
		codeElement.value = initialCode;
		updateClassificationReport();
	});
}

await asyncInitCreateParameterizedGroups();
ready(init);