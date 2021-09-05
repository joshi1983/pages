import { prefixWrapper } from '../prefixWrapper.js';

function getReservedWordName(wordInfo) {
	if (typeof wordInfo === 'object' && wordInfo !== null)
		return wordInfo.name;
}

export function validateReservedWordsJSONData(reservedWords, logger) {
	if (!(reservedWords instanceof Array))
		logger(`Expected reservedWords to be an Array but it is not.  reservedWords = ${reservedWords}`);
	else {
		reservedWords.forEach(function(wordInfo, index) {
			let extraInfo = '';
			if (typeof wordInfo === 'object' && wordInfo !== null)
				extraInfo = `name = ${wordInfo.name}`;
			const plogger = prefixWrapper(`Case ${index}${extraInfo}`, logger);
			if (typeof wordInfo !== 'object')
				plogger(`Expected every element to be an object but found ${wordInfo}`);
			else if (typeof wordInfo.name !== 'string')
				plogger(`Expected name to be a string but got ${wordInfo.name}`);
			if (index > 0) {
				const prevName = getReservedWordName(reservedWords[index - 1]);
				const name = getReservedWordName(wordInfo);
				if (typeof prevName === 'string' &&
				typeof name === 'string' && prevName.localeCompare(name) >= 0)
					plogger(`reserved words are expected to be sorted by name but a pair is out of order.  previous name: ${prevName}, name=${name}`);
			}
		});
	}
};