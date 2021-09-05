import { testHandleCompactKeywords } from './testHandleCompactKeywords.js';
import { testSanitizeExamples } from './testSanitizeExamples.js';
import { testScriptExampleDisplay } from './testScriptExampleDisplay.js';
import { testScriptExampleExecutionScheduler } from './testScriptExampleExecutionScheduler.js';
import { testSearchResultsChanged } from './testSearchResultsChanged.js';
import { testTreeToThumbnailSettings } from './testTreeToThumbnailSettings.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testFileLoadExample(logger) {
	wrapAndCall([
		testHandleCompactKeywords,
		testSanitizeExamples,
		testScriptExampleDisplay,
		testScriptExampleExecutionScheduler,
		testSearchResultsChanged,
		testTreeToThumbnailSettings,
	], logger);
};