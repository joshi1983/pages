import { bbcBasicExamples } from
'../../../../helpers/parsing/basic/bbcBasicExamples.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateBBCBasicToWebLogo } from
'../../../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/translateBBCBasicToWebLogo.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

function translateVariousExamples(logger) {
	bbcBasicExamples.forEach(function(bbcCode, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${bbcCode}`, logger);
		const result = translateBBCBasicToWebLogo(bbcCode);
		if (typeof result !== 'string')
			plogger(`Expected a string but found ${result}`);
	});
}

function translateWithExpectedSpecificOutputs(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'REPEAT UNTIL INKEY>2', 'out': ''},
		{'in': 'print "hi"', 'out': 'print "hi'},
		{'in': 'mode 5', 'out': ''},
		{'in': 'ON ERROR : ON ERROR OFF : PRINT REPORT$; " at line ";ERL : END', 'out': ''},
		{'in': 'REM comment', 'out': '; comment'},
		{'in': 'REM comment1\nREM comment2', 'out': '; comment1 \n; comment2'},
		{'in': 'move 10,20', 'out': 'jumpTo [ 10 20 ]'},
		{'in': 'let x =2', 'out': 'make "x 2'},
		{'in': `20 MOVE 100,100
30 DRAW 200,200`,
		'outContains': `jumpTo [ 100 100 ]
setPos [ 200 200 ]`},
		{'in': 'MOVE x,y', 'out': 'jumpTo [ :x :y ]'},
		{'in': `A=false
A OR= true
PRINT A`, 'out': `make "A false
make "A or :A true
print :A`},
	];
	testInOutPairs(cases, translateBBCBasicToWebLogo, logger);
}

export function testTranslateBBCBasicToWebLogo(logger) {
	wrapAndCall([
		translateWithExpectedSpecificOutputs,
		translateVariousExamples
	], logger);
};