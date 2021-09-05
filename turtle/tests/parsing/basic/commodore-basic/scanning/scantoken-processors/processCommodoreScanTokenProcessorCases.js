import { processScanTokenProcessorCases } from
'../../../../../helpers/parsing/basic/processScanTokenProcessorCases.js';
import { scan } from
'../../../../../../modules/parsing/basic/qbasic/scanning/scan.js';

export function processCommodoreScanTokenProcessorCases(cases, processFunc, logger) {
	processScanTokenProcessorCases(scan, cases, processFunc, logger);
};