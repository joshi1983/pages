import { assertEquals } from '../../../helpers/assertEquals.js';
import { blobToArrayBuffer } from
'../../../../modules/blobToArrayBuffer.js';
import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { fetchBlob } from
'../../../../modules/fetchBlob.js';
import { isPossibleMatch } from
'../../../../modules/components/image-formats/amiga-iff/isPossibleMatch.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { ProgressIndicator } from '../../../helpers/ProgressIndicator.js';
import { sleep } from '../../../helpers/sleep.js';

export async function testIsPossibleMatch(logger) {
	const cases = [
		{'in': 'single-white-pixel.iff', 'out': true},
		{'in': 'single-red-pixel.iff', 'out': true},
		{'in': 'single-green-pixel.iff', 'out': true},
		{'in': 'single-blue-pixel.iff', 'out': true},
		{'in': '2-by-2-black-white-red-blue.iff', 'out': true},
		{'in': 'README.md', 'out': false}
	];
	const progressIndicator = new ProgressIndicator(`AmigaIFF-testIsPossibleMatch`);
	logger.indicators.push(progressIndicator);
	for (let index = 0; index < cases.length; index++) {
		const caseInfo = cases[index];
		const plogger = prefixWrapper(`Case ${index}, filename=${caseInfo.filename}`, logger);
		try {
			const url = 'tests/data/image-formats/amiga-iff/' + caseInfo.in;
			const arrayBuffer = await blobToArrayBuffer(await fetchBlob(url));
			const isMatch = isPossibleMatch(new Uint8Array(arrayBuffer));
			assertEquals(caseInfo.out, isMatch, plogger);
			await sleep(100);
		} catch (e) {
			console.error(e);
			plogger(`Error or exception thrown while processing test. message=${exceptionToString(e)}`);
		}
		progressIndicator.setProgressRatio(index / cases.length);
	}
	progressIndicator.completed();
};