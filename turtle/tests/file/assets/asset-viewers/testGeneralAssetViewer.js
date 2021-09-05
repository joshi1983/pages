import { Asset } from '../../../../modules/assets/Asset.js';
import { GeneralAssetViewer } from '../../../../modules/file/assets/asset-viewers/GeneralAssetViewer.js';

export function testGeneralAssetViewer(logger) {
	const asset = new Asset('general-asset-viewer-test.dat', 'hello world');
	const viewer = GeneralAssetViewer.createAssetViewer(asset);
	viewer.getDiv();
};