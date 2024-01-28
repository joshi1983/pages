import { ArrayUtils } from '../../ArrayUtils.js';
import { fetchJson } from '../../fetchJson.js';
import { IndexSearchTopic } from './IndexSearchTopic.js';
import { showGeneralHelpContent } from '../showGeneralHelpContent.js';
const generalTopics = await fetchJson('json/generalHelpTopics.json');

const generalHelpTopics = generalTopics.map(function(generalTopic) {
	function click() {
		showGeneralHelpContent(generalTopic.id);
	}
	const info = {
		'primaryName': generalTopic.name
	};
	let type = IndexSearchTopic.TopicTypeGeneral;
	if (generalTopic.id === 'breakpoint')
		type = IndexSearchTopic.TopicTypeBreakpoint;
	return new IndexSearchTopic(type, info, click);
});

export function addGeneralHelpTopics(topics) {
	ArrayUtils.pushAll(topics, generalHelpTopics);
};