import { isIdentifier } from '../../../qbasic/scanning/isIdentifier.js';

function isIfStart(scanTokens, i) {
	const tokenS = scanTokens[i].s.toLowerCase();
	if (tokenS !== 'if')
		return false;
	if (i === scanTokens.length - 1)
		return false;
	const prev = scanTokens[i - 1];
	if (prev !== undefined && prev.s.toLowerCase() !== 'end')
		return true;
	return false;
}

export function processEndProc(scanTokens) {
	let stack = [];
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		const prev = scanTokens[i - 1];
		const next = scanTokens[i + 1];
		const s = token.s.toLowerCase();
		if (s === 'endproc') {
			if (stack.length <= 1 &&
			(prev === undefined || prev.s.toLowerCase() !== 'then')) {
				token.s = 'END';
				stack.length = 0;
			}
			else {
				token.s = 'RETURN';
				if (stack[stack.length - 1] === 'if')
					stack.pop();
			}
		}
		else if (s === 'for' || isIfStart(scanTokens, i) || s === 'repeat')
			stack.push(s);
		else if (s === 'endif' || s === 'next' || s === 'wend' || s === 'until') {
			if (stack.length > 0)
				stack.pop();
		}
		else if ((s === 'sub' ||
		s === 'def' || s === 'function') && next !== undefined &&
		next.lineIndex === token.lineIndex && isIdentifier(next.s) &&
		(prev === undefined || prev.s.toLowerCase() !== 'end')) {
			stack = [s];
		}
	}
};