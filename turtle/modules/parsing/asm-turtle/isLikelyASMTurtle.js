import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
/#/, // indicating comments from Python
/(^|\s)\/\*/i, // indicating multi-line comments from JavaScript
/"/, // used in string literals in many Logo variants but never in ASM Turtle.
/\[/, // [ is not part of the ASM Turtle language.
/\]/, // ] is not part of the ASM Turtle language.
/\*/, // * is not part of the ASM Turtle language.
/\(/, // ( is not part of the ASM Turtle language.
/(^|\s)import(\s|$)/, // import statements are in Python but not found in ASM Turtle.
/(^|\s)forward(\s|$)/i, // ASM Turtle supports 'fd' in any case but not the full word 'forward'.
/(^|\s)repeat\s+\d+/i, // repeat command is commonly used in many variants of Logo but never in ASM Turtle.
/(^|\s)for(\s|$)/i,
/(^|\s)while\s*\(/, // JavaScript indicator
/(^|\s)do\s*\{/, // JavaScript indicator
/(^|\s)let\s+/, // JavaScript indicator
/(^|\s)const\s+/, // JavaScript indicator
/(^|\s)setpensize(\s|$)/i,
/(^|\s)setpenwidth(\s|$)/i,
/(^|\s)setpencolor(\s|$)/i,
/(^|\s)repeat\s/i,
// ASM Turtle has no repeat instruction but most Logo interpreters support it and most Logo programs call it.
];
const signals = [
/(^|\s)instr(\s|$)/i, // instruction list
/(^|\n)var\s/i, // variable declarations
/(^|\s)@@[a-z_][a-z_0-9]+\:(\s|$)/i, // label anchor
];

function removeCommentFromLine(line) {
	const index = line.indexOf('//');
	if (index === -1)
		return line;
	else
		return line.substring(0, index);
}

function quicklyRemoveASMTurtleComments(code) {
	return code.split('\n').map(removeCommentFromLine).join('\n');
}

export function isLikelyASMTurtle(code) {
	if (typeof code !== 'string')
		throw new Error(`Expected code to be a string but got ${code}`);
	code = quicklyRemoveASMTurtleComments(code);
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	return false;
};