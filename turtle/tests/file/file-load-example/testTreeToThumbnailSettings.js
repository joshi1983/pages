import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testCodeToProgram } from '../../helpers/testCodeToProgram.js';
import { treeToThumbnailSettings } from '../../../modules/file/file-load-example/treeToThumbnailSettings.js';

async function validateResults(code, logger) {
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
}

export async function testTreeToThumbnailSettings(logger) {
	const cases = [`fd animation.time
to animation.setup
	localmake "result createPList
	setProperty "result "duration 4
	setProperty "result "thumbnailTime 2
	output :result
end`,
`fd animation.time
to animation.setup
	localmake "result createPList
	setProperty2 :result "duration 4
	setProperty2 :result "thumbnailTime 2
	output :result
end`,
`fd animation.time
to animation.setup
	output createPList2 [["duration 4] ["thumbnailTime 2]]
end`
];
	for (let i = 0; i < cases.length; i++) {
		const code = cases[i];
		const plogger = prefixWrapper(`Case ${i}, code=${code}`, logger);
		await validateResults(code, plogger);
	}
};