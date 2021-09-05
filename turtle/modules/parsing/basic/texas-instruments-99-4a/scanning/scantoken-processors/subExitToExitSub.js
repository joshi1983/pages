import { Token } from
'../../../../Token.js';

/*
In TI-99 BASIC, subexit is a way to exit a subroutine or subprogram before the end of its implementation.
subexit is similar to Logo's stop command.

In QBASIC, an exit sub can return from a subroutine early.
QBASIC's "exit sub" is translated to "stop" in WebLogo.
*/
export function subExitToExitSub(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s.toLowerCase() === 'subexit') {
			token.s = 'exit';
			token.colIndex -= 3;
			scanTokens.splice(i + 1, 0, new Token('sub', token.colIndex + 1, token.lineIndex));
		}
	}
};