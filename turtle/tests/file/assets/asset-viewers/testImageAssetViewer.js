import { Asset } from
'../../../../modules/assets/Asset.js';
import { blobToBase64 } from
'../../../../modules/blobToBase64.js';
import { fetchBlob } from
'../../../../modules/fetchBlob.js';
import { ImageAssetViewer } from
'../../../../modules/file/assets/asset-viewers/ImageAssetViewer.js';
import { trimDataUrlPrefix } from
'../../../../modules/assets/trimDataUrlPrefix.js';

const blob = await fetchBlob('tests/data/image-formats/pcx/DRACULA.PCX');
const base64 = trimDataUrlPrefix(await blobToBase64(blob));

export function testImageAssetViewer(logger) {
	const filename = 'test.pcx';
	const asset = new Asset(filename, base64);
	const viewer = new ImageAssetViewer(asset);
	if (viewer._isPCX() !== true)
		logger(`Expected _isPCX() to return true but found ${viewer._isPCX()}`);
	const div = viewer.getDiv();
	if (!(div instanceof Element))
		logger(`Expected getDiv() to return an Element but found ${div}`);
};