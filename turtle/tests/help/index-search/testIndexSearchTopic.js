import { IndexSearchTopic } from '../../../modules/help/index-search/IndexSearchTopic.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testMakingOperatorTopic(logger) {
	function click() {
		
	}

	const topic = new IndexSearchTopic(IndexSearchTopic.TopicTypeOperator, {
		'primaryName': 'test',
		'names': [],
		'searchKeywords': []
	}, click);
	if (topic.type !== IndexSearchTopic.TopicTypeOperator)
		logger(`Expected type to be ${IndexSearchTopic.TopicTypeOperator} but got ${topic.type}`);
}

function testTypes(logger) {
	function typeToTopic(type) {
		return new IndexSearchTopic(type, {'primaryName': 'Test Name'}, function() {});
	}
	const types = [];
	const keys = Object.keys(IndexSearchTopic);
	for (let key of keys) {
		if (typeof IndexSearchTopic[key] === 'number') {
			const type = IndexSearchTopic[key];
			const topic = typeToTopic(type);
			const iconClass = topic.getIconClasses();
			const title = topic.getTypeTitle();
			if (typeof iconClass !== 'string')
				logger(`getIconClasses() should return a string for all types but got something else for type ${key} which has number ${type}.  Actual result was ${iconClass}`);
			if (typeof title !== 'string')
				logger(`getTitle() should return a string for all types but got something else for type ${key} which has number ${type}.  Actual result was ${title}`);
		}
	}
}

export function testIndexSearchTopic(logger) {
	wrapAndCall([
		testMakingOperatorTopic,
		testTypes
	], logger);
};