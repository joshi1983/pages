import { wrapAndCall } from '../../helpers/wrapAndCall.js';

const testModules = [
	'./ada/testAda.js',
	'./apex/testApex.js',
	'./asm-turtle/testASMTurtle.js',
	'./basic/testBasic.js',
	'./batch/testBatch.js',
	'./bcpl/testBCPL.js',
	'./beanShell/testBeanShell.js',
	'./cobol/testCobol.js',
	'./css/testCSS.js',
	'./dart/testDart.js',
	'./elm/testElm.js',
	'./fms-logo/testFMSLogo.js',
	'./forth/testForth.js',
	'./gleam/testGleam.js',
	'./groovy/testGroovy.js',
	'./haskell/testHaskell.js',
	'./holy-c/testHolyC.js',
	'./hp-gl/testHPGL.js',
	'./js-parsing/testJSParsing.js',
	'./kojo/testKojo.js',
	'./kotlin/testKotlin.js',
	'./kturtle/testKTurtle.js',
	'./lisp/testLisp.js',
	'./l-systems/testLSystems.js',
	'./lua/testLua.js',
	'./math/testMath.js',
	'./ml/testMl.js',
	'./modula-2/testModula2.js',
	'./pascal/testPascal.js',
	'./perl/testPerl.js',
	'./php/testPHP.js',
	'./pitrified-go-turtle/testPitrifiedGoTurtle.js',
	'./pov-ray/testPovRay.js',
	'./processing/testProcessing.js',
	'./prolog/testProlog.js',
	'./python/testPython.js',
	'./rust-turtle/testRustTurtle.js',
	'./shaders/testShaders.js',
	'./sonic-webturtle/testSonicWebTurtle.js',
	'./sugarlabs-turtle-blocks/testSugarLabsTurtleBlocks.js',
	'./swift/testSwift.js',
	'./turtle-graphics-fun/testTurtleGraphicsFun.js',
	'./turtletoy-net/testTurtleToyNet.js',
	'./verse/testVerse.js',
	'./zig/testZig.js',
];

const testFunctions = [];
for (const modulePath of testModules) {
	try {
		const m = await import(modulePath);
		const key1 = modulePath.substring(modulePath.lastIndexOf('/') + 1);
		const key = key1.substring(0, key1.length - 3);
		testFunctions.push(m[key]);
	} catch (e) {
		console.error(e);
		console.error(`error caught while processing modulePath=${modulePath}`);
	}
}
		
export function testOtherLanguages(logger) {
	wrapAndCall(testFunctions, logger);
};