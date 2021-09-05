import { getVariableReadsOfConcernForRepeat } from
'../../../../../../modules/parsing/processing/translation-to-weblogo/type-processors/for-loops/getVariableReadsOfConcernForRepeat.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetVariableReadsOfConcernForRepeat(logger) {
	const cases = [
		// not a variable read.
		{'code': 'i = 2', 'size': 0},

		{'code': 'print(p.i)', 'size': 0},
		{'code': 'p.i = 2', 'size': 0},
		{'code': 'p.x.i = 2', 'size': 0},

		// We should not include reads of the i variable within a
		// for-loop that declares it.
		{'code': 'for (int i=0;i<20;i++) {}', 'size': 0},
		{'code': 'for (int i=0;i<20;i++) {f(i)}', 'size': 0},

		{'code': 'for (int x=0;x<20;x++) {}', 'size': 0},

		// If the for-loop declares something other than i, its descendents can still have concerning i variable reads.
		{'code': 'for (int x=0;x<20;x++) {f(i)}', 'size': 1},

		// Weird case because i would be a number but we want to handle a method call like this anyway.
		{'code': 'i()', 'size': 0},
		
		{'code': 'print(i)', 'size': 1},
		{'code': 'f(i,i)', 'size': 2},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse('for (int i=0;i<10;i++) { ' + caseInfo.code + ' }');
		const children = parseResult.root.children;
		if (children.length !== 1) {
			plogger(`1 child expected but found ${children.length}`);
			return;
		}
		const forToken = children[0];
		if (forToken.type !== ParseTreeTokenType.FOR) {
			plogger(`Expected type FOR but found ${ParseTreeTokenType.getNameFor(forToken.type)}`);
			return;
		}
		const codeBlock = forToken.children[1];
		if (codeBlock.type !== ParseTreeTokenType.CODE_BLOCK) {
			plogger(`The 1 child expected to be a CODE_BLOCK but found type ${ParseTreeTokenType.getNameFor(codeBlock.type)}`);
		}
		else {
			const result = getVariableReadsOfConcernForRepeat(codeBlock, 'i');
			if (result.size !== caseInfo.size)
				plogger(`Expected result size to be ${caseInfo.size} but found ${result.size}`);
		}
	});
};