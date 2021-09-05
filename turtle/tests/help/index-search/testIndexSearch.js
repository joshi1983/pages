import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testIndexSearchTopic } from './testIndexSearchTopic.js';

export function testIndexSearch(logger) {
	testIndexSearchTopic(prefixWrapper('testIndexSearchTopic', logger));
};