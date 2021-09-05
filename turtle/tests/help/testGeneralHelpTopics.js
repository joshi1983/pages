import { fetchJson } from '../../modules/fetchJson.js';
import { fetchText } from '../../modules/fetchText.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { noop } from '../../modules/noop.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

const topics = await fetchJson('json/generalHelpTopics.json');

function testJSONFormat(logger) {
	if (!(topics instanceof Array))
		logger('topics expected to be an Array but is not');
	else {
		const topicIds = new Set();
		topics.forEach(function(topic, index) {
			const plogger = prefixWrapper(`Case ${index} and name of ${topic.name}`, logger);
			if (typeof topic !== 'object')
				plogger('topic at index ' + index + ' expected to be an object but is not');
			else {
				const stringProperties = ['name', 'id', 'url'];
				stringProperties.forEach(function(stringProperty) {
					if (typeof topic[stringProperty] !== 'string')
						plogger('topic.' + stringProperty + ' expected to be a string but is not');
				});
				if (topicIds.has(topic.id))
					plogger('Duplicate help topic id found for id ' + topic.id);
				else
					topicIds.add(topic.id);
				if (topic.keywords !== undefined &&
				!(topic.keywords instanceof Array))
					plogger(`keywords must be an Array but found ${topic.keywords}`);
				else if (topic.keywords !== undefined) {
					for (const keyword of topic.keywords) {
						if (typeof keyword !== 'string')
							plogger(`Every keyword must be a string but found ${keyword} in keywords property.`);
					}
				}

				fetchText(topic.url).then(function(html) {
					const div = document.createElement('div');
					div.innerHTML = html;
					const textContent = div.textContent;
					
				}).catch(function(e) {
					plogger('Failed to get HTML content for URL: ' + topic.url + ', with error message: ' + e);
				});
			}
		});
	}
}

function testParsePastableCodeExamples(logger) {
	topics.filter(t => typeof t.url === 'string').
		forEach(async function(topic) {
		const html = await fetchText(topic.url);
		const div = document.createElement('div');
		div.innerHTML = html;
		const codeElements = div.querySelectorAll('code.pastable');
		codeElements.forEach(function(codeElement) {
			const code = codeElement.textContent;
			const parseLogger = new TestParseLogger(noop, code);
			LogoParser.getParseTree(code, parseLogger);
			if (parseLogger.hasLoggedErrorsOrWarnings())
				logger('No error or warning expected but at least one found for topic ' + topic.url +
					". The errors are: " + JSON.stringify(parseLogger.getErrors()) + '.  The warnings are: ' + JSON.stringify(parseLogger.getWarnings()));
		});
	});
}

export function testGeneralHelpTopics(logger) {
	wrapAndCall([
		testJSONFormat,
		testParsePastableCodeExamples
	], logger);
};