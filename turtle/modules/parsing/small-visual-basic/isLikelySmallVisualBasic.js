import { matchesARegex } from
'../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments as webLogoCodeNaiveStripComments } from
'../naiveStripComments.js';

const unlikelyExpressions = [
/\nimport\s/, // Python import statement
/\n;/, // comment in most Logo variants
];
const likelyRegexes = [
/(^|\s)Turtle\s*\.\s*(Angle|CreateFigure|DirectTurn|FillFigure|Hide|MoveTo|PenDown|PenUp|Show|Speed|TurnRight|UseAnimation|Width)/,
/(^|\s)GW\s*\.\s*(BackgroundColor|FullScreen|Height|Width)/,
/(^|\s)GraphicsWindow\s*\.\s*(Left|SetPixel|Top)/,
];

function naiveStripComments(code) {
	const lines = code.split('\n');
	return lines.map(line => {
		const index = line.indexOf('\'');
		if (index === -1)
			return line;
		return line.substring(0, index);
	}).join('\n').trim();
}

export function isLikelySmallVisualBasic(code) {
	const code1 = naiveStripComments(webLogoCodeNaiveStripComments(code));
	if (matchesARegex(unlikelyExpressions, code1))
		return false;
	const code2 = naiveStripComments(code);
	if (matchesARegex(likelyRegexes, code2))
		return true;
	return false;
};