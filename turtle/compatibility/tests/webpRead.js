/*
The following code was adapted from
https://developers.google.com/speed/webp/faq
*/
function test_webpRead() {
	var kTestImages = {
		lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
		lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
		alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
		animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
	};
	function check_webp_feature(feature, callback) {
		var img = new Image();
		img.onload = function () {
			var result = (img.width > 0) && (img.height > 0);
			callback(feature, result);
		};
		img.onerror = function () {
			callback(feature, false);
		};
		img.src = "data:image/webp;base64," + kTestImages[feature];
	}

	var resultDiv = document.createElement('div');
	resultDiv.classList.add('failed');
	resultDiv.innerText = 'Pending webp feature test results';
	var featureNames = Object.keys(kTestImages);
	var numPassed = 0, numFailed = 0;
	for (var i = 0; i < featureNames.length; i++) {
		var feature = featureNames[i];
		check_webp_feature(feature, function(feature, isPassed) {
			if (isPassed) {
				numPassed++;
			}
			else {
				numFailed++;
			}
			var numPending = featureNames.length - numPassed - numFailed;
			if (numPending === 0) {
				resultDiv.classList.remove('failed');
				resultDiv.innerText = 'Passed';
			}
			else {
				resultDiv.innerText = 'Webp tests ' + numPassed + ' passed, ' + numFailed + ' failed, and ' + numPending + ' pending.';
			}
		});
	}
	return resultDiv;
}