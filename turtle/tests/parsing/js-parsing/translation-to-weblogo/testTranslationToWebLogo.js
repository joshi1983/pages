import { testExecuteMath } from './testExecuteMath.js';
import { testTranslateAssignments } from './testTranslateAssignments.js';
import { testTranslateBadExamples } from './testTranslateBadExamples.js';
import { testTranslateConsoleLogCalls } from './testTranslateConsoleLogCalls.js';
import { testTranslatedConsoleLogStatementsWithExecution } from './testTranslatedConsoleLogStatementsWithExecution.js';
import { testTranslateExamples } from './testTranslateExamples.js';
import { testTranslateFunctionDefinitions } from './testTranslateFunctionDefinitions.js';
import { testTranslateLoops } from './testTranslateLoops.js';
import { testTranslateSwitchStatements } from './testTranslateSwitchStatements.js';
import { testTranslateToWebLogo } from './testTranslateToWebLogo.js';
import { testTypeProcessors } from './type-processors/testTypeProcessors.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testTranslationToWebLogo(logger) {
	wrapAndCall([
		testExecuteMath,
		testTranslateAssignments,
		testTranslateBadExamples,
		testTranslateConsoleLogCalls,
		testTranslatedConsoleLogStatementsWithExecution,
		testTranslateExamples,
		testTranslateFunctionDefinitions,
		testTranslateLoops,
		testTranslateSwitchStatements,
		testTranslateToWebLogo,
		testTypeProcessors
	], logger);
};