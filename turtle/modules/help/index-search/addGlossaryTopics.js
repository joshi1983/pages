import { GlossaryRepository } from '../../components/GlossaryRepository.js';
import { IndexSearchTopic } from './IndexSearchTopic.js';
import { showGlossaryTerm } from '../showGlossaryTerm.js';

export function addGlossaryTopics(topics) {
	GlossaryRepository.getAllTermsData().forEach(function(info) {
		function click() {
			showGlossaryTerm(info.name, true);
		}

		let searchKeywords = [];
		if (info.searchKeywords instanceof Array)
			searchKeywords = info.searchKeywords;
		topics.push(new IndexSearchTopic(IndexSearchTopic.TopicTypeGlossaryTerm, {
			'primaryName': info.name,
			'searchKeywords': searchKeywords
		}, click));
	});
};