function FormatSelector(id, onChange) {
	var select = document.getElementById(id);
	var getters = [new CubeBoxPixelGetter(), new PanoramaPixelGetter(), new FishEyePixelGetter()];
	var initialIndex = 1;
	getters.forEach(function(getter, index) {
		var option = document.createElement('option');
		option.setAttribute('value', index);
		if (initialIndex === index)
			option.setAttribute('selected', 'selected');
		option.innerText = getter.getTitle();
		select.appendChild(option);
	});
	if (typeof onChange === 'function') {
		onChange(getters[initialIndex]);
		select.addEventListener('change', function() {
			console.log('change hit');
			onChange(getters[parseInt(select.value)]);
		});
	}
}