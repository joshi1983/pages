import { ArrayUtils } from '../../ArrayUtils.js';
import { fetchJson } from '../../fetchJson.js';
import { IndexSearchTopic } from './IndexSearchTopic.js';
import { OperatorDetails } from '../OperatorDetails.js';

function sanitizeOperatorInfo(info) {
	function click() {
		OperatorDetails.showDetails(info.symbol);
	}
	const names = info.name.toLowerCase().split(' ').filter(name => ['or', 'than'].indexOf(name.toLowerCase()) === -1);
	const newInfo = {
		'primaryName': info.symbol,
		'names': names,
		'searchKeywords': names
	};
	return new IndexSearchTopic(IndexSearchTopic.TopicTypeOperator, newInfo, click);
}

const operatorTopics = (await fetchJson('json/operators.json')).map(sanitizeOperatorInfo);

export function addOperatorTopics(topics) {
	ArrayUtils.pushAll(topics, operatorTopics);
};
