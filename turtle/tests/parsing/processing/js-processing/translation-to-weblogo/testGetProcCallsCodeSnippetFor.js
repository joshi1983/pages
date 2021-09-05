import { getProcCallsCodeSnippetFor } from
'../../../../../modules/parsing/processing/js-processing/translation-to-weblogo/getProcCallsCodeSnippetFor.js';
import { LogoParser } from
'../../../../../modules/parsing/LogoParser.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { TestParseLogger } from
'../../../../helpers/TestParseLogger.js';

function wrappedGetProcCallsCodeSnippetFor(logger) {
	return function(code) {
		const parseLogger = new TestParseLogger(logger, code);
		const tree = LogoParser.getParseTree(code, parseLogger);
		if (tree !== undefined) {
			return getProcCallsCodeSnippetFor(tree);
		}
	};
}

export function testGetProcCallsCodeSnippetFor(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': 'to p\nend', 'out': ''},
		{'in': 'to SETUP :x\nend', 'out': ''},
		{'in': 'to setup\nend setup', 'out': ''}, // don't call setup more than once.
		{'in': 'to SETUP\nend', 'out': 'setup'},
		{'in': 'to DRAW\nend', 'out': 'draw'},
		{'in': 'to setup\nend', 'out': 'setup'},
		{'in': 'to draw\nend', 'out': 'draw'},
		{'in': 'to draw\nend\nto setup\nend', 'out': 'setup\ndraw'},
	];
	testInOutPairs(cases, wrappedGetProcCallsCodeSnippetFor(logger), logger);
};