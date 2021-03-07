<?php
/*
Used to decline a chat invitation or indicate leaving a chat room.
*/
require_once('includes/utils.php');
validatePostedUsernameAndSecret(['chat_partner_username']);

require_once('includes/db.php');

checkUsernameAndSecret($pdoConn);

// update the inviter user's status and chat_partner_username.
// Potentially, update the current user's partner and status if he was chatting with this other person.
$statement = $pdoConn->prepare('update contacts set chat_partner_username=null, chat_status=null
where (chat_partner_username=:username and username=:chat_partner_username) or 
(username=:username and chat_partner_username=:chat_partner_username)');
$statement->execute([
	'username' => $_POST['username'],
	'chat_partner_username' => $_POST['chat_partner_username']
]);

header('Content-type: application/json');
$responseData = ['msg' => 'Declined'];
echo json_encode($responseData);