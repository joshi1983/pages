import { CachedParseTree } from '../parse-tree-analysis/CachedParseTree.js';
import { CommentDumpingStringBuffer } from '../../generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fetchText } from '../../../fetchText.js';
import { genericIsDependingOnFunction } from '../parse-tree-analysis/procedure-dependencies/genericIsDependingOnFunction.js';
import { isDependingOnPyCircle } from '../parse-tree-analysis/procedure-dependencies/isDependingOnPyCircle.js';
import { isDependingOnColorMode } from '../parse-tree-analysis/procedure-dependencies/isDependingOnColorMode.js';
import { isDependingOnHeadingMode } from '../parse-tree-analysis/procedure-dependencies/isDependingOnHeadingMode.js';
import { isDependingOnIDiv } from '../parse-tree-analysis/procedure-dependencies/isDependingOnIDiv.js';
import { isDependingOnRoundCorners } from '../parse-tree-analysis/procedure-dependencies/isDependingOnRoundCorners.js';
import { processSingleLineCommentToken } from './type-processors/processSingleLineCommentToken.js';
import { processToken } from './processToken.js';
import { refactor } from '../refactoring/refactor.js';
import { removeUnusedProceduresFromCode } from
'../../../components/code-editor/code-fixer/fixers/code-removal/removeUnusedProceduresFromCode.js';

let contents = [];
export const filenames = [
	['colorMode.lgo', isDependingOnColorMode],
	['headingMode.lgo', isDependingOnHeadingMode],
	['pyCircle.lgo', isDependingOnPyCircle],
	['pyDot.lgo', genericIsDependingOnFunction('PyDot', 'dot')],
	['pyHome.lgo', genericIsDependingOnFunction('PyHome', 'home')],
	['pyIDiv.lgo', isDependingOnIDiv],
	['pyHSVToRGB.lgo', genericIsDependingOnFunction('PyHSVToRGB', 'hsv_to_rgb')],
	['pyRGBToHSV.lgo', genericIsDependingOnFunction('PyRGBToHSV', 'rgb_to_hsv')],
	['roundCorners.lgo', isDependingOnRoundCorners]
];

async function init() {
	for (let i = 0; i < filenames.length; i++) {
		const filename = filenames[i][0];
		contents.push(await fetchText(`logo-scripts/python-turtle-content/${filename}`));
	}
}
const asyncInitPromise = init();

export function asyncInit() {
	return asyncInitPromise;
};

export function tokenToWebLogoCode(token, comments, includeTemplateCode) {
	if (!(comments instanceof Array))
		throw new Error(`comments must be an Array.  Not: ${comments}`);
	if (typeof includeTemplateCode !== 'boolean')
		throw new Error(`includeTemplateCode must be boolean.  Not: ${includeTemplateCode}`);
	const result = new CommentDumpingStringBuffer(comments, processSingleLineCommentToken);
	const refactoredTree = refactor(new CachedParseTree(token));
	token = refactoredTree.root;
	const cachedParseTree = new CachedParseTree(token);

	if (includeTemplateCode) {
		for (let i = 0; i < contents.length; i++) {
			const content = contents[i];
			const check = filenames[i][1];
			if (check(cachedParseTree))
				result.append('\n' + content);
		}
		result.append('\n');
	}

	if (token.children.length > 0)
		result.processCommentsUpToToken(token.children[0]);
	processToken(token, result, cachedParseTree);

	result.processAllRemainingComments();
	let code = result.toString().trim();
	return removeUnusedProceduresFromCode(code);
};