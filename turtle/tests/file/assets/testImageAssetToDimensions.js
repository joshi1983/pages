import { Asset } from
'../../../modules/assets/Asset.js';
import { blobToBase64 } from
'../../../modules/blobToBase64.js';
import { fetchBlob } from
'../../../modules/fetchBlob.js';
import { getImageAssetCode } from
'../../../modules/file/assets/getImageAssetCode.js';
import { getUrlBase } from
'../../../modules/getUrlBase.js';
import { imageAssetToDimensions } from
'../../../modules/file/assets/imageAssetToDimensions.js';
import { isNumber } from
'../../../modules/isNumber.js';
import { LogoParser } from
'../../../modules/parsing/LogoParser.js';
import { ParseLogger } from
'../../../modules/parsing/loggers/ParseLogger.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { trimDataUrlPrefix } from
'../../../modules/assets/trimDataUrlPrefix.js';
await LogoParser.asyncInit();

export function testImageAssetToDimensions(logger) {
	const cases = [
		{'url': 'images/logo-32px.png', 'out': {'width': 32, 'height': 32}},
		{'url': 'images/logo-128px.png', 'out': {'width': 128, 'height': 128}},
		{'url': 'images/logo.svg', 'out': {'width': 1024, 'height': 1024}},
		{'url': 'images/logo-transparent.svg', 'out': {'width': 1024, 'height': 1024}},
		{'url': 'images/icons/asset-index.svg', 'out': {'width': 32, 'height': 32}}
	];
	cases.forEach(async function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, url: ${caseInfo.url}`, logger);
		const url = getUrlBase() + caseInfo.url;
		const blob = await fetchBlob(url);
		const dataString = trimDataUrlPrefix(await blobToBase64(blob));
		const asset = new Asset(caseInfo.url, dataString);
		const dimensions = await imageAssetToDimensions(asset);
		if (typeof dimensions !== 'object' || dimensions === null)
			plogger(`Expected imageAssetToDimensions to return an object but found ${dimensions}`);
		else if (!isNumber(dimensions.width) || !isNumber(dimensions.height)) {
			plogger(`Expected numbers for both width and height but found width=${dimensions.width}, height=${dimensions.height}`);
		}
		else {
			const out = caseInfo.out;
			if (out.width !== dimensions.width)
				plogger(`Expected width to be ${out.width} but found ${dimensions.width}`);
			if (out.height !== dimensions.height)
				plogger(`Expected height to be ${out.height} but found ${dimensions.height}`);

			const code = await getImageAssetCode(asset);
			if (typeof code !== 'string')
				plogger(`Expected getImageAssetCode to return a string but found ${code}`);
			else {
				const parseLogger = new ParseLogger();
				const parseTree = LogoParser.getParseTree(code, parseLogger);
				if (typeof parseTree !== 'object')
					plogger(`Unable to parse ${code}.  Expected to get a parse tree object but instead found ${parseTree}`);
				else if (parseLogger.hasLoggedErrors())
					plogger(`Found an error while trying to parse ${code}`);

				// We won't use analyzeCodeQuality for this test
				// because we expect to find errors related to the asset not existing.
			}
		}
	});
};