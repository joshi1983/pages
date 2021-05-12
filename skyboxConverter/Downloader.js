function initDownloader() {
	const downloadButton = document.getElementById('download');
	const canvas = document.getElementById('converted-image');
	const formatSelect = document.getElementById('download-file-format');
	const formats = [
		['JPG', 'image/jpeg'],
		['PNG', 'image/png'],
		['WEBP', 'image/webp'],
	];
	const initialFormatIndex = 0;
	formats.forEach(function(format, index) {
		var option = document.createElement('option');
		option.setAttribute('value', format[1]);
		option.innerText = format[0];
		if (index === initialFormatIndex)
			option.setAttribute('selected', true);
		formatSelect.appendChild(option);
	});
	downloadButton.addEventListener('click', function() {
		var imgUrl = canvas.toDataURL(formatSelect.value);
		var a = document.createElement('a');
		var selectedOption = formatSelect.querySelector('[value="' + formatSelect.value + '"]');
		var extension = selectedOption.innerText.toLowerCase();
		a.setAttribute('download', 'export.' + extension);
		a.setAttribute('href', imgUrl);
		a.click();
	});
}