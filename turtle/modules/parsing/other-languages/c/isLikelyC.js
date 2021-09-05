import { isLikelyCPP } from
'../c++/isLikelyCPP.js';
import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const unlikelyRegexes = [
	/(^|[\r\n\(])\s*class\s+[a-zA-Z_]/,
		// common with c++, Python, Java...

	// indicators of HolyC
	/(^|[\r\n\(]|static|private|public)\s*(I16|I32|I64|I8|U0|U16|U32|U64|U8)\s*(\*)?\s*[a-zA-Z_][a-zA-Z\d_]*\s*([\[\),\=;])/ 
];

const likelyRegexes = [
	// common variable or parameter declaration
	/(^|[\r\n\(])\s*#include[ \t]*"[a-zA-Z\d_\. ]+(\/[a-zA-Z\d_\. ]+)*.h"/,
	/(^|[\r\n\(])\s*#include[ \t]*<[a-zA-Z\d_\. ]+(\/[a-zA-Z\d_\. ]+)*.h>/,	
];

export function isLikelyC(code) {
	if (matchesARegex(unlikelyRegexes, code))
		return false;

	/*
	Since c++ is essentially a superset of c,
	reusing the c++ checker seems like the best way to check
	that the code is not c++.
	
	Calling another isLikely... function in an isLikely... function is
	not usually done outside of this.  That is because usually there isn't this 
	very strong "containing" or "superset" relationship between one language and another.
	*/
	if (isLikelyCPP(code))
		return false;

	if (matchesARegex(likelyRegexes, code))
		return true;

	return false;
};