import { ArrayUtils } from '../../ArrayUtils.js';
import { fetchJson } from '../../fetchJson.js';
import { IndexSearchTopic } from './IndexSearchTopic.js';
import { showTutorialPage } from '../showTutorialPage.js';
const tutorialPages = await fetchJson('json/tutorial.json');

const tutorialTopics = tutorialPages.map(function(pageInfo) {
	function click() {
		showTutorialPage(pageInfo.filename);
	}
	return new IndexSearchTopic(IndexSearchTopic.TopicTypeTutorial, {
		'primaryName': pageInfo.name
	}, click);
});

export function addTutorialTopics(topics) {
	ArrayUtils.pushAll(topics, tutorialTopics);
};