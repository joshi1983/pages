function isPossibleLabel(s) {
	return /^[1-9][0-9]*$/.test(s);
}

function mightBeDataValueStartToken(s) {
	s = s.toLowerCase();
	if (s === 'end' || s === 'go' || s === 'to')
		return false;
	return true;
}

/*
Translates Applesoft BASIC statements like:
color = 3
to QBASIC equivalents like:
color 3

let color = 3 causes a syntax error in Applesoft BASIC 1.0
as tested at https://archive.org/details/MECC-T648_Beginning_Applesoft_BASIC_v1.0
but we'll remove the 'let' token in that case too.
*/
export function processColorAssignments(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const s = token.s.toLowerCase();
		if (s === 'color') {
			let prev;
			if (i > 0) {
				prev = scanTokens[i - 1];
				if (prev.lineIndex === token.lineIndex &&
				prev.s.toLowerCase() !== 'let' &&
				!isPossibleLabel(prev.s))
					continue;
			}
			const next = scanTokens[i + 1];
			if (next === undefined)
				break;
			if (next.s.toLowerCase() !== '=')
				continue;
			const nextAfter = scanTokens[i + 2];
			if (nextAfter === undefined)
				break;
			if (mightBeDataValueStartToken(nextAfter.s)) {
				if (prev !== undefined && prev.s.toLowerCase() === 'let') {
					scanTokens.splice(i - 1, 1); // remove the 'let' token.
					i--;
				}
				scanTokens.splice(i + 1, 1); // remove the '=' token.
			}
		}
	}
};