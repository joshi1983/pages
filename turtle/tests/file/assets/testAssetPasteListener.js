import { AssetPasteListener } from '../../../modules/file/assets/AssetPasteListener.js';

export function testAssetPasteListener(logger) {
	function callback(filename, data) {
		
	}
	AssetPasteListener.activate(callback);
	AssetPasteListener.deactivate();
};