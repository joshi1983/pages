<?php

require_once('includes/utils.php');
validatePostedUsernameAndSecret();

require_once('includes/db.php');

deleteStaleContacts($pdoConn);

// check if username is already taken.
$statement = $pdoConn->prepare('select id from contacts where username=:username');
$statement->execute([
	':username' => $_POST['username'],
]);
if ($statement->rowCount() > 0) {
	http_response_code(403);
	$responseData = ['msg' => 'Username already taken'];
}
else {
	$statement = $pdoConn->prepare('insert into contacts(lastPingTimeUtc, username, secret, chat_status) values(
		UTC_TIMESTAMP(), :username, :secret, null)');
	if ($statement->execute([
		':username' => $_POST['username'],
		':secret' => $_POST['secret']
	])) {
		$responseData = ['msg' => 'New contact stored'];
	}
	else {
		http_response_code(500);
		?>Unable to insert record.<?php
	}
}
header('Content-type: application/json');

echo json_encode($responseData);
