import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { testCommandExamples } from './testCommandExamples.js';
import { testGeneralHelpTopics } from './testGeneralHelpTopics.js';
import { testIndexSearch } from './index-search/testIndexSearch.js';
import { testTutorialJSON } from './testTutorialJSON.js';

export function testHelp(logger) {
	testCommandExamples(prefixWrapper('testCommandExamples', logger));
	testGeneralHelpTopics(prefixWrapper('testGeneralHelpTopics', logger));
	testIndexSearch(prefixWrapper('testIndexSearch', logger));
	testTutorialJSON(prefixWrapper('testTutorialJSON', logger));
};