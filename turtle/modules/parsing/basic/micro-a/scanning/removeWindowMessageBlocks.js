export function removeWindowMessageBlocks(scanTokens) {
	let startIndex;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const lowerS = token.s.toLowerCase();
		if (lowerS === 'winmsg')
			startIndex = i;
		else if (lowerS === 'endwm') {
			if (startIndex !== undefined) {
				const removeCount = i + 1 - startIndex;
				scanTokens.splice(startIndex, removeCount);
				i-=removeCount;
			}
			startIndex = undefined;
		}
	}
};