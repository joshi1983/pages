import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { fetchText } from '../../../modules/fetchText.js';
import { isLikelyKTurtle } from '../../../modules/parsing/kturtle/isLikelyKTurtle.js';
import { testInOutPairs } from '../../helpers/testInOutPairs.js';
import { ZippedExamples } from '../../../modules/file/file-load-example/ZippedExamples.js';
await ZippedExamples.asyncInit();
const examples = await fetchJson('json/scriptExamples.json');
const nonExamples = [];

export function testIsLikelyKTurtle(logger) {
	// all the examples in tests/data/logo-scripts/kturtle should be found to be likely.
	const cases = [
		{'in': '', 'out': false},
		{'in': 'right 90', 'out': false},// kturtle would use turnright.
		{'in': 'RIGHT 90', 'out': false},
		{'in': 'left 90', 'out': false},// kturtle would use turnleft.
		{'in': 'make "x 34', 'out': false},// kturtle would do something like $x = 34
		{'in': 'localmake "x 90', 'out': false},
		{'in': `animation.image 100 100 'https://i.giphy.com/media/ftAP63cOawNMdjc3Zo/giphy.webp' 0.4
print "hi`, 'out': false},
		{'in': '; this is a comment in most Logo interpreters', 'out': false},
		{'in': 'print "Looking forward to seeing you make a pie"', 'out': true},
		{'in': 'print $', 'out': false},
		{'in': 'print $x', 'out': true},
		{'in': 'print $X', 'out': true},
		{'in': 'print $_x', 'out': true},
		{'in': 'for $x = 1 to 10 {}', 'out': true}
	];
	examples.forEach(function(exampleInfo) {
		const code = ZippedExamples.getContentForFilename(exampleInfo.filename);
		if (typeof code === 'string')
			cases.push({'in': code, 'out': false});
	});
	nonExamples.forEach(function(code) {
		cases.push({'in': code, 'out': false});
	});
	testInOutPairs(cases, isLikelyKTurtle, logger);
};