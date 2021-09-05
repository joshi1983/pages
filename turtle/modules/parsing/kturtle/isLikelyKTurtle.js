import { countRegexMatches } from
'../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { scan } from './scanning/scan.js';

const nonKTurtleCommands = ['left', 'localmake', 'make', 'right', 'setfillcolor', 'setpensize'];
const nonTurtleCommandsSet = new Set(nonKTurtleCommands);
const nonCommandNonKTurtleRegexes = [
	/(^|\n);/, // strong indicator for most versions of Logo other than kturtle.
	/(^|\n)import\s+turtle/, // strong indicator of Python's code using the turtle package
	/from\s+turtle\s+import(\s+|[*])/, // another strong indicator of Python's code using turtle package
	/(^|\n)def\s+[a-zA-Z_]+\s*\(/, // common for Python scripts to define functions
	/^#\!\/usr\/bin\/env python/, // indication of a Python script
	/(^|\s)\#timeout=\d+/, // indication of a Logo3D script

	// some indicators of Cheerful Netherlands Logo
	/(^|\s)zetturtle\s+([0-9]+|\$[a-z_])/i,
	/(^|\s)leer\s+[a-z_][a-z0-9_]*\s*[\$\n]/i,
	/(^|\s)(pendikte|rechts|richting|vooruit)\s+(\d+|\$[a-z_][a-z0-9_]*)\s*(\n|$)/i,
	/(^|\s)schrijf\s+("|\$)/i,

	// some indications of Processing, c, c++, Java and other languages
	/(^|\s)void\s+[\w\W_]+\s*\(\s*\)\s*\{/, // for example, void setup() {
	/(^|\s)color\s+[\w\W_]+\s*\=[\s\w\W]/, // for example, color inside = color(204, 102, 0)

	// some indications of POV-ray scripts
	/(^|\s)\#include\s*\"/,
	/(^|\s)\#declare\s+[a-zA-Z_]/,
	/(^|\s)\#range\s*\(/,
	// This can match shape statements from POV Ray's scripting language
	/(^|\s)(box|cone|cylinder|intersection|lathe|sphere|union)\s*\{/i,
	
	// some indicators of QBasic
	/(^|\s)[a-z]+\$\s/i,
	/(^|\s)(circle|line|pset)\s+step\s*\(/i,

	// patterns for SugarLabs Turtle Blocks HTML exports
	/"\>\s*\[\s*\[\s*0\s*\,/,

	// This can match a tag-name selectors from CSS
	/(^|\s)(a|article|footer|h1|h2|h3|h4|h5|header|html|li|ol|p|section|span|ul)\s*\{/i
];
const nonKTurtleRegexes = [];
nonKTurtleCommands.forEach(function(command) {
	nonKTurtleRegexes.push(new RegExp('(^|\\s)' + command + '(\\s|$)', 'i'));
});
const kturtleRegexes = [
/(^|[\r\n])[ \t]*#\s/, // a single line comment in KTurtle's format which starts with #.
/(^|\s)\$[a-z_]+[0-9a-z_]*\s*=/i, // common for variable assignments.  For example, "$x = "
/(^|\s)learn\s+[a-zA-Z]/, // often used in KTurtle for defining procedures
/print\s+\$[_a-zA-Z]/, // For example, print $y or print $xyz
/^kturtle-script-v/,
/(^|\s)repeat\s+\d+\s*\{/
];

const weakIndicatorRegexes = [
	/(^|\s)pencolor\s+\d+\s*,\s*\d+\s*,\s*\d+(\s|$)/,
	/(^|\s)canvascolor\s+\d+\s*,\s*\d+\s*,\s*\d+(\s|$)/,
	/(^|\s)canvassize\s+\d+\s*,\s*\d+(\s|$)/,
	/(^|\s)turnleft\s+\d+(\s|$)/,
	/(^|\s)turnright\s+\d+(\s|$)/,
	/(^|\s)print\s+\"[^"]*\"(\s|$)/
];

function isLikelyNotKTurtle(code) {
	if (matchesARegex(nonCommandNonKTurtleRegexes, code))
		return true;
	let needingScan = false;
	for (let i = 0; i < nonKTurtleRegexes.length; i++) {
		const reg = nonKTurtleRegexes[i];
		if (reg.test(code) === true) {
			needingScan = true;
			break;
		}
	}
	if (needingScan) {
		const tokens = scan(code);
		for (let i = 0; i < tokens.length; i++) {
			const s = tokens[i].s;
			if (nonTurtleCommandsSet.has(s.toLowerCase()))
				return true;
		}
	}
	return false;
}

export function isLikelyKTurtle(code) {
	if (isLikelyNotKTurtle(code))
		return false;
	if (matchesARegex(kturtleRegexes, code))
		return true;
	if (countRegexMatches(code, weakIndicatorRegexes) >= 2)
		return true;
	return false;
};