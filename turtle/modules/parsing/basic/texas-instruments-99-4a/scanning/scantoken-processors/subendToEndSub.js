import { Token } from
'../../../../Token.js';

/*
In TI-99 BASIC, subend marks the end of a subroutine or subprogram.
In QBASIC, end sub marks the end of a subroutine.
*/
export function subendToEndSub(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'subend') {
			token.s = 'end';
			token.colIndex -= 3;
			scanTokens.splice(i + 1, 0, new Token('sub', token.colIndex + 3, token.lineIndex));
		}
	}
};