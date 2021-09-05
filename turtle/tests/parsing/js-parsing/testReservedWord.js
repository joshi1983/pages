import { ReservedWord } from '../../../modules/parsing/js-parsing/ReservedWord.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function testGetAllReservedWords(logger) {
	const result = ReservedWord.getAllReservedWords();
	if (!(result instanceof Array))
		logger(`Expected result to be an Array but got ${result}`);
	else {
		const distinctWords = new Set();
		for (let i = 0; i < result.length; i++) {
			const word = result[i];
			if (typeof word !== 'string')
				logger(`Expected every word to be a string but got ${word}`);
			else {
				if (distinctWords.has(word))
					logger(`Expected every word to be distinct but found a duplicate of ${word}`);
				distinctWords.add(word);
			}
		}
	}
}

export function testReservedWord(logger) {
	wrapAndCall([
		testGetAllReservedWords
	], logger);
};