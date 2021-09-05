import { joinGoto } from './joinGoto.js';
import { processOperatorSymbols } from './processOperatorSymbols.js';
import { processThenGoto } from '../../helpers/processThenGoto.js';
import { scan as qbScan } from
'../../qbasic/scanning/scan.js';

const tokenProcessors = [
	joinGoto,
	processOperatorSymbols,
	processThenGoto
];

export function scan(code) {
	const qbTokens = qbScan(code);
	for (const processor of tokenProcessors) {
		processor(qbTokens);
	}
	return qbTokens;
};