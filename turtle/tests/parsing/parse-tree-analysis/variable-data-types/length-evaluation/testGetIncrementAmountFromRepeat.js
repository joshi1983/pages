import { getIncrementAmountFromRepeat } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/length-evaluation/interpretCommand.js';
import { LogoParser } from
'../../../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../../../modules/parsing/loggers/ParseLogger.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedGetIncrementAmountFromRepeat(code) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	const repeat = tree.children[0];
	const tokenValueMap = new Map([
		['x', []]
	]);
	return getIncrementAmountFromRepeat(repeat, 'x', tokenValueMap);
}

export function testGetIncrementAmountFromRepeat(logger) {
	const cases = [
		{'in': 'repeat 2 [ queue "x 3]', 'out': 2},
		{'in': 'repeat 3 [ queue "x 3]', 'out': 3},
		{'in': 'repeat 12 [ queue "x 3]', 'out': 12},
		{'in': 'repeat 2 [ queue2 "x 3]', 'out': 2},
		{'in': 'repeat 3 [ queue2 "x 3]', 'out': 3},
		{'in': 'repeat 12 [ queue2 "x 3]', 'out': 12},
		{'in': 'repeat 12 [ queue2 "x 3 queue2 "x "hi ]', 'out': 24},
		{'in': 'repeat 10 [ ifelse randomRatio < 0.4 [ queue2 "x 1 ] [ queue2 "x 3 ] ]', 'out': 10},
	];
	testInOutPairs(cases, wrappedGetIncrementAmountFromRepeat, logger);
};