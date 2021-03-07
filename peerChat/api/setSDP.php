<?php
/*
Called when someone wants to start chatting with a specific other user.
*/

require_once('includes/utils.php');
validatePostedUsernameAndSecret(['sdp', 'chat_partner_username']);

if ($_POST['chat_partner_username'] === $_POST['username']) {
	http_response_code(422);
	?>chat_partner_username must not be the same as username<?php
	exit(3);
}

require_once('includes/db.php');

checkUsernameAndSecret($pdoConn);

$statement = $pdoConn->prepare('select id, chat_status from contacts where username=:username');
$statement->execute([':username' => $_POST['chat_partner_username']]);
if ($statement->rowCount() < 1) {
	http_response_code(404);
	?>chat_partner_username not found<?php
	exit(4);
}
$row = $statement->fetch(PDO::FETCH_ASSOC);
$previous_chat_status = $row['chat_status'];
if (strpos('123', $previous_chat_status) !== false) {
	$previous_chat_status = intval($previous_chat_status);
}

// set SDP and chat partner.
$statement = $pdoConn->prepare('update contacts set sdp=:sdp, chat_partner_username=:chat_partner_username
where username=:username and secret=:secret');
$statement->execute([
	':username' => $_POST['username'],
	':secret' => $_POST['secret'],
	':sdp' => $_POST['sdp'],
	':chat_partner_username' => $_POST['chat_partner_username']
]);
if ($previous_chat_status === 1 || $previous_chat_status === 2) {
	// if there is any existing invitation from the specified partner username, 
	// update their chat_status to 2.
	$statement = $pdoConn->prepare('update contacts set chat_status=:previous_chat_status + 1
	where (chat_partner_username=:username and chat_status=1 and username=:chat_partner_username) or (username=:username)');
	$statement->execute([
		':username' => $_POST['username'],
		':chat_partner_username' => $_POST['chat_partner_username'],
		':previous_chat_status' => $previous_chat_status
	]);
}
else if ($previous_chat_status === null) {
	// if merely inviting another user to chat, set chat_status to 1.
	$statement = $pdoConn->prepare('update contacts set chat_status=1 where username=:username and chat_status is null');
	$statement->execute([
		':username' => $_POST['username']
	]);
}
else {
	logMessage('previous_chat_status is not null, 1, or 2 apparently.');
}

header('Content-type: application/json');

$responseData = ['msg' => 'sdp stored'];

echo json_encode($responseData);
