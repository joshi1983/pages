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

/*
Quickly but incorrectly removes comments.
This will be correct enough most of the time 
to meet the requirements here.
We want it faster more than it being perfectly correct.
The incorrectness stems from string literals containing ; being treated like comments when they aren't.
*/
function roughlyRemoveWebLogoComments(code) {
	const lines = code.split('\n');
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i];
		const index = line.indexOf(';');
		if (index !== -1) {
			line = line.substring(0, index);
			lines[i] = line;
		}
	}
	return lines.join('\n');
}

export function isLikelyPythonCode(code) {
	code = roughlyRemoveWebLogoComments(code);
	const substringSignals = countSubstringSignals(code);
	return substringSignals > 1;
};