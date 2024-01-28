import { downloadDataUrl } from '../../components/downloadDataUrl.js';

export function downloadAsset(asset) {
	downloadDataUrl(asset.getShortFilename(), asset.getBase64URI('application/octet-stream'));
};