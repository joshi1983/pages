import { fetchJson } from '../../modules/fetchJson.js';
import { fetchText } from '../../modules/fetchText.js';
import { LogoParser } from '../../modules/parsing/LogoParser.js';
import { noop } from '../../modules/noop.js';
import { TestParseLogger } from '../helpers/TestParseLogger.js';
import { wrapAndCall } from '../helpers/wrapAndCall.js';

const topics = await fetchJson('json/generalHelpTopics.json');

function testJSONFormat(logger) {
	if (!(topics instanceof Array))
		logger('topics expected to be an Array but is not');
	else {
		const topicIds = new Set();
		topics.forEach(function(topic, index) {
			if (typeof topic !== 'object')
				logger('topic at index ' + index + ' expected to be an object but is not');
			else {
				const stringProperties = ['name', 'id', 'url'];
				stringProperties.forEach(function(stringProperty) {
					if (typeof topic[stringProperty] !== 'string')
						logger('topic.' + stringProperty + ' expected to be a string but is not at index ' + index + ' and name of ' + topic.name);
				});
				if (topicIds.has(topic.id))
					logger('Duplicate help topic id found for id ' + topic.id + ' at index ' + index);
				else
					topicIds.add(topic.id);

				fetchText(topic.url).then(function(html) {
					const div = document.createElement('div');
					div.innerHTML = html;
					const textContent = div.textContent;
					
				}).catch(function(e) {
					logger('Failed to get HTML content for URL: ' + topic.url + ', with error message: ' + e);
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
			const tree = LogoParser.getParseTree(code, parseLogger);
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