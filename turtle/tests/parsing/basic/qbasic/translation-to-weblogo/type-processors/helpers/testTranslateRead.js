import { CommentDumpingStringBuffer } from
'../../../../../../../modules/parsing/generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { parseRootToOptionsMock } from
'../../parseRootToOptionsMock.js';
import { noop } from
'../../../../../../../modules/noop.js';
import { parse } from
'../../../../../../../modules/parsing/basic/qbasic/parse.js';
import { prefixWrapper } from
'../../../../../../helpers/prefixWrapper.js';
import { translateRead } from
'../../../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/type-processors/helpers/translateRead.js';

export function testTranslateRead(logger) {
	const cases = [
		{'code': '"hi"', 'out': '"hi'},
		{'code': 'x', 'out': ':x'},
		{'code': 'dim a\na(1)', 'out': '( item 2 :a )'},
		{'code': 'a.x', 'out': 'getProperty "a "x'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const children = parseResult.root.children;
		if (children.length === 0) {
			plogger(`Expected parseResult.root.children.length to be at least 1 but found 0 children.`);
			return;
		}
		const token = children[children.length - 1];
		const comments = [];
		const resultBuffer = new CommentDumpingStringBuffer(comments, noop);
		const options = parseRootToOptionsMock(parseResult.root);
		translateRead(token, resultBuffer, options);
		const out = resultBuffer.toString().trim();
		if (out !== caseInfo.out)
			plogger(`Expected out to be ${caseInfo.out} but found ${out}`);
	});
};