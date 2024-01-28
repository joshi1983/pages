import { messageToDivNoProcessLinks } from './messageToDivNoProcessLinks.js';
import { processHelpLinks } from '../help/processHelpLinks.js';

export function messageToDiv(s, type, isHTML) {
	const result = messageToDivNoProcessLinks(s, type, isHTML);
	if (isHTML)
		processHelpLinks(result);
	return result;
};