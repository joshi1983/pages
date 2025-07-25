import { Keyword } from '../../modules/parsing/Keyword.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';

const toSymbols = new Set('[]()'.split(''));

export function validateKeywords(fullInfoObject, logger) {
	if (!(fullInfoObject.keywords instanceof Array))
		logger(`Expected a keywords Array but got ${fullInfoObject.keywords}`);
	else {
		fullInfoObject.keywords.forEach(function(keywordInfo, index) {
			const plogger = prefixWrapper(`Keyword ${index}, from ${keywordInfo.from}`, logger);
			if (typeof keywordInfo.from !== 'string')
				plogger(`Expected from to be a string but got ${keywordInfo.from}`);
			if (typeof keywordInfo.toSymbol === 'string') {
				if (!toSymbols.has(keywordInfo.toSymbol))
					plogger(`Expected toSymbol to be one of ${Array.from(toSymbols).join(', ')} but found ${keywordInfo.toSymbol}`);
			}
			else if (typeof keywordInfo.to !== 'string' && keywordInfo.to !== null &&
			keywordInfo.description === undefined)
				plogger(`Expected "toSymbol", "to", or "description" to be a string but "to" is ${keywordInfo.to}`);
			if (typeof keywordInfo.to === 'string' && Keyword.getKeywordInfo(keywordInfo.to) === undefined) {
				if (keywordInfo.to !== '' || keywordInfo.description === undefined)
					plogger(`Expected to find information on keyword ${keywordInfo.to} but found none in WebLogo.`);
			}
		});
	}
};