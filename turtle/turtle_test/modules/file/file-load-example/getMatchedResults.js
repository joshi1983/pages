import { fetchJson } from '../../fetchJson.js';
import { sanitizeExamples } from '../file-load-example/sanitizeExamples.js';
import { SearchQuery } from './SearchQuery.js';
const examples = await fetchJson('json/scriptExamples.json');
sanitizeExamples(examples);

export function getMatchedResults(query) {
	query = new SearchQuery(query);
	return examples.filter(function(example) {
		return query.isMatching(example);
	});
};