import { ArrayUtils } from '../../ArrayUtils.js';
import { CommandDetails } from '../CommandDetails.js';
import { fetchJson } from '../../fetchJson.js';
import { IndexSearchTopic } from './IndexSearchTopic.js';

function sanitizeCommandTopic(info) {
	function click() {
		CommandDetails.showDetails(info.primaryName);
	}
	return new IndexSearchTopic(IndexSearchTopic.TopicTypeCommand, info, click);
}

const commandTopics = (await fetchJson('json/commands.json')).map(sanitizeCommandTopic);

export function addCommandTopics(topics) {
	ArrayUtils.pushAll(topics, commandTopics);
};