import { testColorsJSON } from './testColorsJSON.js';
import { testIsLikelySonicWebTurtle } from './testIsLikelySonicWebTurtle.js';
import { testParse } from './testParse.js';
import { testParseBinaryOperators } from './testParseBinaryOperators.js';
import { testParseExamples } from './testParseExamples.js';
import { testParseIfElse } from './testParseIfElse.js';
import { testParsePrint } from './testParsePrint.js';
import { testParseProcStart } from './testParseProcStart.js';
import { testParseRepeat } from './testParseRepeat.js';
import { testParseTransparent } from './testParseTransparent.js';
import { testScanning } from './scanning/testScanning.js';
import { testSonicWebTurtleColor } from './testSonicWebTurtleColor.js';
import { testSonicWebTurtleOperators } from './testSonicWebTurtleOperators.js';
import { testTranslationToWebLogo } from './translation-to-weblogo/testTranslationToWebLogo.js';
import { testWebTurtleCommand } from './testWebTurtleCommand.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testSonicWebTurtle(logger) {
	wrapAndCall([
		testColorsJSON,
		testIsLikelySonicWebTurtle,
		testParse,
		testParseBinaryOperators,
		testParseExamples,
		testParseIfElse,
		testParsePrint,
		testParseProcStart,
		testParseRepeat,
		testParseTransparent,
		testScanning,
		testSonicWebTurtleColor,
		testSonicWebTurtleOperators,
		testTranslationToWebLogo,
		testWebTurtleCommand
	], logger);
};