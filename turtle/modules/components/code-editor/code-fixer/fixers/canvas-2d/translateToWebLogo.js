import { CommentDumpingStringBuffer } from
'../../../../../parsing/generic-parsing-utilities/CommentDumpingStringBuffer.js';
import { fixAndFormat } from '../../../../../parsing/js-parsing/translation-to-weblogo/fixAndFormat.js';
import { getInitialSettings } from './getInitialSettings.js';
import { isDefaultLineCapNeeded } from './isDefaultLineCapNeeded.js';
import { isDefaultLineJoinStyleNeeded } from './isDefaultLineJoinStyleNeeded.js';
import { parse } from '../../../../../parsing/js-parsing/parse.js';
import { processCommentToken } from
'../../../../../parsing/js-parsing/translation-to-weblogo/type-processors/processCommentToken.js';
import { processToken } from './type-processors/processToken.js';

export function translateToWebLogo(code) {
	const parseResult = parse(code);
	const result = new CommentDumpingStringBuffer(parseResult.comments, processCommentToken);
	if (isDefaultLineCapNeeded(parseResult.root))
		result.append('setLineCap "butt\n');
	if (isDefaultLineJoinStyleNeeded(parseResult.root))
		result.append('setLineJoinStyle "miter\n');
	const settings = getInitialSettings(parseResult.root);
	processToken(parseResult.root, result, settings);
	result.processAllRemainingComments();

	return fixAndFormat(result.toString());
};