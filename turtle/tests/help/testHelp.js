import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testCommandDetails } from './command-details/testCommandDetails.js';
import { testCommandExamples } from './testCommandExamples.js';
import { testGeneralHelpTopics } from './testGeneralHelpTopics.js';
import { testGlossaryJSON } from './testGlossaryJSON.js';
import { testIndexSearch } from './index-search/testIndexSearch.js';
import { testProcessExampleCount } from './testProcessExampleCount.js';
import { testProcessPointCloudFileFormatsTable } from './testProcessPointCloudFileFormatsTable.js';
import { testTutorialJSON } from './testTutorialJSON.js';

export function testHelp(logger) {
	testCommandDetails(prefixWrapper('testCommandDetails', logger));
	testCommandExamples(prefixWrapper('testCommandExamples', logger));
	testGeneralHelpTopics(prefixWrapper('testGeneralHelpTopics', logger));
	testGlossaryJSON(prefixWrapper('testGlossaryJSON', logger));
	testIndexSearch(prefixWrapper('testIndexSearch', logger));
	testProcessExampleCount(prefixWrapper('testProcessExampleCount', logger));
	testProcessPointCloudFileFormatsTable(prefixWrapper('testProcessPointCloudFileFormatsTable', logger));
	testTutorialJSON(prefixWrapper('testTutorialJSON', logger));
};