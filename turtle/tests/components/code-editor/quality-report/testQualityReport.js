import { testAddMessage } from
'./testAddMessage.js';
import { testAnimationSetupTest } from
'./testAnimationSetupTest.js';
import { testMessageCount } from
'./testMessageCount.js';
import { testQualityReportParseLogger } from
'./testQualityReportParseLogger.js';
import { testRandomExecutionTester } from
'./testRandomExecutionTester.js';
import { testShouldTestDifferentAnimationTimes } from
'./testShouldTestDifferentAnimationTimes.js';
import { wrapAndCall } from
'../../../helpers/wrapAndCall.js';

export function testQualityReport(logger) {
	wrapAndCall([
		testAddMessage,
		testAnimationSetupTest,
		testMessageCount,
		testQualityReportParseLogger,
		testRandomExecutionTester,
		testShouldTestDifferentAnimationTimes
	], logger);
};