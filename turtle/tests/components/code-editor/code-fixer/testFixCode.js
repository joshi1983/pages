import { fixCode } from '../../../../modules/components/code-editor/code-fixer/fixCode.js';
import { getProceduresMap } from '../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { getStringComparisonDetails } from '../../../helpers/getStringComparisonDetails.js';
import { LogoParser } from '../../../../modules/parsing/LogoParser.js';
import { noop } from '../../../../modules/noop.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';
import { TestParseLogger } from '../../../helpers/TestParseLogger.js';

export function testFixCode(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'pc 1', 'out': 'setPenColor 1'},
		{'in': 'fd 100', 'out': 'fd 100'},
		{'in': 'fd 100;\t\t move \tforward', 'out': 'fd 100;\t\t move \tforward'},
		{'in': 'fd "', 'out': 'fd "'},
		{'in': 'fd "4', 'out': 'fd 4'},
		{'in': 'fd "3.14', 'out': 'fd 3.14'},
		{'in': 'for [x 1 5] [print "hello]', 'out': 'for ["x 1 5] [print "hello]'},
		{'in': 'for [x 1 5 0.5] [print "hello]', 'out': 'for ["x 1 5 0.5] [print "hello]'},
		{'in': 'make "x 0 while [:x < 1] [print "hello make "x :x + 1]', 'out': 'make "x 0 while :x < 1 [print "hello make "x :x + 1]'},
		{'in': 'setpensize [2 2]', 'out': 'setpensize 2 '},
		{'in': 'setpenwidth 5', 'out': 'setPenSize 5'},
		{'in': 'to p\nHelloWorld\nend', 'out': 'to p\nHelloWorld\nend'},
		{'in': 'to p\nprint [hello world]\nend', 'out': 'to p\nprint ["hello "world]\nend'},
		{'in': 'to animation.setup :x :y\noutput 10\nend', 'out': 'to animation.setup  \noutput 10\nend'},
		{'in': 'to animation.setup\noutput animation.time\nend', 'out': 'to animation.setup\noutput 0\nend'},
		{'in': 'print "x', 'out': 'print "x'},
		{'in': 'make :x 5', 'out': 'make "x 5'},
		{'in': 'make x 5', 'out': 'make "x 5'},
		{'in': 'make "counter 1 make “counter :counter+1', 'out': 'make "counter 1 make "counter :counter+1'},
		{'in': 'Define "box [ [size] [ repeat 4 [forward :size right 90] ] ]', 'out': 'to box  :size  repeat 4 [forward :size right 90]  end'},
		{'in': 'setscreencolor red', 'out': 'setscreencolor "red'},
		{'in': 'to red\nprint "red\nend', 'out': 'to red\nprint "red\nend'}, // procedure names shouldn't get quoted even if they match colour names.
		{'in': 'print [1,2]', 'out': 'print [1 2]'},
		{'in': 'print [1,]', 'out': 'print [1]'},
		{'in': 'make "x 4\nprint [1,:x]', 'out': 'make "x 4\nprint [1 :x]'},
		{'in': 'make "x 4\nprint : x', 'out': 'make "x 4\nprint  :x'},
		{'in': 'print " x', 'out': 'print  "x'},
		{'in': 'print " ^&_@', 'out': 'print  "^&_@'},
		{'in': 'print : ^&_@', 'out': 'print : ^&_@'}, // no change when removing spaces would lead to an invalid variable read anyway.
		{'in': 'fd  :\nx', 'out': 'fd  \n:x'},
		{'in': 'setPenColor red', 'out': 'setPenColor "red'},
		{'in': 'print [1,2,3]', 'out': 'print [1 2 3]'},
		{'in': 'make " x', 'out': 'make  "x'},
		{'in': 'penUp', 'out': ''}, // the penUp wasn't used so it should be removed.

		{'in': 'repeat 3 [\nmake "p []\nsetItem 2 "p -item 2 "h]',
		'out': 'repeat 3 [\nmake "p []\nsetItem 2 "p -item 2 "h]'},
		// invalid code but we want to know that no JavaScript error is thrown.
		{'in': 'setPenColor red', 'out': 'setPenColor "red'},
		{'in': 'setPenColor #333', 'out': 'setPenColor "#333'},
		{'in': 'setPenColor #112233', 'out': 'setPenColor "#112233'},
		{'in': 'to red\nend', 'out': 'to red\nend'},// no change
		{'in': 'setPenColor red', 'out': 'setPenColor "red'},
		{'in': 'print red', 'out': 'print "red'},
		{'in': 'to p "x\nend', 'out': 'to p :x\nend', 'ignoreParseErrors': true},
		{'in': 'for [x 0 [count [1 2 3]]] [print :x]', 'out': 'for ["x 0 (count [1 2 3])] [print :x]'}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		let parseLogger;
		if (caseInfo.ignoreParseErrors !== true)
			parseLogger = new TestParseLogger(plogger, caseInfo.in);
		else
			parseLogger = new TestParseLogger(noop, caseInfo.in);
		const tree = LogoParser.getParseTree(caseInfo.in, parseLogger);
		parseLogger.reset();
		const proceduresMap = getProceduresMap(tree);
		const result = fixCode(caseInfo.in, parseLogger, proceduresMap);
		if (result !== caseInfo.out) {
			const comparisonDetails = getStringComparisonDetails(caseInfo.out, result);
			plogger(`Expected "${caseInfo.out}" but got "${result}".  String comparison details: ${comparisonDetails}`);
		}
	});
};