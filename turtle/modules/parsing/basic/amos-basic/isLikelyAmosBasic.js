import { matchesARegex } from
'../../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { naiveStripComments } from '../../naiveStripComments.js';
import { naiveStripQBasicComments } from '../qbasic/naiveStripQBasicComments.js';

const unlikelyExpressions = [];

const likelyExpressions = [
	/(^|[\r\n])\s*Add[ \t]+[a-zA-Z]+[ \t]*,[ \t]*\d+\s+/, // For example, Add T,1
	/(^|[\r\n])\s*Double[ \t]+Buffer[ \t]*([\r\n:]|$)/, // For example, Double Buffer
	/(^|[\r\n])\s*Flash[ \t]+Off[ \t]*([\r\n:]|$)/, // For example, Flash Off
	/(^|[\r\n])\s*(POTGO|POTGOR)[ \t]*=[ \t]*\$[a-fA-F\d]+([\r\n:]|$)/, // setting some hardware registers to hexadecimal literal.  For example, POTGO=$DFF034
	/(^|[\r\n])\s*Screen[ \t]+(Display|Hide|Open)[ \t]+\d+[ \t]*([\r\n:,]|$)/, // For example, Screen Open 0,320,200,8,0
];

export function isLikelyAmosBasic(code) {
	const trimmedCode = naiveStripComments(code);
	if (matchesARegex(unlikelyExpressions, naiveStripQBasicComments(trimmedCode)))
		return false;
	if (matchesARegex(likelyExpressions, code))
		return true;
	return false;
};