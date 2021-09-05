import { ArrayUtils } from '../../../modules/ArrayUtils.js';
import { fetchText } from '../../../modules/fetchText.js';
import { getSingleLineCommentsFromCode } from '../../../modules/parsing/python-parsing/parse-tree-conversion/getSingleLineCommentsFromCode.js';
import { asyncInit, parse } from '../../../modules/parsing/python-parsing/parse.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { pythonTurtleExampleFiles } from '../../helpers/parsing/pythonTurtleExampleFiles.js';
import { tokenToWebLogoCode } from '../../../modules/parsing/python-parsing/translation-to-weblogo/tokenToWebLogoCode.js';

const fileList = [
'classExample.py'
];
ArrayUtils.pushAll(fileList, pythonTurtleExampleFiles);

export async function testParseVariousPythonScriptsWithoutJavaScriptError(logger) {
	await asyncInit();
	fileList.forEach(function(filename) {
		async function f() {
			const url = `tests/data/python/${filename}`;
			const plogger = prefixWrapper(`Testing with URL: ${url}`, logger);
			const pythonCode = await fetchText(url);
			const tree = parse(pythonCode);
			const comments = getSingleLineCommentsFromCode(pythonCode);
			const webLogoCode = tokenToWebLogoCode(tree, comments, true);
			if (typeof webLogoCode !== 'string')
				plogger(`Expected a string from tokenToWebLogoCode but got ${webLogoCode}`);
		}
		f().catch(function(e) {
			console.error('JavaScript error thrown while parsing and translating filename='+filename);
			console.error('e=', e);
		});
	});
};