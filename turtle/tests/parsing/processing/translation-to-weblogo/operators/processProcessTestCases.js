import { CachedParseTree } from
'../../../../../modules/parsing/processing/parsing/parse-tree-analysis/CachedParseTree.js';
import { CommentDumpingStringBuffer } from
'../../../../../modules/parsing/generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { flatten } from
'../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { noop } from
'../../../../../modules/noop.js';
import { parse } from
'../../../../../modules/parsing/processing/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function processProcessTestCases(cases, processFunction, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const token = findToken(caseInfo.token, tokens, plogger);
		if (token !== undefined) {
			const resultBuffer = new CommentDumpingStringBuffer([], noop);
			const tree = new CachedParseTree(parseResult.root);
			const settings = {'cachedParseTree': tree, 'tokenProcessors': new Map()};
			processFunction(token, resultBuffer, settings);
			const result = resultBuffer.toString();
			if (result !== caseInfo.out) {
				const div = document.createElement('div');
				const expected = document.createElement('span');
				expected.classList.add('in-out-value-span');
				expected.innerText = caseInfo.out;
				const actual = document.createElement('span');
				actual.classList.add('in-out-value-span');
				actual.innerText = result;
				div.innerText = 'Expected ';
				div.appendChild(expected);
				div.appendChild(document.createTextNode(' but got '));
				div.appendChild(actual);
				plogger(div);
			}
		}
	});
};