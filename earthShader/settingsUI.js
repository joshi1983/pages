class SettingsUI {
	constructor() {
		this._init();
	}
	
	_toggleSettings() {
		this.settingsDiv.classList.toggle('expanded');
	}

	_init() {
		var body = document.querySelector('body');
		this.settingsDiv = document.createElement('div');
		this.settingsDiv.setAttribute('id', 'settings');
		this.settingsDiv.classList.add('expanded');
		this.settingsDiv.innerHTML = `
		<section></section>
		<footer>
			<button id="toggle-settings">Toggle</button>
		</footer>`;
		body.appendChild(this.settingsDiv);
		var toggleButton = document.getElementById('toggle-settings');
		var outer = this;
		toggleButton.addEventListener('click', function() {
			outer._toggleSettings();
		});
	}
}