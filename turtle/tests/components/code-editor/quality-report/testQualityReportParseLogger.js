import { createRootToken } from
'../../../helpers/createRootToken.js';
import { QualityReportParseLogger } from
'../../../../modules/components/code-editor/quality-report/QualityReportParseLogger.js';

export function testQualityReportParseLogger(logger) {
	function addMessageFunc(msg) {
		if (typeof msg !== 'object')
			logger(`addMessageFunc expects an object.  Not: ${msg}`);
		else if (typeof msg.msg !== 'string')
			logger(`addMessageFunc expects msg.msg to be a string but found ${msg.msg}`);
	}
	const qReportLogger = new QualityReportParseLogger(addMessageFunc);
	const token = createRootToken();
	qReportLogger.error('test error message', token, false);
	qReportLogger.tip('test tip message', token, false);
	qReportLogger.warn('test warning message', token, false);
};