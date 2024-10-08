import { Keyword } from '../../modules/parsing/Keyword.js';

export function testKeyword(logger) {
	const keywords = ['to', 'To', 'false', 'False', 'true'];
	keywords.forEach(function(keyword) {
		if (typeof Keyword.getKeywordInfo(keyword) === undefined)
			logger('Expected to find "' + keyword + '" as a keyword but it was not');
	});
	const allKeywords = Keyword.getAllKeywords();
	if (typeof allKeywords !== 'object')
		logger(`getAllKeywords() expected to return a new iterator object but got ${allKeywords}`);
	else if (typeof allKeywords.next !== 'function')
		logger(`getAllKeywords() expected to return an object with a next method but got ${allKeywords}`);

}