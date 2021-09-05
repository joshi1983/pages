import { testGetParseTreeTokenTypeForString } from './testGetParseTreeTokenTypeForString.js';
import { testInstruction } from './testInstruction.js';
import { testIsLikelyASMTurtle } from './testIsLikelyASMTurtle.js';
import { testParseInstructions } from './testParseInstructions.js';
import { testParseLabels } from './testParseLabels.js';
import { testParseProcedures } from './testParseProcedures.js';
import { testParseVariableDeclarations } from './testParseVariableDeclarations.js';
import { testParsing } from './testParsing.js';
import { testScanning } from './scanning/testScanning.js';
import { testTranslateToWebLogo } from './translation-to-weblogo/testTranslateToWebLogo.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testASMTurtle(logger) {
	wrapAndCall([
		testGetParseTreeTokenTypeForString,
		testInstruction,
		testIsLikelyASMTurtle,
		testParseInstructions,
		testParseLabels,
		testParseProcedures,
		testParseVariableDeclarations,
		testParsing,
		testScanning,
		testTranslateToWebLogo
	], logger);
};