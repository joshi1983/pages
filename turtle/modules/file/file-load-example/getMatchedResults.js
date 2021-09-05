import { fetchJson } from '../../fetchJson.js';
import { sanitizeExamples } from '../file-load-example/sanitizeExamples.js';
import { SearchQuery } from './SearchQuery.js';
const examples = await fetchJson('json/scriptExamples.json');
sanitizeExamples(examples);

export function getMatchedResults(query, urlToCode, options) {
	if (typeof urlToCode !== 'function')
		throw new Error(`urlToCode must be a function but given ${urlToCode}`);
	if (options === undefined)
		options = {};

	query = new SearchQuery(query);
	let results = examples.filter(function(example) {
		return query.isMatchingStrict(example);
	});
	if (!options.strictCommandUsage) {
		if (results.length < 3) {
			// if very few results found, relax the filter criteria so 
			// that more results are likely to be included.
			results = examples.filter(function(example) {
				return query.isMatchingMedium(example);
			});
		}
		if (results.length < 2) {
			// if very few results found, relax the filter criteria so 
			// that even more results are likely to be included.
			results = examples.filter(function(example) {
				return query.isMatchingLoose(example, urlToCode(example.filename));
			});
		}
	}
	return results;
};