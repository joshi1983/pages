import { testGetProceduresMap } from './testGetProceduresMap.js';
import { testIsLikelyKTurtle } from './testIsLikelyKTurtle.js';
import { testKTurtleCommand } from './testKTurtleCommand.js';
import { testKTurtleOperators } from './testKTurtleOperators.js';
import { testParse } from './testParse.js';
import { testParseCommandCalls } from './testParseCommandCalls.js';
import { testParseFor } from './testParseFor.js';
import { testParseIf } from './testParseIf.js';
import { testParseOperators } from './testParseOperators.js';
import { testParseProcedures } from './testParseProcedures.js';
import { testParseRepeat } from './testParseRepeat.js';
import { testParseVariousExamples } from './testParseVariousExamples.js';
import { testParseWhile } from './testParseWhile.js';
import { testScanning } from './scanning/testScanning.js';
import { testStringLiteralToValue } from './testStringLiteralToValue.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testKTurtle(logger) {
	wrapAndCall([
		testGetProceduresMap,
		testIsLikelyKTurtle,
		testKTurtleCommand,
		testKTurtleOperators,
		testParse,
		testParseCommandCalls,
		testParseFor,
		testParseIf,
		testParseOperators,
		testParseProcedures,
		testParseRepeat,
		testParseVariousExamples,
		testParseWhile,
		testScanning,
		testStringLiteralToValue,
		testTranslationToWebLogo
	], logger);
};