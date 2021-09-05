import { testAmosBasic } from
'./amos-basic/testAmosBasic.js';
import { testAnsiBasic } from
'./ansi-basic/testAnsiBasic.js';
import { testAppleSoftBasic } from
'./applesoft-basic/testAppleSoftBasic.js';
import { testAtariTurboBasicXL } from
'./atari-turbo-basic-xl/testAtariTurboBasicXL.js';
import { testBasil } from
'./basil/testBasil.js';
import { testBBCBasic } from
'./bbc-basic/testBBCBasic.js';
import { testCommodoreBasic } from
'./commodore-basic/testCommodoreBasic.js';
import { testHelpers } from
'./helpers/testHelpers.js';
import { testIsLikelyBasic } from './testIsLikelyBasic.js';
import { testMicroA } from
'./micro-a/testMicroA.js';
import { testPlayBasic } from
'./playbasic/testPlayBasic.js';
import { testQBasic } from
'./qbasic/testQBasic.js';
import { testSinclairBasic } from
'./sinclair-basic/testSinclairBasic.js';
import { testSmallVisualBasic } from
'./small-visual-basic/testSmallVisualBasic.js';
import { testTektronix405xBasic } from
'./tektronix-405x-basic/testTektronix405xBasic.js';
import { testTexasInstruments99_4a } from
'./texas-instruments-99-4a/testTexasInstruments99_4a.js';
import { testToQBASICMigrations } from
'./testToQBASICMigrations.js';
import { testTRS80Basic } from
'./trs-80-basic/testTRS80Basic.js';
import { testTrueBasic } from
'./true-basic/testTrueBasic.js';
import { wrapAndCall } from 
'../../helpers/wrapAndCall.js';

export function testBasic(logger) {
	wrapAndCall([
		testAmosBasic,
		testAnsiBasic,
		testAppleSoftBasic,
		testAtariTurboBasicXL,
		testBasil,
		testBBCBasic,
		testCommodoreBasic,
		testHelpers,
		testIsLikelyBasic,
		testMicroA,
		testPlayBasic,
		testQBasic,
		testSinclairBasic,
		testSmallVisualBasic,
		testTektronix405xBasic,
		testTexasInstruments99_4a,
		testToQBASICMigrations,
		testTRS80Basic,
		testTrueBasic
	], logger);
};