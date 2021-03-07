var serverUrl = getInitialServerURL();

document.addEventListener('DOMContentLoaded', function() {
	var secret = generate_random_string(100);
	var chat = new Chat(secret);
	var chatPartnerSelector = new ChatPartnerSelector();
	var chatInvitation = new ChatInvitation(secret, chat);
	var username = new Username(secret, chatInvitation);
	chatInvitation.setChatPartnerSelector(chatPartnerSelector);
	chat.setChatPartnerSelector(chatPartnerSelector);
	username.setChat(chat);
	username.setChatPartnerSelector(chatPartnerSelector);
	username.setChatInvitation(chatInvitation);
	var uiMode = new UIModeSelector([username, chatPartnerSelector, chat]);
	username.reset();
});