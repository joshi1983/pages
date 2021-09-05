import { isValidSubroutineName } from
'./isValidSubroutineName.js';
import { Token } from
'../../../../../../parsing/Token.js';

function shouldBeRemoved(scanTokens, i, stack) {
	const token = scanTokens[i];
	if (token.s.toLowerCase() === 'sub') {
		for (const stackedToken of stack) {
			if (stackedToken.s.toLowerCase() === 'sub')
				return true;
					// can't have a subroutine nested in another subroutine.
					// Remove the 'sub' to help the scanned tokens be a little closer to valid.
		}
		return false;
	}

	return stack.length === 0 && token.s.toLowerCase() === 'end';
		// the end doesn't match any opening indicators so remove it.
}

function shouldInsertOpenBracket(scanTokens, i, stack, lastRepeatToken, lastIfToken) {
	if (lastRepeatToken === undefined && lastIfToken === undefined)
		return false; // [ would be for a repeat or if.
			// if there is no previous repeat or if, we don't need a [.

	const token = scanTokens[i];
	const next = scanTokens[i + 1];
	if (next === undefined)
		return false;

	const tokenS = token.s.toLowerCase();
	if (tokenS === 'repeat' || tokenS === 'if')
		return true; // For example, 2+ repeats on the same line so insert [ before the next one.

	if (token.lineIndex === next.lineIndex)
		return false;
	
	return true;
}

function shouldConvertToCloseBracket(scanTokens, i, stack) {
	if (stack.length === 0)
		return false;
	
	// look for the marker for the end of a repeat's instruction list.
	const top = stack[stack.length - 1];
	const topS = top.s.toLowerCase();
	if (topS !== 'repeat' && topS !== 'if')
		return false;

	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'end')
		return false;

	return true;
}

function shouldPop(scanTokens, i, stack) {
	if (stack.length === 0)
		return false;

	// Look for the marker to the end of a subroutine.
	const top = stack[stack.length - 1];
	if (top.s.toLowerCase() !== 'sub')
		return false;

	const token = scanTokens[i];
	if (token.s.toLowerCase() !== 'end')
		return false;
	
	return true;
}

function shouldPushSub(scanTokens, i, stack) {
	const token = scanTokens[i];
	let j = i + 1;
	let next = scanTokens[j];
	while (next !== undefined && next.s[0] === ';') {
		next = scanTokens[++j];
	}
	if (next === undefined)
		return false;

	if (!isValidSubroutineName(next.s))
		return false;

	return true;
}

export function addSquareBrackets(scanTokens) {
	const stack = [];
	let lastRepeatToken, lastIfToken;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const tokenS = token.s.toLowerCase();
		if (shouldBeRemoved(scanTokens, i, stack)) {
			// weird case but maybe the inputted code isn't valid Sea Turtle code.
			scanTokens.splice(i, 1);
			i--; // cancel the effect of the for-loop's i++.
		}
		else if (shouldInsertOpenBracket(scanTokens, i, stack, lastRepeatToken, lastIfToken)) {
			if (lastRepeatToken !== undefined) {
				stack.push(lastRepeatToken);
				lastRepeatToken = undefined;
			}
			else if (lastIfToken !== undefined) {
				stack.push(lastIfToken);
				lastIfToken = undefined;				
			}
			scanTokens.splice(i, 0, new Token('[', token.colIndex, token.lineIndex));
			i++;
		}
		else if (shouldConvertToCloseBracket(scanTokens, i, stack)) {
			token.s = ']';
			stack.pop();
		}
		else if (shouldPop(scanTokens, i, stack))
			stack.pop();
		else if (shouldPushSub(scanTokens, i, stack))
			stack.push(token);

		if (tokenS === 'repeat')
			lastRepeatToken = token;
		else if (tokenS === 'if')
			lastIfToken = token;
	}
};