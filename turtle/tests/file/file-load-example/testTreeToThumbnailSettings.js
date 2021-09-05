import { testCodeToProgram } from '../../helpers/testCodeToProgram.js';
import { treeToThumbnailSettings } from '../../../modules/file/file-load-example/treeToThumbnailSettings.js';

export async function testTreeToThumbnailSettings(logger) {
	const code = `fd animation.time
to animation.setup
	localmake "result createPList
	setProperty "result "duration 4
	setProperty "result "thumbnailTime 2
	output :result
end`;
	const program = testCodeToProgram(code, logger);
	const result = await treeToThumbnailSettings(program);
	if (typeof result !== 'object')
		logger(`Expected result to be an object but got ${result}`);
	else {
		if (result.animationTime !== 2)
			logger(`Expected animationTime to be 2 but got ${result.animationTime}`);
		if (result.animationDurationSeconds !== 4)
			logger(`Expected animationDurationSeconds to be 4 but got ${result.animationDurationSeconds}`);
	}
};