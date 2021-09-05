import { breakLineAfter } from
'../breakLineAfter.js';

function getMatchingUntil(scanTokens, i) {
	let token = scanTokens[i + 1];
	if (token.s.toLowerCase() === 'until')
		return;
	let balance = 1;
	for (i += 2; i < scanTokens.length; i++) {
		token = scanTokens[i];
		if (token.s.toLowerCase() === 'repeat')
			balance++;
		else if (token.s.toLowerCase() === 'until') {
			balance--;
			if (balance === 0)
				return [token, i];
		}
	}
}

/*
Converts some repeat ... until loops to QBasic keywords.
*/
export function processRepeatToQBasic(scanTokens) {
	for (let i = 0; i < scanTokens.length - 1; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'repeat') {
			const pair = getMatchingUntil(scanTokens, i);
			if (pair !== undefined) {
				const [matchingUntil, untilIndex] = pair;
				token.s = 'DO';
				breakLineAfter(scanTokens, i);
				matchingUntil.s = 'LOOP WHILE NOT ';
			}
		}
	}
};