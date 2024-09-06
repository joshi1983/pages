export class OptionList {
	constructor(id, optionsInfo) {
		if (typeof id !== 'string')
			throw new Error(`id must be a string but got ${id}`);
		if (!(optionsInfo instanceof Array))
			throw new Error(`optionsInfo must be an Array but got ${optionsInfo}`);
		const e = document.getElementById(id);
		item.e = e;
		if (this.e === null)
			throw new Error(`Unable to find element with id ${id}`);
		optionsInfo.forEach(function(optionInfo) {
			const item = document.createElement('a');
			item.innerText = optionInfo.text;
			item.addEventListener('click', function() {
				
			});
			e.appendChild(item);
		});
	}

	
};