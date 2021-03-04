document.addEventListener('DOMContentLoaded', function() {
	function initializeToggleButton() {
		var toggleButton = document.getElementById('toggle-colour');
		var material = document.querySelector('Material[diffuseColor]');
		var colours = ['1 0 0', '0 0 1'];// colours to toggle between

		function toggleClicked() {
			var previousColour = material.getAttribute('diffuseColor');
			var newColour = colours.filter(function(c) {
				return c !== previousColour;
			})[0];
			material.setAttribute('diffuseColor', newColour);
		}

		toggleButton.addEventListener('click', toggleClicked);
	}

	function initializeLayout() {
		var x3d = document.querySelector('x3d');
		var header = document.querySelector('header');

		function adjustX3DHeight() {
			var h = window.innerHeight - header.clientHeight - 5;
			x3d.style.height = h + 'px';
		}

		window.addEventListener('resize', adjustX3DHeight);
		adjustX3DHeight();
	}
	
	initializeToggleButton();
	initializeLayout();
});