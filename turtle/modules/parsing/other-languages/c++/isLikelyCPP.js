import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	// indicators of HolyC
	/(^|[\r\n\(]|static|private|public)\s*(I16|I32|I64|I8|U0|U16|U32|U64|U8)\s*(\*)?\s*[a-zA-Z_][a-zA-Z\d_]*\s*([\[\),\=;])/ 
];

const likelyRegexes = [
	/(^|[\r\n\(])\s*#include\s*<\s*(cmath|cstdint|cstdio|cstdlib|iostream|vector)\s*>/,
	/(^|[\r\n\(])\s*#include\s*"[a-zA-Z\d_\. ]+(\/[a-zA-Z\d_\. ]+)*.h(\+\+|pp)"\s*/,
	/(^|[\r\n\(])\s*#include[ \t]*<[a-zA-Z\d_\. ]+(\/[a-zA-Z\d_\. ]+)*.hpp>/,	

	/(^|[\r\n\(])\s*using[ \t]+namespace\s+[a-zA-Z_]/,
	/(^|[\r\n\(])\s*(std\s*::\s*)?cout\s*<</,
	/(^|[\r\n\(])\s*(std\s*::\s*)?cin\s*>>/,
	/(^|[\r\n\(])\s*enum\s+class\s+[a-zA-Z_]/,
];

export function isLikelyCPP(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	return false;
};