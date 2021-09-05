import { testCodeheartTurtleScriptColor } from './testCodeheartTurtleScriptColor.js';
import { testColorsJSON } from './testColorsJSON.js';
import { testGetColourNameReferencesFromParseTree } from
'./testGetColourNameReferencesFromParseTree.js';
import { testIsLikelyCodeHeartTurtleScript } from
'./testIsLikelyCodeHeartTurtleScript.js';
import { testTranslateConsoleLogCalls } from './testTranslateConsoleLogCalls.js';
import { testTranslatedConsoleLogStatementsWithExecution } from
'./testTranslatedConsoleLogStatementsWithExecution.js';
import { testTranslateExamples } from './testTranslateExamples.js';
import { testTranslateSwitchStatements } from './testTranslateSwitchStatements.js';
import { testTranslateToWebLogo } from './testTranslateToWebLogo.js';
import { testTranslateToWebLogoWithProcedures } from
'./testTranslateToWebLogoWithProcedures.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testCodeHeartTurtleScript(logger) {
	wrapAndCall([
		testCodeheartTurtleScriptColor,
		testColorsJSON,
		testGetColourNameReferencesFromParseTree,
		testIsLikelyCodeHeartTurtleScript,
		testTranslateConsoleLogCalls,
		testTranslatedConsoleLogStatementsWithExecution,
		testTranslateExamples,
		testTranslateSwitchStatements,
		testTranslateToWebLogo,
		testTranslateToWebLogoWithProcedures
	], logger);
};