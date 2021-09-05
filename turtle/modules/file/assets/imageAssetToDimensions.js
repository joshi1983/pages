export function imageAssetToDimensions(asset) {
	const img = document.createElement('img');
	const result = new Promise(function(resolve, reject) {
		img.addEventListener('load', function() {
			resolve({
				'width': img.width,
				'height': img.height
			});
		});
	});
	img.src = asset.getBase64URI();
	return result;
};