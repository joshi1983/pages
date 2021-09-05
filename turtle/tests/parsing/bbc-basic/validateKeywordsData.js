import { prefixWrapper } from
'../../helpers/prefixWrapper.js';

export function validateKeywordsData(keywords, logger) {
	if (keywords === undefined)
		return;
	if (!(keywords instanceof Array)) {
		logger(`keywords must either be undefined or an Array but found ${keywords}`);
		return;
	}
	keywords.forEach(function(keyword, index) {
		const plogger = prefixWrapper(`Case ${index}, from=${keyword.from}`, logger);
		if (typeof keyword !== 'object')
			plogger(`keyword must be an object but found ${keyword}`);
		else {
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