import { testCommandDetails } from './command-details/testCommandDetails.js';
import { testCommandExamples } from './testCommandExamples.js';
import { testDataTypeNameToHelpUrl } from './testDataTypeNameToHelpUrl.js';
import { testDataTypesExpressionExampleToDiv } from './testDataTypesExpressionExampleToDiv.js';
import { testDataTypesFormatExamplesJSON } from './testDataTypesFormatExamplesJSON.js';
import { testGeneralHelpTopics } from './testGeneralHelpTopics.js';
import { testGlossaryJSON } from './testGlossaryJSON.js';
import { testHelpUrlToEnglish } from './testHelpUrlToEnglish.js';
import { testHelpUrlToFormalName } from './testHelpUrlToFormalName.js';
import { testIndexSearch } from './index-search/testIndexSearch.js';
import { testProcessExampleCount } from './testProcessExampleCount.js';
import { testProcessPointCloudFileFormatsTable } from './testProcessPointCloudFileFormatsTable.js';
import { testTutorialJSON } from './testTutorialJSON.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

export function testHelp(logger) {
	wrapAndCall([
		testCommandDetails,
		testCommandExamples,
		testDataTypeNameToHelpUrl,
		testDataTypesExpressionExampleToDiv,
		testDataTypesFormatExamplesJSON,
		testGeneralHelpTopics,
		testGlossaryJSON,
		testHelpUrlToEnglish,
		testHelpUrlToFormalName,
		testIndexSearch,
		testProcessExampleCount,
		testProcessPointCloudFileFormatsTable,
		testTutorialJSON
	], logger);
};