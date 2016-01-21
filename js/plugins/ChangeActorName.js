// イベントのスクリプトに以下の3行を追加、アクターIDと変数IDを変更してください
var actorId = 1; // アクターID
var variableId = 1; // 名前の入った変数ID
$gameActors.actor(actorId).setName($gameVariables.value(variableId));