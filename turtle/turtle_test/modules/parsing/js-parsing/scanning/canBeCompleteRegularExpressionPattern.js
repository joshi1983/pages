
const pushPopPairArray = [
	['(', ')'],
	['[', ']']
];
const pushableChars = new Set(pushPopPairArray.map(pair => pair[0]));
const popPushPairs = new Map(pushPopPairArray.map(pair => [pair[1], pair[0]]));

export function canBeCompleteRegularExpressionPattern(s) {
	const stack = [];
	for (let i = 0; i < s.length; i++) {
		const ch = s[i];
		if (ch === '\\') {
			if (i === s.length - 1)
				return false; // can't escape a character after the end of the string.
			i++;
		}
		else if (pushableChars.has(ch))
			stack.push(ch);
		else if (popPushPairs.has(ch)) {
			const pushedChar = popPushPairs.get(ch);
			if (stack.length === 0)
				return false; // for example, s = '[1]]'.
			const poppedChar = stack.pop();
			if (poppedChar !== pushedChar)
				return false; // mismatch indicating imbalanced brackets
				// For example, s = '(]'
		}
	}
	return stack.length === 0;
};