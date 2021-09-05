import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

const testModules = [
	'./testEvaluateStringLiteral.js',
	'./testEvaluateTemplateLiteral.js',
	'./evaluators/testEvaluators.js',
	'./testIsLikelyJavaScript.js',
	'./testMightHaveSideEffects.js',
	'./testNaiveStripJavaScriptComments.js',
	'./testOperatorsJSON.js',
	'./testParse.js',
	'./testParseArrayLiterals.js',
	'./testParseArrowFunctions.js',
	'./testParseAssignments.js',
	'./testParseAwait.js',
	'./testParseBinaryOperators.js',
	'./testParseBreak.js',
	'./testParseClassDefinitions.js',
	'./testParseCodeBlocks.js',
	'./testParseComments.js',
	'./testParseContinue.js',
	'./testParseCurlyBracketExpressions.js',
	'./testParseCurlyBrackets.js',
	'./testParseCurvedBracketExpression.js',
	'./testParseDeclarations.js',
	'./testParseDelete.js',
	'./testParseDot.js',
	'./testParseDoWhileLoops.js',
	'./testParseErroneousJavaScript.js',
	'./testParseExportStatements.js',
	'./testParseExpressions.js',
	'./testParseForLoops.js',
	'./testParseFunctionCalls.js',
	'./testParseFunctionDefinitions.js',
	'./testParseIfStatements.js',
	'./testParseImports.js',
	'./testParseIndexExpression.js',
	'./testParseIndexExpressionIndex.js',
	'./testParseInOperator.js',
	'./testParseJavaScriptFromExamples.js',
	'./testParseRegularExpressions.js',
	'./testParseSpecialValues.js',
	'./testParseSwitchStatements.js',
	'./testParseTernaryOperator.js',
	'./testParseTreeTokensToCode.js',
	'./testParseTryCatch.js',
	'./testParseUnaryOperators.js',
	'./testParseVariousJavaScriptFiles.js',
	'./testParseWebLogoJavaScript.js',
	'./testParseWith.js',
	'./testParseWhileLoops.js',
	'./parsing/testParsing.js',
	'./testReservedWord.js',
	'./testReservedWordsJSON.js',
	'./scanning/testScanning.js',
	'./scanning-template-literals/testScanningTemplateLiterals.js',
	'./translation-to-weblogo/testTranslationToWebLogo.js'
];

const testFunctions = [];
for (const modulePath of testModules) {
	const m = await import(modulePath);
	let index = modulePath.lastIndexOf('/');
	let keyWithExtension = modulePath.substring(index + 1);
	index = keyWithExtension.lastIndexOf('.');
	let key;
	if (index === -1)
		key = keyWithExtension;
	else
		key = keyWithExtension.substring(0, index);
	testFunctions.push(m[key]);
}

export function testJSParsing(logger) {
	wrapAndCall(testFunctions, logger);
};