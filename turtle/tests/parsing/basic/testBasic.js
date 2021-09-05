import { testAppleSoftBasic } from
'./applesoft-basic/testAppleSoftBasic.js';
import { testBBCBasic } from
'./bbc-basic/testBBCBasic.js';
import { testHelpers } from
'./helpers/testHelpers.js';
import { testQBasic } from
'./qbasic/testQBasic.js';
import { testSmallVisualBasic } from
'./small-visual-basic/testSmallVisualBasic.js';
import { testTektronix405xBasic } from
'./tektronix-405x-basic/testTektronix405xBasic.js';
import { wrapAndCall } from 
'../../helpers/wrapAndCall.js';

export function testBasic(logger) {
	wrapAndCall([
		testAppleSoftBasic,
		testBBCBasic,
		testHelpers,
		testQBasic,
		testSmallVisualBasic,
		testTektronix405xBasic
	], logger);
};