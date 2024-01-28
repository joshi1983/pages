export function bindTransparentCSSClass(colorInput, colorTransparentInput) {
	function refreshTransparent() {
		if (colorTransparentInput.checked)
			colorInput.classList.add('transparent');
		else
			colorInput.classList.remove('transparent');
	}
	refreshTransparent();
	colorTransparentInput.addEventListener('click', refreshTransparent);
};