import { processOperatorSymbols } from './processOperatorSymbols.js';
import { scan as qbScan } from '../../qbasic/scanning/scan.js';

const tokenProcessors = [
	processOperatorSymbols
];

export function scan(code) {
	const qbTokens = qbScan(code);
	for (const processor of tokenProcessors) {
		processor(qbTokens);
	}
	return qbTokens;
};