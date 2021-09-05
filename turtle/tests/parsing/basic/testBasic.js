import { testAnsiBasic } from
'./ansi-basic/testAnsiBasic.js';
import { testAppleSoftBasic } from
'./applesoft-basic/testAppleSoftBasic.js';
import { testBBCBasic } from
'./bbc-basic/testBBCBasic.js';
import { testCommodoreBasic } from
'./commodore-basic/testCommodoreBasic.js';
import { testHelpers } from
'./helpers/testHelpers.js';
import { testQBasic } from
'./qbasic/testQBasic.js';
import { testSinclairBasic } from
'./sinclair-basic/testSinclairBasic.js';
import { testSmallVisualBasic } from
'./small-visual-basic/testSmallVisualBasic.js';
import { testTektronix405xBasic } from
'./tektronix-405x-basic/testTektronix405xBasic.js';
import { testToQBASICMigrations } from
'./testToQBASICMigrations.js';
import { testTRS80Basic } from
'./trs-80-basic/testTRS80Basic.js';
import { wrapAndCall } from 
'../../helpers/wrapAndCall.js';

export function testBasic(logger) {
	wrapAndCall([
		testAnsiBasic,
		testAppleSoftBasic,
		testBBCBasic,
		testCommodoreBasic,
		testHelpers,
		testQBasic,
		testSinclairBasic,
		testSmallVisualBasic,
		testTektronix405xBasic,
		testToQBASICMigrations,
		testTRS80Basic
	], logger);
};