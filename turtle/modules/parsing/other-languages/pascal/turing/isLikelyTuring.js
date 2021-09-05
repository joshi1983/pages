import { countRegexMatches } from
'../../../../components/code-editor/code-fixer/fixers/helpers/countRegexMatches.js';
import { isIdentifier } from
'./scanning/isIdentifier.js';
import { matchesARegex } from
'../../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n])\s*#[ \t]/i, // a comment from some programming languages like Python
		// Turing has directives like #if, #else... so we want to look for 
		// a space immediately after the # .
	
	/(^|[\r\n])\s*else[ \t]+if[ \t]+/i,
		// Turing would use elsif instead of else if.

	/(^|[\r\n])\s*endif[ \t]+/i,
		// Turing would use end if with a whitespace between the end and if.
		// This should filter out some non-Turing languages like Basic and Sonic WebTurtle.

	/(^|[\r\n])\s*MODULE[ \t]+[a-z_][a-z_\d]*[ \t]*;/i,
		// to avoid falsely detecting some Modula-2 code as Turing.
		// Modula-2 module statements are ended with semicolons.
		// Turing module statements don't have the semicolon.

	/(^|[\r\n])\s*print[ \t]+[a-z_\d:]/i
		// Turing uses 'put' instead of 'print'.
];
const likelyRegexes = [
	/[\r\n]\s*end[ \t]+loop\s*([\r\n]|$)/i,
	/(^|[\r\n])\s*for[ \t]+[a-z_][a-z_\d]*\s*:\s*\d+\s*../i
];
const moduleStartRegex = /(^|[\r\n])\s*module\s+[a-z_][a-z_\d]*\s/i;
const weakLikelyRegexes = [
	/(^|[\r\n])\s*%/,
	/(^|[\r\n])\s*exit[ \t]+when[ \t]+[a-z_]/i,
	/(^|[\r\n])\s*put[ \t]+"[^"\r\n]*"[ \t]*(..|[,\r\n]|$)/i,
	/(^|[\r\n])[ \t]*setscreen[ \t]*\([ \t]*"/i,
	/(^|[\r\n])[ \t]*var[ \t]+[a-z_][a-z_\d]*[ \t]*:[ \t]*(float|int|String)[ \t]*/i,
	moduleStartRegex
		// the moduleStartRegex will match some Modula-2 code.
];

// "naive" because this ignores the fact that % won't mark comments
// when in a string literal.
// We accept that drawback for sake of keeping this code simple and performant.
function naiveStripTuringComments(code) {
	const lines = [];
	for (let line of code.split('\n')) {
		const index = line.indexOf('%');
		if (index !== -1)
			line = line.substring(0, index);

		lines.push(line);
	}
	return lines.join('\n');
}

export function hasUnlikelyCombinations(code) {
	if (/(^|[\r\n])\s*if\s/i.test(code)) {
		// Turing if-statements always include "then".
		if (!(/\sthen\s/i.test(code)))
			return true;

		// Turing if-statements always have 'end if'.
		if (!(/\send[ \t]+if(\s|$)/i.test(code)))
			return true;
	}
	if (/(^|[\r\n])\s*loop\s/i.test(code)) {
		// Turing loop-statements always have 'end loop'.
		if (!(/\send[ \t]+loop(\s|$)/i.test(code)))
			return true;
	}
	if (/(^|[\r\n])\s*for\s/i.test(code)) {
		// Turing for-statements always have 'end for'.
		if (!(/\send[ \t]+for(\s|$)/i.test(code)))
			return true;
	}
	let index = code.search(moduleStartRegex);
	if (index !== -1) {
		// Turing modules end with the name of the module.
		// for example:
		// module x
		// end x
		// Let's check that the module name is found in the corresponding end module statement.
		let moduleNameSnippet = code.substring(index, 200).trim().toLowerCase();
		// 200 is large enough that it should include any reasonably large module name and surrounding whitespaces.
		// For performance reasons, we just want to cut the string down to a reasonable size.
		if (moduleNameSnippet.startsWith('module'))
			moduleNameSnippet = moduleNameSnippet.substring('module'.length).trim();

		index = moduleNameSnippet.search(/\s/);
		if (index !== -1)
			moduleNameSnippet = moduleNameSnippet.substring(0, index);

		const moduleName = moduleNameSnippet;
		if (!isIdentifier(moduleName))
			return true; // the module name should be a valid identifier in Turing.
			// If the module name is invalid, the pattern combination is bad.

		// do any of the matches match the module name?
		const reg = /\send[ \t]+[a-z_][a-z_\d]*/ig;
		let result;
		let found = false;
		while ((result = reg.exec(code)) !== null) {
			result = result[0];
			const parts = result.trim().split(/\s+/);
			const name = parts[parts.length - 1].toLowerCase();
			if (name === moduleName) {
				found = true;
				break;
			}
		}
		if (!found)
			return true; // module started but the end didn't include a matching module name.
	}
	return false;
};

export function isLikelyTuring(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (hasUnlikelyCombinations(code))
		return false;

	const turingTrimmedCode = naiveStripTuringComments(code);
	if (matchesARegex(likelyRegexes, turingTrimmedCode))
		return true;

	if (countRegexMatches(code, weakLikelyRegexes) >= 2)
		return true;

	return false;
};