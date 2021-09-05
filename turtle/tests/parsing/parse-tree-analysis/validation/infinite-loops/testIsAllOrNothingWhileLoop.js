import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { isAllOrNothingWhileLoop } from
'../../../../../modules/parsing/parse-tree-analysis/validation/infinite-loops/isAllOrNothingWhileLoop.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export function testIsAllOrNothingWhileLoop(logger) {
	const cases = [
		{'code': 'make "x true\nwhile :x [ make "x false ]', 'out': false},
		{'code': 'to p\nlocalmake "x true\nwhile :x [ localmake "x false ]\nend', 'out': false},
		{'code': 'to p\nlocalmake "x true\nwhile :x [ stop ]\nend', 'out': false},
		{'code': 'to p\nlocalmake "x true\nwhile :x [ output 4 ]\nend', 'out': false},
		{'code': 'to p\nlocalmake "x 1 < random 3\nwhile :x [ stop ]\nend', 'out': false},
		{'code': 'to p\nlocalmake "x 1 < random 3\nwhile :x [ output 4 ]\nend', 'out': false},
		{'code': 'while true [ ]', 'out': false},
		{'code': 'while false [ ]', 'out': false},
		{'code': 'while penSize < 3 [ setPenSize 10 ]', 'out': false},
		{'code': 'while penSize < 3 [ setPenSize penSize + 1 ]', 'out': false},
		{'code': 'while xCor < 3 [ jumpRight 100 ]', 'out': false},
		{'code': 'while yCor < 3 [ jumpForward 100 ]', 'out': false},
		{'code': 'to p\nmake "x false\nend\nmake "x 2 < random 4\nwhile :x [ p ]', 'out': false},
		{'code': 'make "x [true false]\nwhile pop "x [ ]', 'out': false},
		{'code': 'while :x [ ]', 'out': true},
		{'code': 'make "x 1 < random 3\nwhile :x [make "x false]', 'out': false},
		{'code': 'make "x 1 < random 3\nwhile :x []', 'out': true},
		{'code': 'make "x [1 2 3]\nwhile empty? :x [ dequeue "x ]', 'out': false},
		{'code': 'make "x [1 2 3]\nwhile not empty? :x [ dequeue "x ]', 'out': false},
		{'code': 'make "x [1 2 3]\nwhile not empty? :x [ dequeue2 "x ]', 'out': false},
		{'code': 'make "x [1 2 3]\nwhile not empty? :x [ pop "x ]', 'out': false},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const whileTokens = cachedParseTree.getCommandCallsByName('while');
		if (whileTokens.length !== 1)
			plogger(`Expected 1 while token but found ${whileTokens.length}`);
		else {
			const whileToken = whileTokens[0];
			const result = isAllOrNothingWhileLoop(whileToken, cachedParseTree);
			if (result !== caseInfo.out) {
				plogger(`Expected ${caseInfo.out} but found ${result}`);
			}
		}
	});
};