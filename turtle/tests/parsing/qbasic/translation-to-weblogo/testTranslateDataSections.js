import { CommentDumpingStringBuffer } from
'../../../../modules/parsing/generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { parse } from
'../../../../modules/parsing/qbasic/parse.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { processCommentToken } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/type-processors/processCommentToken.js';
import { qbasicExamples } from
'../../../helpers/parsing/qbasicExamples.js';
import { translateDataSections } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translateDataSections.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

function runWithAllExamples(logger) {
	qbasicExamples.forEach(function(content, index) {
		const plogger = prefixWrapper(`Case ${index}, content = ${content}`, logger);
		const parseResult = parse(content);
		const options = {'identifierRenameMap': new Map()};
		const comments = parseResult.comments;
		const result = new CommentDumpingStringBuffer(comments, processCommentToken);
		try {
			translateDataSections(parseResult.root, result, options);
		}
		catch (e) {
			console.error(e);
			plogger(`Failed to translateDataSections.  e=${exceptionToString(e)}`);
		}
	});
}

export function testTranslateDataSections(logger) {
	wrapAndCall([
		runWithAllExamples
	], logger);
};