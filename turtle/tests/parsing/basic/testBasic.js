import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { ProgressIndicator } from '../../helpers/ProgressIndicator.js';
import { sleep } from '../../helpers/sleep.js';
const modules = [
'./amos-basic/testAmosBasic.js',
'./ansi-basic/testAnsiBasic.js',
'./applesoft-basic/testAppleSoftBasic.js',
'./atari-turbo-basic-xl/testAtariTurboBasicXL.js',
'./basil/testBasil.js',
'./bazz-basic/testBazzBasic.js',
'./bbc-basic/testBBCBasic.js',
'./commodore-basic/testCommodoreBasic.js',
'./helpers/testHelpers.js',
'./testIsLikelyBasic.js',
'./micro-a/testMicroA.js',
'./pbasic/testPBasic.js',
'./playbasic/testPlayBasic.js',
'./qbasic/testQBasic.js',
'./sinclair-basic/testSinclairBasic.js',
'./small-visual-basic/testSmallVisualBasic.js',
'./tektronix-405x-basic/testTektronix405xBasic.js',
'./texas-instruments-99-4a/testTexasInstruments99_4a.js',
'./testToQBASICMigrations.js',
'./trs-80-basic/testTRS80Basic.js',
'./true-basic/testTrueBasic.js'
];

export async function testBasic(logger) {
	const progressIndicator = new ProgressIndicator('testBasic');
	logger.indicators.push(progressIndicator);
	for (let i = 0; i < modules.length; i++) {
		const modulePath = modules[i];
		const m = await import(modulePath);
		const key1 = modulePath.substring(modulePath.lastIndexOf('/') + 1);
		const key = key1.substring(0, key1.length - 3);
		m[key](prefixWrapper(key, logger));
		progressIndicator.setProgressRatio(i / modules.length);
		progressIndicator.setMessage(`${i} of ${modules.length}`);
		await sleep(5);
	}
	progressIndicator.completed();
};