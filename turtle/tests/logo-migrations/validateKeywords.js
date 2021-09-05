import { Keyword } from '../../modules/parsing/Keyword.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

export function validateKeywords(fullInfoObject, logger) {
	if (!(fullInfoObject.keywords instanceof Array))
		logger(`Expected a keywords Array but got ${fullInfoObject.keywords}`);
	else {
		fullInfoObject.keywords.forEach(function(keywordInfo, index) {
			const plogger = prefixWrapper(`Keyword ${index}, from ${keywordInfo.from}`, logger);
			if (typeof keywordInfo.from !== 'string')
				plogger(`Expected from to be a string but got ${keywordInfo.from}`);
			if (typeof keywordInfo.to !== 'string' && keywordInfo.to !== null)
				plogger(`Expected to to be a string but got ${keywordInfo.to}`);
			if (typeof keywordInfo.to === 'string' && Keyword.getKeywordInfo(keywordInfo.to) === undefined)
				plogger(`Expected to find information on keyword ${keywordInfo.to} but found none in WebLogo.`);
		});
	}
};