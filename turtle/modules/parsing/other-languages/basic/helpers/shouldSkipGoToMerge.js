
/*
In a very rare case, it can be unsafe to replace "go to" with "goto".
For example, 
for x=go to 10
	print "hi"
next x

Notice the "go" is a variable instead of part of a "goto" statement.
shouldSkipGoToMerge is intended to detect such weird cases and return false on them.
*/
export function shouldSkipGoToMerge(scanTokens, i) {
	const startLineIndex = scanTokens[i].lineIndex;
	for (i--; i >= 0; i--) {
		const token = scanTokens[i];
		if (token.lineIndex !== startLineIndex)
			return true;
		const lowerS = token.s.toLowerCase();
		if (lowerS === 'for')
			return false;
		else if (lowerS === ':')
			return true;
	}
	return true;
};