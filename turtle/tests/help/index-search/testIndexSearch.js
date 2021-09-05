import { testIndexSearchTopic } from './testIndexSearchTopic.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

export function testIndexSearch(logger) {
	wrapAndCall([
		testIndexSearchTopic
	], logger);
};