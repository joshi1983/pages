import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../naiveStripComments.js';

const antiExpressions = [
/(^|\s)forward\s+/i,
/(^|\s)fd\s+/i, 
// fd is very common in most Logo variants.
// "draw" or "move" commands are used instead in Sonic WebTurtle.

/(^|\s)setpc\s+/i,
/(^|\s)setpencolor\s+/i,
/(^|\s)setpenwidth\s+/i,
/(^|\s)setpensize\s+/i,
/(^|\s)make\s+\"/i,
/(^|\s)for\s*\[/i,
/(^|\s)repeat\s+\d+\s*\[/i,
/(^|\s)ifelse\s+/i,
];
const likelyExpressions = [
/(^|\s)color\s+[\+-][0-9]+\s/i,
/(^|\s)remember\s+/i,
/(^|\s)go\s+[a-z]+\n/i, // call a procedure in Sonic WebTurtle
/(^|\s)goback\s+/i,
/(^|\s)forget\s+/i,
/(^|\s)move\s+/i,
/(^|\s)next\s+/i,
/(^|\s)endif\s+/i,
/# [a-z]+\n/i
// For example, "# test\n" which could start the definition of a procedure in Sonic WebTurtle
];

export function isLikelySonicWebTurtle(code) {
	code = naiveStripComments(code);
	if (matchesARegex(antiExpressions, code))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	return false;
};