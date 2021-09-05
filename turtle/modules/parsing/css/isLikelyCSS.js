import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// some indicators of WebLogo and other Logo dialects:
	/(^|\s)(back|backward|fd|forward|setpensize|setpenwidth)\s+\d+/i,
	/(^|\s)repeat\s+\d+\s*\[/i,

	// indicators of JavaScript:
	/(^|\s)function\s+/,

	// indicators of Python
	/(^|\s)from\s+turtle\s+import(\s|^)/,
	/(^|\s)import\s+turtle(\s|^)/
];

const likelyRegexes = [
	/(^|\s)@media\s*(\(|only|print|screen)/, // media section
	/(^|[\s|+~])(a|article|body|div|footer|h1|h2|h3|h4|h5|header|html|ol|p|section|span|strong|table|td|tr|ul)\s*\{/i, // tag-name selector
	/(^|[\s|+~a-z])\[[^\[\]\{\}]+\]\s*\{/i, // attribute selector 
	/(^|\s)[\.#][a-z_][a-z_\d]*\s*\{/i, // id-selector or class name selector
];

export function isLikelyCSS(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;
	if (matchesARegex(likelyRegexes, code))
		return true;
	return false;
};