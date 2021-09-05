import { isComment } from '../qbasic/scanning/isComment.js';
import { isREMComment } from '../qbasic/scanning/isREMComment.js';
import { isStringLiteral } from '../qbasic/scanning/isStringLiteral.js';
import { scan } from '../qbasic/scanning/scan.js';
import { scanTokensToCode } from './scanTokensToCode.js';

/*
Empties various comments and string literals in BASIC code.
Since comments and string literals can contain a wide variety of text,
isLikely... functions sometimes return incorrect results due to undesirable matches within comments and string literals.
Calling stripBASICCommentsAndEmptyStringLiterals on the code before checking the regular expressions
tends to get more reliable results.

This is intended to work for many versions/dialects of the BASIC programming language.

@param removeComments is optional.  If true, REM and ' comments will be removed completely.
	If not, the comments will be reduced to the comment prefixes.
	Not completely removing them can help some regular expressions look for patterns that include single line Basic style comments.
*/
export function stripBASICCommentsAndEmptyStringLiterals(code, removeComments) {
	if (removeComments === undefined)
		removeComments = false;

	let tokens = scan(code);
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (isREMComment(token.s))
			token.s = 'REM ';
		else if (isComment(token.s) && token.s[0] === '\'')
			token.s = '\'';
		else if (isStringLiteral(token.s)) {
			const ch = token.s[0];
			token.s = ch + ch;
		}
	}
	if (removeComments === true)
		tokens = tokens.filter(t => !isREMComment(t.s) && !isComment(t.s));
	return scanTokensToCode(tokens);
};