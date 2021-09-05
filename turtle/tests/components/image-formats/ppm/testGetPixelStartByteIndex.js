import { getPixelStartByteIndex } from
'../../../../modules/components/image-formats/ppm/getPixelStartByteIndex.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testGetPixelStartByteIndex(logger) {
	const cases = [
	{'s': 'P1\n4 7\n0 0 0',
	'version': 1,
	'dimensionProduct': 4*7,
	'width': 4,
	'out': 7},
	{'s': 'P1\r\n4 7\r\n0 0 0',
	'version': 1,
	'dimensionProduct': 4*7,
	'width': 4,
	'out': 9},
	{'s': 'P3\n4 4\n15\n0',
	'version': 3,
	'dimensionProduct': 16,
	'width': 4,
	'out': 10
	},
	{'s': 'P3\r\n4 4\r\n15\r\n0',
	'version': 3,
	'dimensionProduct': 16,
	'width': 4,
	'out': 13
	},
	{'s': 'P1\n# PBM Black & White Example\n24 7\n0 0 0',
	'version': 1,
	'dimensionProduct': 24*7,
	'out': 36},
	{'s': 'P1\r\n# PBM Black & White Example\r\n24 7\r\n0 0 0',
	'version': 1,
	'dimensionProduct': 24*7,
	'out': 39}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, s=${caseInfo.s}`, logger);
		if (!Number.isInteger(caseInfo.version))
			plogger(`version must be an integer in case info but found ${caseInfo.version}`);
		else if (!Number.isInteger(caseInfo.dimensionProduct))
			plogger(`dimensionProduct must be an integer in case info but found ${caseInfo.dimensionProduct}`);
		else {
			const s = caseInfo.s;
			const encoder = new TextEncoder();
			const byteArray = encoder.encode(s);
			const result = getPixelStartByteIndex(s, byteArray, caseInfo.dimensionProduct, caseInfo.width, caseInfo.version);
			if (result !== caseInfo.out)
				plogger(`Expected ${caseInfo.out} but found ${result}`);
		}
	});
};