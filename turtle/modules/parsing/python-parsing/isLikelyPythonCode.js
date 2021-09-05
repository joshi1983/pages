import { naiveStripComments } from '../naiveStripComments.js';

/*
Here are some case-sensitive substrings that are fairly unique 
to Python turtle code.
*/
const substringSignals = [
	'begin_fill(',
	'begin_poly(',
	'bgcolor(',
	'def ',
	'done()',
	'end_fill',
	'end_poly',
	'exitonclick(',
	'goto(',
	'import ',
	'import turtle',
	'import Turtle',
	'mainloop(',
	' range(',
	'Pen()',
	'Screen()',
	'.Turtle'
];
/*
'Turtle', 'turtle',
 are almost always mentioned in Python turtle code but they're also mentioned in the 
 setTurtleState and turtleState commands in WebLogo.
*/

const regexSignals = [/(^|\n)def\s+[a-zA-Z_]+\s*\(/];
const methodCallPattern = new RegExp(/\.[a-zA-Z_0-9]+\(/, 'u');
export function likelyContainsMethodCall(line) {
	return methodCallPattern.test(line);
};

const forInRangePattern = new RegExp(/for\s+[a-zA-Z_0-9]+\s+in\s+range\s*\(/, 'u');
export function likelyContainsForInRange(s) {
	return forInRangePattern.test(s);
};

function methodCallPatternHeuristic(code) {
	const lines = code.split('\n').filter(line => line.trim() !== '');
	if (lines.length === 0)
		return 0;// avoid division by 0
	let count = 0;
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (likelyContainsMethodCall(line))
			count++;
	}
	return count / lines.length;
};

function countSubstringSignals(code) {
	let result = 0;
	for (let i = 0; i < substringSignals.length; i++) {
		if (code.indexOf(substringSignals[i]) !== -1) {
			result++;
		}
	}
	result += methodCallPatternHeuristic(code);
	if (likelyContainsForInRange(code))
		result++;
	return result;
}

export function isLikelyPythonCode(code) {
	code = naiveStripComments(code);
	const substringSignals = countSubstringSignals(code);
	if (substringSignals <= 1) {
		for (const r of regexSignals) {
			if (r.test(code))
				return true;
		}
		return false;
	}
	return true;
};