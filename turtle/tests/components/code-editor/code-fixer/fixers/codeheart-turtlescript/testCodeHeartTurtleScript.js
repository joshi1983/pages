import { testCodeheartTurtleScriptColor } from './testCodeheartTurtleScriptColor.js';
import { testGetColourNameReferencesFromParseTree } from
'./testGetColourNameReferencesFromParseTree.js';
import { testIsLikelyCodeHeartTurtleScript } from
'./testIsLikelyCodeHeartTurtleScript.js';
import { testTranslateAssignments } from './testTranslateAssignments.js';
import { testTranslateConsoleLogCalls } from './testTranslateConsoleLogCalls.js';
import { testTranslatedConsoleLogStatementsWithExecution } from
'./testTranslatedConsoleLogStatementsWithExecution.js';
import { testTranslateExamples } from './testTranslateExamples.js';
import { testTranslateFunctionDefinitions } from './testTranslateFunctionDefinitions.js';
import { testTranslateLoops } from './testTranslateLoops.js';
import { testTranslateSwitchStatements } from './testTranslateSwitchStatements.js';
import { testTranslateToWebLogo } from './testTranslateToWebLogo.js';
import { testTranslateToWebLogoWithProcedures } from
'./testTranslateToWebLogoWithProcedures.js';
import { testTypeProcessors } from
'./type-processors/testTypeProcessors.js';
import { wrapAndCall } from
'../../../../../helpers/wrapAndCall.js';

export function testCodeHeartTurtleScript(logger) {
	wrapAndCall([
		testCodeheartTurtleScriptColor,
		testGetColourNameReferencesFromParseTree,
		testIsLikelyCodeHeartTurtleScript,
		testTranslateAssignments,
		testTranslateConsoleLogCalls,
		testTranslatedConsoleLogStatementsWithExecution,
		testTranslateExamples,
		testTranslateFunctionDefinitions,
		testTranslateLoops,
		testTranslateSwitchStatements,
		testTranslateToWebLogo,
		testTranslateToWebLogoWithProcedures,
		testTypeProcessors
	], logger);
};