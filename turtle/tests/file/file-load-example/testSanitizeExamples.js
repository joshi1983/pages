import { DeepEquality } from '../../../modules/DeepEquality.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { sanitizeExamples } from '../../../modules/file/file-load-example/sanitizeExamples.js';

export function testSanitizeExamples(logger) {
	const examples = [
	{
		"filename": "flags/united-states.lgo",
		"name": "American Flag",
		"searchKeywords": ["United States"],
		"newSearchKeywords": ['flags', "United States"]
	},
	{
		'filename': 'holidays/halloween/pumpkin.lgo',
		'name': 'Pumpkin',
		'searchKeywords': [],
		'newSearchKeywords': ['halloween', 'holidays']
	}
	];
	sanitizeExamples(examples);
	examples.forEach(function(exampleInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const expected = exampleInfo.newSearchKeywords;
		if (true !== DeepEquality.equals(exampleInfo.searchKeywords, expected)) {
			plogger(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(exampleInfo.searchKeywords)}`);
		}
	});
};