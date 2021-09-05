import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';

export function validateKeywordsData(keywords, logger) {
	if (keywords === undefined)
		return;
	if (!(keywords instanceof Array)) {
		logger(`keywords must either be undefined or an Array but found ${keywords}`);
		return;
	}
	keywords.forEach(function(keyword, index) {
		if (typeof keyword !== 'object')
			logger(`keyword must be an object but found ${keyword} at index ${index}`);
		else if (typeof keyword.from !== 'string')
			logger(`keyword.from must be a string but found ${keyword.from} at index ${index}`);
		else {
			const plogger = prefixWrapper(`Case ${index}, from=${keyword.from}`, logger);
			const prev = keywords[index - 1];
			if (typeof prev === 'object' && typeof prev.from === 'string') {
				if (prev.from >= keyword.from)
					plogger(`keywords should be sorted alphabetically by from but ${prev.from} and ${keyword.from} are out of order`);
			}
			const optionalStrings = ['to', 'toSymbol'];
			for (const key of optionalStrings) {
				const val = keyword[key];
				if (val !== undefined) {
					if (typeof val !== 'string')
						plogger(`Expected val to be a string but found ${val}`);
				}
			}
			if (keyword.to !== undefined && keyword.toSymbol !== undefined)
				plogger(`to and toSymbol should not be specified on the same keyword but they are.`);
		}
	});
};