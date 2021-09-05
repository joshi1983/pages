import { testEvaluation } from './evaluation/testEvaluation.js';
import { testIsLikelyPitrifiedGoTurtle } from './testIsLikelyPitrifiedGoTurtle.js';
import { testOperatorsJSON } from './testOperatorsJSON.js';
import { testParsing } from './parsing/testParsing.js';
import { testScanning } from './scanning/testScanning.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testPitrifiedGoTurtle(logger) {
	wrapAndCall([
		testEvaluation,
		testIsLikelyPitrifiedGoTurtle,
		testOperatorsJSON,
		testParsing,
		testScanning
	], logger);
};