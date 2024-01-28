import { BufferedParseLogger } from './modules/parsing/loggers/BufferedParseLogger.js';
import { LogoParser } from './modules/parsing/LogoParser.js';

onmessage = function(e) {
	const [text, proceduresMap] = e.data;
	if (!(proceduresMap instanceof Map))
		console.error('proceduresMap must be a Map but got ' + proceduresMap);
	if (typeof text !== 'string')
		console.error('text expected to be a string but got: ' + text);
	LogoParser.asyncInit().then(function() {
		const logger = new BufferedParseLogger();
		const tree = LogoParser.getParseTree(text, logger, proceduresMap);
		postMessage({
			'tree': tree,
			'messages': logger._messages
		});
	});
}