import { Command } from
'../Command.js';
import { fmsParseOptions } from './fmsParseOptions.js';
import { getDescendentsOfType } from
'../generic-parsing-utilities/getDescendentsOfType.js';
import { getProceduresMap } from
'../parse-tree-analysis/getProceduresMap.js';
import { LogoParser } from
'../LogoParser.js';
import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from
'../naiveStripComments.js';
import { ParseLogger } from
'../loggers/ParseLogger.js';
import { ParseTreeTokenType } from
'../ParseTreeTokenType.js';
import { scan } from './scan.js';
await Command.asyncInit();

const unlikelyFMSLogoRegexes = [
	/:\s*\n[^\n\.]+\.\s*(\n|$)/, // A lot of osmosian plain text has lines ending with .

	// some indicators of Python and pyturtle
	/(^|\s)import\s+turtle(\s|$)/,
	/(^|\s)from\s+turtle\s+import(\s|$)/,
	
	// indicators of Logo3D
	/#timeout(\s+|\s*\=\s*)[1-9][0-9]*/,
	/(^|\s)import\s+2grid(\s|$)/,
	/(^|[\s\[])omark\s+\w/,
	/(^|[\s\[])make\s+[a-zA-Z][a-zA-Z_0-9]*\s*\=\s*/,
	
	// indicators of the Java-based Processing language
	/(^|\s)void\s+(setup|draw)\s*\(/,
	
	// indicators of Logo Interpreter
	/(^|\s)setbgcolor\s+"([1-9][0-9]*|#[a-f0-9]{6})(\s|$)/i,
	
	// indicators of Terrapin Logo
	/(^|[\s\(\[])setbg\s+([0-9]+|"[a-z]+)(\s|$)/i,
	/(^|[\s\(\[])play\s+\[\s*(([a-z]*([1-9][0-9]*)?|[0-9]+)\s+)*([a-z]*([1-9][0-9]*)?|[0-9]+)?\s*[\[\]]/i,
	
	// indicators of QBasic
	/(^|\s)line\s+-\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)\,/i,
	/(^|\s)line\s+\(\s*[^\(\)\,]+\s*\,\s*[^\(\)\,]+\s*\)-/i,
	/(^|\s)pset\s+\(\s*[0-9a-z_]/i,
];

/*
There are lots of other commands that FMSLogo supports and WebLogo doesn't.

We also don't want commands that other versions of Logo support, though.
For example, many other versions of Logo support commands such as:
bye, find, local
*/

const distinctFMSCommands = new Set([
	'arity', 'cascade', 'clearpalette', 'copydef',
	'floodcolor', 'foreach', 'fulltext', 'getfocus',
	'machine', 'map.se', 'maximize', 'messagebox',
	'midimessage', 'minimize', 'openappend',
	'perspective', 'polyview', 'redefp',
	'reduce', 'refresh', 'scrollx',
	'scrolly', 'setlight', 'setpixel',
	'setread', 'soundoff', 'soundon',
	'startup', 'unicon', 'window', 'yesnobox'
]);

export { distinctFMSCommands };

export function isLikelyFMSLogo(code) {
	const commentlessCode = naiveStripComments(code);
	if (matchesARegex(unlikelyFMSLogoRegexes, commentlessCode))
		return false;
	
	// For performance reasons, do a naive search for then
	// distinctly or exclusively FMS commands.
	// If none are found in the code as a whole, return false.
	// This helps performance because it can often skip the 
	// slow getParseTree step.
	const codeLowerCase = code.toLowerCase();
	let aNameFound = false;
	for (const name of distinctFMSCommands) {
		if (codeLowerCase.indexOf(name) !== -1) {
			aNameFound = true;
			break;
		}
	}
	if (!aNameFound)
		return false;

	// try parsing as WebLogo.
	const parseLogger = new ParseLogger();
	let proceduresMap = undefined;
	const scannedTokens = scan(code);
	const tree = LogoParser.getParseTree(scannedTokens, parseLogger, proceduresMap, fmsParseOptions);
	if (parseLogger.hasLoggedErrors()) {
		// Being unable to parse the code means
		// the code is likely not enough like WebLogo to be FMSLogo code.
		return false;
	}
	proceduresMap = getProceduresMap(tree);
	const leafTokens = getDescendentsOfType(tree, ParseTreeTokenType.LEAF);
	if (leafTokens.some(token => distinctFMSCommands.has(token.val.toLowerCase()) &&
	!proceduresMap.has(token.val.toLowerCase()))) {
		return true;
	}
	return false;
};