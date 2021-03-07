<?php
/*
A ping is an HTTP request from the Peer Chat client to indicate 
that the client is still available for new connections.

Each ping pushes back the automatic expiry of the 
authenticated client's contact information.
*/
require_once('includes/utils.php');
validatePostedUsernameAndSecret();

require_once('includes/db.php');

checkUsernameAndSecret($pdoConn);

$statement = $pdoConn->prepare('update contacts set lastPingTimeUtc=UTC_TIMESTAMP() where username=:username');
$statement->execute([
	':username' => $_POST['username']
]);

header('Content-type: application/json');
$statement = $pdoConn->prepare('select chat_status, chat_partner_username from contacts where username=:username');
$statement->execute([
	':username' => $_POST['username']
]);
$row = $statement->fetch(PDO::FETCH_ASSOC);
$chat_status = null;
if ($row['chat_status'] !== null) {
	$chat_status = intval($row['chat_status']);
}
$responseData = [
	'chat_status' => $chat_status,
	'chat_partner_username' => $row['chat_partner_username']
];

$statement = $pdoConn->prepare('select username from contacts where 
	chat_partner_username=:username and chat_status=1');
$statement->execute([
	':username' => $_POST['username']
]);
$responseData['invitations'] = [];
while ($invitation = $statement->fetch(PDO::FETCH_ASSOC)) {
	$responseData['invitations'] []= $invitation['username'];
}

echo json_encode($responseData);