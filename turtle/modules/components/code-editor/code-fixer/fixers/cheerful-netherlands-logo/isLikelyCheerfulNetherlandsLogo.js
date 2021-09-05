import { matchesARegex } from '../helpers/matchesARegex.js';
import { naiveStripComments } from
'../../../../../parsing/naiveStripComments.js';

const unlikelyPatterns = [
	/^\s*[;#]/, // used for Python
	/^\s*\/\*/, // used for Java, JavaScript...
	/^\s*\/\//, // used for Java, JavaScript...
	
	// some patterns for BASIC
	/(^|\s)goto\s+[1-9][0-9]*\s/i,
	/(^|\s)screen\s+[1-9][0-9]*\s/i,
	/(^|\s)next\s+/i,
];
// various commands used in WebLogo and many other versions of Logo that are
// using English command names.
['back', 'backward', 'for', 'forward', 'fd', 'penup', 'penDown', 'print',
'repeat', 'setPenSize', 'while'].forEach(function(key) {
	unlikelyPatterns.push(new RegExp(`/(^|\s)${key}\s+/`, 'i'));
});
const likelyPatterns = [
	/(^|\s)achtergrond\s+(\d+|\$[a-z_][a-z0-9_]*)\s+/i,
	/(^|\s)(beginvorm|doe|eindvorm|turtleuit)(\n|$)/i,
	/(^|\s)HERHAAL\s+(\d+|\$[a-z_][a-z0-9_]*)\s*(\n|$)/i,
	/(^|\s)leer\s+[a-z_][a-z0-9_]*\s*[\$\n]/i,
	/(^|\s)(pendikte|rechts|richting|vooruit)\s+(\d+|\$[a-z_][a-z0-9_]*)\s*(\n|$)/i,
	/(^|\s)schrijf\s+"/i,
];

export function isLikelyCheerfulNetherlandsLogo(code) {
	code = naiveStripComments(code);
	if (matchesARegex(unlikelyPatterns, code)) {
		return false;
	}
	if (matchesARegex(likelyPatterns, code))
		return true;
	return false;
}