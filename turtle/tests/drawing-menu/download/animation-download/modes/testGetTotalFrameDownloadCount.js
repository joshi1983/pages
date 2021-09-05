import { AnimationDownloadMode } from
'../../../../../modules/drawing-menu/download/animation-download/modes/AnimationDownloadMode.js';
import { assertEquals } from
'../../../../helpers/assertEquals.js';
import { getTotalFrameDownloadCount } from
'../../../../../modules/drawing-menu/download/animation-download/modes/getTotalFrameDownloadCount.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testGetTotalFrameDownloadCount(logger) {
	const cases = [
		{'args': [0, -1, 1, 30, AnimationDownloadMode.FrameSequenceMode], 'out': 30},
		{'args': [0, -1, 2, 30, AnimationDownloadMode.FrameSequenceMode], 'out': 60},
		{'args': [0, -1, 3, 30, AnimationDownloadMode.FrameSequenceMode], 'out': 90},
		{'args': [0, 3, 1, 30, AnimationDownloadMode.FrameSequenceMode], 'out': 4},
		{'args': [0, 3, 1, 24, AnimationDownloadMode.FrameSequenceMode], 'out': 4},
		{'args': [0, 2, 1, 24, AnimationDownloadMode.FrameSequenceMode], 'out': 3},
		{'args': [0, 0, 1, 24, AnimationDownloadMode.FrameSequenceMode], 'out': 1},
		{'args': [0, 1, 1, 24, AnimationDownloadMode.FrameSequenceMode], 'out': 2},
		{'args': [0, 0, 1, 24, AnimationDownloadMode.AnimatedGifMode], 'out': 24},
		{'args': ['NAN', 'NAN', 1, 24, AnimationDownloadMode.AnimatedGifMode], 'out': 24},
		// weird case but let's make getTotalFrameDownloadCount tolerate some weird inputs.

		{'args': ['NAN', 'NAN', 1, 30, AnimationDownloadMode.FrameSequenceMode], 'out': 30},
		// Ignore the start and end index if the user could found a way to type invalid numbers into the frame index inputs.

	];
	const startIndex = document.createElement('input');
	const endIndex = document.createElement('input');
	const frameRateDropdown = document.createElement('input');
	[startIndex, endIndex, frameRateDropdown].forEach(function(element) {
		element.type = 'number';
		element.step = '1';
	});
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		startIndex.value = caseInfo.args[0];
		endIndex.value = caseInfo.args[1];
		frameRateDropdown.value = caseInfo.args[3];
		const result = getTotalFrameDownloadCount(startIndex, endIndex, caseInfo.args[2],
			frameRateDropdown, caseInfo.args[4]);
		assertEquals(caseInfo.out, result, plogger);
	});
};