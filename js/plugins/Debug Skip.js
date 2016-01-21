//=============================================================================
// Debug Skip.js
//=============================================================================

/*:
 * @plugindesc Allows skipping certain event commands while in debug mode.
 * <KockaDebugSkip>
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * If you are tired of doing this in your game again and again and you just
 * wanted to test specific things, or you want to avoid long dialogues, battles
 * etc. this plugin allows you to do that!
 * You can skip any event command you like, and you specify them in parameters
 *
 * By default, debug-skipped are :
 * 301		Battle Processing
 * 250		Play SE
 * 230		Wait
 * 225		Shake Screen
 * 224		Flash Screen
 * 213		Show Balloon Icon
 * 212		Show Animation
 * 105		Show Scrolling Text
 * 101		Show Text
 * Separate numbers with only one space in the parameter
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial [ReStaff] release
 * ============================================================================
 *                             PLUGIN COMMANDS
 * ============================================================================
 * - DebugSkip start
 *   Starts debug-skipping.
 *
 * - DebugSkip stop
 *   Stops debug-skipping.
 *
 * - DebugSkip toggle
 *   Toggles debug-skipping.
 *
 * There is also an option to go to console (F8) and type in :
 * console.startDebugSkip()
 * console.stopDebugSkip()
 * or
 * console.toggleDebugSkip()
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *  - console :
 *    - startDebugSkip
 *    - stopDebugSkip
 *    - toggleDebugSkip
 *
 * ALIASED :
 *  - Game_Interpreter :
 *    - pluginCommand
 *    - executeCommand
 *
 * OVERWRITTEN :
 *  - <None>
 * ============================================================================
 * @param Debug Skip
 * @desc Commands that will be skipped. Add all commands that you wont to be
 * skipped while in debug mode.
 * @default 301 250 230 225 224 213 212 105 101
 */
/*:ja
 * @plugindesc デバックモードにおいて、任意のイベントコマンドをスキップできます。
 * <KockaDebugSkip>
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * ある特定のことをテストしたいだけなのに、毎回同じことを繰り返さなければいけ
 * なかったり、長いセリフやバトルを省きたい場合このプラグインをお使いください。
 * パラメータで指定した、好きなイベントコマンドをスキップすることができます。
 *
 * デフォルトでのデバックスキップ対象一覧 :
 * 301		戦闘プロセス
 * 250		SEの再生
 * 230		待ち
 * 225		スクリーンの振動
 * 224		スクリーンの点滅
 * 213		ふきだし表示
 * 212		アニメーション表示
 * 105		スクロールテキストの表示
 * 101		テキストの表示
 * パラメータ内で数字を区切るには、スペースを1つ入れてください。
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial [ReStaff] release
 * ============================================================================
 *                             プラグインコマンド
 * ============================================================================
 * - DebugSkip start
 *   デバックスキップを有効にします。
 *
 * - DebugSkip stop
 *   デバックスキップを無効にします。
 *
 * - DebugSkip toggle
 *   デバックスキップを切り替えます。
 *
 * コンソール(F8)に行って入力を行う方法もあります。 :
 * console.startDebugSkip()
 * console.stopDebugSkip()
 * or
 * console.toggleDebugSkip()
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * 新規 :
 *  - console :
 *    - startDebugSkip
 *    - stopDebugSkip
 *    - toggleDebugSkip
 *
 * 別名 :
 *  - Game_Interpreter :
 *    - pluginCommand
 *    - executeCommand
 *
 * 上書き :
 *  - <None>
 * ============================================================================
 * @param Debug Skip
 * @desc デバッグモードでスキップされるコマンドの一覧です。
 * @default 301 250 230 225 224 213 212 105 101
 */


var Imported = Imported || {};
Imported.Kocka = Imported.Kocka || {};
Imported.Kocka.DebugSkip = {
		version: [1, 0, 0],
	 	aliases: {
        Game_Interpreter: {
            pluginCommand: Game_Interpreter.prototype.pluginCommand,
            executeCommand: Game_Interpreter.prototype.executeCommand
        }
	 	}
};

(function(){



// Reading parameters
var _plugin_params = $plugins.filter(function(p) { return p.description.contains('<KockaDebugSkip>'); })[0].parameters;
var DEBUG_SKIP = _plugin_params["Debug Skip"].split(" ");



//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

Game_Interpreter.prototype.pluginCommand = function(command, args)
{
    Imported.Kocka.DebugSkip.aliases.Game_Interpreter.pluginCommand.apply(this, arguments);
    if(command === "DebugSkip")
    {
        if($gameTemp.isPlaytest()) switch(args[0])
        {
            case 'start':
                this._debugSkip = true;
                break;
            case 'stop':
                this._debugSkip = false;
                break;
            case 'toggle':
                this._debugSkip = !this._debugSkip;
                break;
        }
    }
};

Game_Interpreter.prototype.executeCommand = function()
{
    var command = this._list[this._index];
    if(command && DEBUG_SKIP.contains(String(command.code)) && this._debugSkip) ++ this._index;
    else Imported.Kocka.DebugSkip.aliases.Game_Interpreter.executeCommand.apply(this, arguments);
};



//-----------------------------------------------------------------------------
// Console
//
// Class representing the debug console.

console.startDebugSkip = function()
{
    if(!$gameTemp.isPlaytest())throw new ReferenceError("This method is not defined"); // XD
    $gameMap._interpreter._debugSkip = true;
    return "Started debug skip";
}

console.stopDebugSkip = function()
{
    if(!$gameTemp.isPlaytest())throw new ReferenceError("This method is not defined"); // XD
    $gameMap._interpreter._debugSkip = false;
    return "Stopped debug skip";
}

console.toggleDebugSkip = function() { return $gameMap._interpreter._debugSkip ? this.stopDebugSkip() : this.startDebugSkip(); }



})();