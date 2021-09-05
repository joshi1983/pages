import { getSingleLineCommentsFromCode } from '../../../../modules/parsing/python-parsing/parse-tree-conversion/getSingleLineCommentsFromCode.js';
import { asyncInit } from '../../../../modules/parsing/python-parsing/parse.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export async function testGetSingleLineCommentsFromCode(logger) {
	await asyncInit();
	const cases = [
		{'in': '', 'numComments': 0},
		{'in': '#hi', 'numComments': 1},
		{'in': '# hi', 'numComments': 1},
		{'in': '# hi\n# yo yo', 'numComments': 2},
		{'in': ' # hi\n', 'numComments': 1},
		{'in': 'print("1") # hi', 'numComments': 1},
		{'in': 'print("1")\n# hi', 'numComments': 1},
		{'in': 'print("#")', 'numComments': 0},// This # doesn't indicate start of comment because it is in a string literal.
		{'in': 'print("#")\n# hi', 'numComments': 1},// This # doesn't indicate start of comment because it is in a string literal.
		{'in': '""" long string """', 'numComments': 0}, // not a single line comment
		{'in': '\'\'\' also long string \'\'\'', 'numComments': 0},
		{'in': '""" long\nstring on more than one line """', 'numComments': 0},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, in: ${caseInfo.in}`, logger);
		const result = getSingleLineCommentsFromCode(caseInfo.in);
		if (result.length !== caseInfo.numComments)
			plogger(`Expected number of comments to be ${caseInfo.numComments} but got ${result.length}`);
	});
};