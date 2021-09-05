import { convertLibertyBasicLabelsToQBasicLabels } from
'./convertLibertyBasicLabelsToQBasicLabels.js';
import { scan as scanQBasic } from
'../../qbasic/scanning/scan.js';

const processors = [
	convertLibertyBasicLabelsToQBasicLabels,
];

export function scan(code) {
	const scanTokens = scanQBasic(code);
	for (const processor of processors) {
		processor(scanTokens);
	}
	return scanTokens;
};