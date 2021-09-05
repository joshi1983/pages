import { matchesARegex } from '../helpers/matchesARegex.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';

const regexIndicators = [
/^#timeout\=/,
/[\r\n]\#timeout\=/,
/(^|\s)omark\s[a-zA-Z]/,
/^mark\s[a-zA-Z]/,
/[\r\n]mark\s[a-zA-Z]/,
/(^|[\r\n])\s*make\s+[a-zA-Z]+\s*=\s*(\d+|[a-zA-Z][a-zA-Z_\d]*)/,
/^rpt\s+\d/, // rpt is a pretty distinct way that Logo3D code usually abbreviates the repeat command.
/\srpt\s+\d/,
/^sbgc\s/, // sbgc is another pretty unique command name to Logo3D.
/\ssbgc\s/,
/(^|\n)to\s+\d[\da-zA-Z_]*\s/, // Logo3D allows procedure names to start with digits.  For example, "to 6".
];
// Some commands not supported by Logo 3D which commonly used in other versions of Logo
const antiIndicatorCommands = [
'backward', 'back', "forward", 'jumpforward', 'jumpin', 'jumpout', 'right', 'left'
];
const charsAroundCommandCall = ' \n\r\t[]()'.split('');
const charactersBeforeCommandCall = new Set([
undefined,
...charsAroundCommandCall
]);
const charactersAfterCommandCall = new Set([
undefined,
...charsAroundCommandCall
]);

function isValidCharBeforeCommand(ch) {
	if (charactersBeforeCommandCall.has(ch))
		return true;
	return false;
}

function isValidCharAfterCommand(ch) {
	if (charactersAfterCommandCall.has(ch))
		return true;
	return false;
}

function containsAntiindicatorCommands(code) {
	for (let i = 0; i < antiIndicatorCommands.length; i++) {
		const cmd = antiIndicatorCommands[i];
		const index = code.indexOf(cmd);
		if (index !== -1) {
			if (isValidCharBeforeCommand(code.charAt(index - 1))&&
			isValidCharAfterCommand(code.charAt(index + cmd.length)))
				return true;
		}
	}
	return false;
}

export function isLikelyLogo3D(code) {
	code = naiveStripComments(code.toLowerCase());
	if (containsAntiindicatorCommands(code))
		return false;
	if (matchesARegex(regexIndicators, code))
		return true;
	return false;
};