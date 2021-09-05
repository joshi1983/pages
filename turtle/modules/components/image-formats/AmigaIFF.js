import { isPossibleMatch } from './amiga-iff/isPossibleMatch.js';
import { readUint16BE } from './readUint16BE.js';

/*
This is a work in progress.
Some other priorities are causing progress on IFF support to be temporarily halted.
Here are some points to continue later.

Still left to do on AmigaIFF are:
- Activate the testAmigaIFF.js tests so they're run from test.html.
Make necessary changes to class AmigaIFF to make those tests pass.
- Add test cases for monochrome, 4-bit, 8-bit, and 24-bit IFF files and check pixels to get the same colours as in GIMP.
- Add a prototype to the prototypes directory for interactively testing various IFF files found online.
A similar prototype already exists for testing with BMP files so copying how the BMP prototype works should be a good way to start such a prototype.  
A lot of IFF file samples are online that are too big to be suitable for the git repository.
An interactive prototype would be a good tool for testing several of them to see that things work well.
- When the IFF processing looks resonably stable, make use of it in the image asset viewer for viewing IFF image assets.
- Add IFF as a format that commands like image and imageAlpha can draw. 
*/
export class AmigaIFF {
	static getMeta(byteArray) {
		const width = readUint16BE(byteArray, 0x14);
		const height = readUint16BE(byteArray, 0x16);
		return {
			'width': width,
			'height': height
		};
	}
	
	static isPossibleMatch(byteArray) {
		return isPossibleMatch(byteArray);
	}
};