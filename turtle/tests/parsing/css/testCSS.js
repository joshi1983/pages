import { testCssColorNameToHex } from './testCssColorNameToHex.js';
import { testEvaluators } from './evaluators/testEvaluators.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
import { testParse } from './testParse.js';
import { testParseAttributeSelector } from './testParseAttributeSelector.js';
import { testParseCalc } from './testParseCalc.js';
import { testParseImportant } from './testParseImportant.js';
import { testParseMediaQuery } from './testParseMediaQuery.js';
import { testParseRGB } from './testParseRGB.js';
import { testParseSelector } from './testParseSelector.js';
import { testParseVariousExamples } from './testParseVariousExamples.js';
import { testScanning } from './scanning/testScanning.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testCSS(logger) {
	wrapAndCall([
		testCssColorNameToHex,
		testEvaluators,
		testOperatorsJSON,
		testParse,
		testParseAttributeSelector,
		testParseCalc,
		testParseImportant,
		testParseMediaQuery,
		testParseRGB,
		testParseSelector,
		testParseVariousExamples,
		testScanning
	], logger);
};