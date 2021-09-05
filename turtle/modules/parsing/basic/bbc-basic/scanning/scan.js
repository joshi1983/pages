import { mergeBBCBasicNumberLiteralTokens } from './mergeBBCBasicNumberLiteralTokens.js';
import { scan as qbScan } from '../../qbasic/scanning/scan.js';
import { splitNumberFormatAssignments } from './splitNumberFormatAssignments.js';
import { splitTilde } from './splitTilde.js';

const tokenProcessors = [
	mergeBBCBasicNumberLiteralTokens,
	splitNumberFormatAssignments,
	splitTilde
];

export function scan(code) {
	const qbTokens = qbScan(code);
	for (const processor of tokenProcessors) {
		processor(qbTokens);
	}
	return qbTokens;
};