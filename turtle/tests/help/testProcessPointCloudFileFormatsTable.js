import { processPointCloudFileFormatsTable } from '../../modules/help/processPointCloudFileFormatsTable.js';

export function testProcessPointCloudFileFormatsTable(logger) {
	const e = document.createElement('div');
	e.id = 'point-cloud-exporter-file-formats';
	processPointCloudFileFormatsTable(e);
};