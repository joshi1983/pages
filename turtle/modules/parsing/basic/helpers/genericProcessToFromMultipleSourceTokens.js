import { shouldSkipGoToMerge } from './shouldSkipGoToMerge.js';

/*
Processes changes such as renaming "go to" to "goto".

Unlike genericProcessTo, genericProcessToFromMultipleSourceTokens goes 
from names that contain spaces to names that don't.

renameMap should be a Map from lower case strings to new strings.
*/
export function genericProcessToFromMultipleSourceTokens(renameMap) {
	const newRenameMap = new Map();
	for (const fromName of renameMap.keys()) {
		const firstSpaceIndex = fromName.indexOf(' ');
		if (firstSpaceIndex !== -1) {
			const name = fromName.substring(0, firstSpaceIndex);
			newRenameMap.set(name, []);
			const nextParts = fromName.split(' ').slice(1);
			const info = newRenameMap.get(name);
			let shouldMerge = function() {return true;};
			if (fromName === 'go to' && renameMap.get(fromName) === 'goto')
				shouldMerge = shouldSkipGoToMerge;
			info.push([nextParts, renameMap.get(fromName), shouldMerge]);
		}
	}
	return function(scanTokens) {
		for (let i = 0; i < scanTokens.length; i++) {
			const token = scanTokens[i];
			const pairs = newRenameMap.get(token.s.toLowerCase());
			if (pairs !== undefined) {
				for (const [nextParts, to, shouldMerge] of pairs) {
					let matched = true;
					if (nextParts.length + i >= scanTokens.length)
						matched = false;
					else {
						for (let j = 0; j < nextParts.length; j++) {
							const part = nextParts[j];
							const otherToken = scanTokens[i + 1 + j];
							if (otherToken.s.toLowerCase() !== part ||
							otherToken.lineIndex !== token.lineIndex) {
								matched = false;
								break;
							}
						}
					}
					if (matched && shouldMerge(scanTokens, i)) {
						scanTokens.splice(i + 1, nextParts.length); // remove the extra parts.
						token.s = to;
					}
				}
			}
		}
	};
};