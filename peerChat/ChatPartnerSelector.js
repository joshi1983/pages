class ChatPartnerSelector extends UIMode {
	constructor() {
		super(document.getElementById('select-chat-partner'));
		this.selectChatPartnerUL = document.getElementById('select-chat-partner-list');
		this.noPartners = document.getElementById('select-chat-partner-no-partners');
	}

	setChat(chat) {
		this.chat = chat;
	}

	select(username) {
		if (username === undefined)
			username = this.username;
		else
			this.username = username;
		this.e.classList.remove('closed');
		var outer = this;
		var intervalTimer;

		function updateContactList() {
			fetch(serverUrl + 'contacts.php').then(function(response) {
				return response.json();
			}).then(function(contacts) {
				// Remove the current user.
				contacts = contacts.filter(function(contact) {
					return contact.username !== username;
				});
				outer.selectChatPartnerUL.innerHTML = '';
				if (contacts.length === 0)
					outer.noPartners.classList.remove('closed');
				else
					outer.noPartners.classList.add('closed');
				contacts.forEach(function(contact) {
					var li = document.createElement('li');
					li.innerText = contact.username;
					li.addEventListener('click', function() {
						if (intervalTimer)
							clearInterval(intervalTimer);
						intervalTimer = undefined;
						outer.chat.invitationSent(contact.username);
					});
					outer.selectChatPartnerUL.appendChild(li);
				});
			});
		}

		updateContactList();
		intervalTimer = setInterval(updateContactList, 1000);
	}
}