<?php
/*
Called when someone wants to start chatting with a specific other user.
*/

require_once('includes/utils.php');
validatePostedUsernameAndSecret(['chat_partner_username']);

if ($_POST['chat_partner_username'] === $_POST['username']) {
	http_response_code(422);
	?>username and chat_partner_username must not be equal because a user can not chat with himself.<?php
	exit(1);
}

require_once('includes/db.php');

checkUsernameAndSecret($pdoConn);

$statement = $pdoConn->prepare(
'select sdp from contacts
where sdp is not null and username=:chat_partner_username');
$statement->execute([
	'chat_partner_username' => $_POST['chat_partner_username']
]);
if ($statement->rowCount() < 1) {
	http_response_code(404);
	?>Unable to find sdp for specified user's partner.<?php
	exit(2);
}
$row = $statement->fetch(PDO::FETCH_ASSOC);
header('Content-type: application/json');
echo json_encode($row);