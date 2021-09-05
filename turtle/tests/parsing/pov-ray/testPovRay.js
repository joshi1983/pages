import { testColorsJSON } from './testColorsJSON.js';
import { testIsLikelyPovRay } from './testIsLikelyPovRay.js';
import { testParse } from './testParse.js';
import { testParseArray } from './testParseArray.js';
import { testParseBinaryOperators } from './testParseBinaryOperators.js';
import { testParseCurlyBracketExpressions } from './testParseCurlyBracketExpressions.js';
import { testParseDeclare } from './testParseDeclare.js';
import { testParseDictionary } from './testParseDictionary.js';
import { testParseDotProperty } from './testParseDotProperty.js';
import { testParseExamples } from './testParseExamples.js';
import { testParseExpressions } from './testParseExpressions.js';
import { testParseFunction } from './testParseFunction.js';
import { testParseIf } from './testParseIf.js';
import { testParseIfElse } from './testParseIfElse.js';
import { testParseInclude } from './testParseInclude.js';
import { testParseInvalidCode } from './testParseInvalidCode.js';
import { testParseLocal } from './testParseLocal.js';
import { testParseMacro } from './testParseMacro.js';
import { testParseRange } from './testParseRange.js';
import { testParseSwitch } from './testParseSwitch.js';
import { testParseTernary } from './testParseTernary.js';
import { testParseUnaryOperators } from './testParseUnaryOperators.js';
import { testParseVectorExpressions } from './testParseVectorExpressions.js';
import { testParseWhile } from './testParseWhile.js';
import { testPovRayColor } from './testPovRayColor.js';
import { testPovRayCommand } from './testPovRayCommand.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testPovRay(logger) {
	wrapAndCall([
		testColorsJSON,
		testIsLikelyPovRay,
		testParse,
		testParseArray,
		testParseBinaryOperators,
		testParseCurlyBracketExpressions,
		testParseDeclare,
		testParseDictionary,
		testParseDotProperty,
		testParseExamples,
		testParseExpressions,
		testParseFunction,
		testParseIf,
		testParseIfElse,
		testParseInclude,
		testParseInvalidCode,
		testParseLocal,
		testParseMacro,
		testParseRange,
		testParseSwitch,
		testParseTernary,
		testParseUnaryOperators,
		testParseVectorExpressions,
		testParseWhile,
		testPovRayColor,
		testPovRayCommand,
		testScanning,
		testTranslationToWebLogo
	], logger);
};