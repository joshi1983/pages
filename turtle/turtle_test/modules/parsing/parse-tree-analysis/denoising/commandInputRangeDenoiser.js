import { ArrayUtils } from '../../../ArrayUtils.js';
import { StringUtils } from '../../../StringUtils.js';

const interestingSubstrings = ['The maximum is', 'The minimum is'];
const removableSubstrings = ['requires input of type', "doesn't match any acceptable data type"];

function isRemovable(msg) {
	return StringUtils.containsAny(msg.msg, removableSubstrings);
}

function isOfInterest(msg) {
	return StringUtils.containsAny(msg.msg, interestingSubstrings);
}

export function commandInputRangeDenoiser(cachedParseTree, parseMessages) {
	let rangeMessages = parseMessages.filter(isOfInterest);
	if (rangeMessages.length === 0)
		return;
	rangeMessages = new Set(rangeMessages);
	ArrayUtils.remove(parseMessages, m => !isRemovable(m) || rangeMessages.has(m));
};