import { scan } from './scanning/scan.js';

const nonKTurtleCommands = ['left', 'localmake', 'make', 'right', 'setfillcolor', 'setpensize'];
const nonTurtleCommandsSet = new Set(nonKTurtleCommands);
const nonCommandNonKTurtleRegexes = [
	/(^|\n);/, // strong indicator for most versions of Logo other than kturtle.
	/(^|\n)import\s+turtle/, // strong indicator of Python's code using the turtle package
	/from\s+turtle\s+import\s+/ // another strong indicator of Python's code using turtle package
];
const nonKTurtleRegexes = [];
nonKTurtleCommands.forEach(function(command) {
	nonKTurtleRegexes.push(new RegExp('(^|\\s)' + command + '(\\s|$)', 'i'));
});
const kturtleRegexes = [
/(^|\s)#/, // comment
/(^|\s)\$[a-z_]+[0-9a-z_]*\s*=/i, // common for variable assignments.  For example, "$x = "
/(^|\s)learn\s+[a-zA-Z]/, // often used in KTurtle for defining procedures
/print\s+"/, // For example, print "Hello !"
/print\s+\$[_a-zA-Z]/, // For example, print $y or print $xyz
/^kturtle-script-v/,
];

function naiveStripKTurtleComments(code) {
	code = naiveStripKTurtleComments(code);
	const lines = code.split('\n');
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const index = line.indexOf('#');
		if (index !== -1)
			lines[i] = line.substring(0, index);
	}
	return lines.join('\n');
}

function isLikelyNotKTurtle(code) {
	for (let i = 0; i < nonCommandNonKTurtleRegexes.length; i++) {
		if (nonCommandNonKTurtleRegexes[i].test(code) === true)
			return true;
	}
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
	for (let i = 0; i < kturtleRegexes.length; i++) {
		if (kturtleRegexes[i].test(code))
			return true;
	}
	return false;
};