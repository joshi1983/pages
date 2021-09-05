import { escapeSpecialCharacters } from '../escapeSpecialCharacters.js';
import { processHyperlinks } from './processHyperlinks.js';
import { StringBuffer } from '../../../StringBuffer.js';

export function processComments(s) {
	const result = new StringBuffer();
	var lastOutputIndex;
	while (true) {
		const index = s.indexOf(';', lastOutputIndex);
		if (index === -1) {
			result.append(escapeSpecialCharacters(s.substring(lastOutputIndex)));
			break;
		}
		else {
			result.append(escapeSpecialCharacters(s.substring(lastOutputIndex, index)));
			const endOfCommentIndex = s.indexOf('\n', index);
			if (endOfCommentIndex !== -1) {
				result.append(`<span class="comment">${processHyperlinks(s.substring(index, endOfCommentIndex))}</span>`);
				lastOutputIndex = endOfCommentIndex;
			}
			else {
				result.append(`<span class="comment">${processHyperlinks(s.substring(index))}</span>`);
				break;
			}
		}
	}
	return result.toString();
};