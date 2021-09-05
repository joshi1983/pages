import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';

const nonRegexes = [
	/["']/i, // some characters should not appear anywhere in a 0L file.
	/[\r\n][ \t]*[a-z]{2,}[ \t]*[-]+>/i, 
	// The substitution symbols should be exactly 1 character long.
	// 2 or more characters would not be a valid 0L script.
];

const likelyRegexes = [
	/[\r\n][ \t]*[a-z][ \t]*[-]+>/i
];

// for example, axiom = a
function likelyContainsAxiom(s) {
	return /(^|[\r\n])[ \t]*axiom[ \t]*=?[ \t]*[-a-z]/i.test(s);
}

export function isLikely0L(code) {
	const webLogoStrippedCode = naiveStripComments(code);
	if (matchesARegex(nonRegexes, webLogoStrippedCode))
		return false;
	if (likelyContainsAxiom(webLogoStrippedCode))
		return matchesARegex(likelyRegexes, webLogoStrippedCode);
	return false;
};