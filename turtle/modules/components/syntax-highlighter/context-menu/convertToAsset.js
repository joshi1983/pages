import { Asset } from '../../../assets/Asset.js';
import { AssetRepository } from '../../../assets/AssetRepository.js';
import { blobToBase64 } from '../../../blobToBase64.js';
import { fetchBlob } from '../../../fetchBlob.js';
import { getAssetFileName } from './convert-to-asset/getAssetFileName.js';
import { setTokenValueInCodeEditor } from '../../code-editor/setTokenValueInCodeEditor.js';
import { trimDataUrlPrefix } from '../../../assets/trimDataUrlPrefix.js';

export async function convertToAsset(oldCode, urlToken) {
	const url = urlToken.val;
	const blob = await fetchBlob(urlToken.val);
	const takenNames = AssetRepository.getAllFileNames();
	const filename = await getAssetFileName(url, blob, takenNames);
	const base64Data = trimDataUrlPrefix(await blobToBase64(blob));
	const asset = new Asset(filename, base64Data);
	AssetRepository.add(asset);
	setTokenValueInCodeEditor(oldCode, urlToken, `local://${filename}`);
};