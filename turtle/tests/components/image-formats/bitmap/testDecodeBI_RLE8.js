import { decodeBI_RLE8 } from
'../../../../modules/components/image-formats/bitmap/decodeBI_RLE8.js';
import { processDecodeTestCases } from
'./processDecodeTestCases.js';

export function testDecodeBI_RLE8(logger) {
	const cases = [

	//A lot of these test cases are adapted from examples at:
	//https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-wmf/b64d0c0b-bb80-4b53-8382-f38f264eb685
	{'arr': [0, 0], 'bytesPerLine': 4, 'height': 1,
	'out': [0, 0, 0, 0]},
	{'arr': [0, 1], 'bytesPerLine': 4, 'height': 1,
	'out': [0, 0, 0, 0]},
	{'arr': [0x03, 0x04], 'bytesPerLine': 4, 'height': 1,
	'out': [0x04, 0x04, 0x04, 0]},
	{'arr': [0x05, 0x06], 'bytesPerLine': 8, 'height': 1,
	'out': [0x06, 0x06, 0x06, 0x06, 0x06, 0, 0, 0]},
	{
		'arr': [0x00, 0x03, 0x45, 0x56, 0x67, 0x00], 'bytesPerLine': 4, 'height': 1,
		'out': [0x45, 0x56, 0x67, 0]
	},
	{
		'arr': [0x02, 0x78], 'bytesPerLine': 4, 'height': 1,
		'out': [0x78, 0x78, 0x00, 0x00]
	},
	{
		'arr': [0x09, 0x1E], 'bytesPerLine': 12, 'height': 1,
		'out': [0x1E, 0x1E, 0x1E, 0x1E, 0x1E, 0x1E, 0x1E, 0x1E, 0x1E, 0, 0, 0]
	}
	];

	processDecodeTestCases(cases, decodeBI_RLE8, logger);
};