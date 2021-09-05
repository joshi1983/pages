import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { naiveStripQBasicComments } from '../qbasic/naiveStripQBasicComments.js';

const unlikelyExpressions = [

// indicators of Small Visual Basic
/(\s|^)(GraphicsWindow|Turtle)\s*\.\s*[a-zA-Z_]+/,
/(\s|^)End(Function|If|Sub|While)(\s|$)/,

// indicators of QBasic
/(^|\s)(mid$)\("/i,
/(^|\s)line[ \t]+input[ \t]+"/i,
/(^|\s)locate[ \t]+[1-9][0-9]*[ \t]*\,[ \t]*([a-z][a-z_]*|[1-9][0-9]*)/i,
];

const likelyExpressions = [
/([\n:]|^)([ \t]*\d+)?[ \t]*!/i,
// starting a line with an ANSI BASIC style Comment

/([\s:]|^)(clear|end)[ \t]*!/i,
/([\s:]|^)PLOT[ \t]+LINES[ \t]*:/i,
/([\s:]|^)SET[ \t]+LINE[ \t]+COLOR[ \t]+/i,
/([\s:]|^)SET[ \t]+WINDOW[ \t]+\d+[ \t]*,[ \t]*\d+[ \t]*,[ \t]*\d+[ \t]*,[ \t]*\d+/i,

// indicators of DECIMAL BASIC
// We're considering DECIMAL BASIC to be a version of ANSI BASIC.
/(\n|^)[ \t]*(\d+[ \t]+)?external[ \t]+picture[ \t]+[a-z_]/i,
/(\n|^)[ \t]*(\d+[ \t]+)?end[ \t]+picture(\s|$)/i,
/(\n|^)[ \t]*(\d+[ \t]+)?option[ \t]+angle[ \t]+degrees(\s|$)/i
];

export function isLikelyAnsiBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, naiveStripQBasicComments(trimmedCode)))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	return false;
};