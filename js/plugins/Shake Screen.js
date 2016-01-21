//=============================================================================
// Something.js
//=============================================================================

/*:
 * @plugindesc Allows starting shake that shakes the screen forever.
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * Do you sometimes make parallel process events that shake your screen, and
 * then control them with switches and whatnots?
 * This plugin allows much easier shake management, just call one plugin
 * command and Shake Screen afterwards and your shake will start until you say
 * it to stop!
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial [ReStaff] release
 * ============================================================================
 *                              PLUGIN COMMANDS
 * ============================================================================
 *  - Shake start
 *    Starts shaking.
 *  - Shake stop
 *    Stops shaking.
 *  - Shake toggle
 *    If it was shaking, stops, otherwise starts shaking.
 *
 * Note : You must call Shake Screen after start or toggle, but just once, and
 *        it's used to determine how powerful and how fast will shaking be.
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * NEW :
 *  - <None>
 *
 * ALIASED :
 *  - Game_Screen :
 *    - update
 *  - Game_Interpreter :
 *    - pluginCommand
 *
 * OVERWRITTEN :
 *  - <None>
 * ============================================================================
 */
/*:ja
 * @plugindesc スクリーンを振動させっぱなしにすることができます。
 * @author KockaAdmiralac
 *
 * @help
 * ============================================================================
 *                              INTRODUCTION
 * ============================================================================
 * これまであなたは、スクリーンを振動をさせる複数のイベントを作成し、それらを
 * スイッチなどで操作していませんでしたか？このプラグインを使えばもっと簡単に、
 * 画面を振動させられます。１つプラグインコマンドを呼び出し、 "Shake Screen" を
 * 実行すれば、止まれというまで振動し続けます。
 * ============================================================================
 *                              VERSION HISTORY
 * ============================================================================
 * Version | Description
 * ________|___________________________________________________________________
 * 1.0.0   | Initial [ReStaff] release
 * ============================================================================
 *                              プラグインコマンド
 * ============================================================================
 *  - Shake start
 *    振動が始まります。
 *  - Shake stop
 *    振動が止まります
 *  - Shake toggle
 *    もし振動していれば止まり、そうでなければ振動します。
 *
 * 注意 : スタートもしくは切り替えをした後に、 Shake Screen を一度だけ呼び出す
 *        必要があります。その後どれくらいの強さ/速さかが決められます。
 * ============================================================================
 *                               COMPATIBILITY
 * ============================================================================
 * 新規 :
 *  - <None>
 *
 * 別名 :
 *  - Game_Screen :
 *    - update
 *  - Game_Interpreter :
 *    - pluginCommand
 *
 * 上書き :
 *  - <None>
 * ============================================================================
 */



var Imported = Imported || {};
Imported.Kocka = Imported.Kocka || {};
Imported.Kocka.ShakeForever = {
		version: [1, 0, 0],
	 	aliases: {
        Game_Screen: {
            update: Game_Screen.prototype.update
        },
        Game_Interpreter: {
            pluginCommand: Game_Interpreter.prototype.pluginCommand
        }
	 	}
};



(function(){



//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

Game_Interpreter.prototype.pluginCommand = function(command, args)
{
    Imported.Kocka.ShakeForever.aliases.Game_Interpreter.pluginCommand.apply(this, arguments);
    if(command === "Shake")
    {
        switch(args[0])
        {
            case 'start':
                $gameScreen.shakeForever = true;
                break;
            case 'stop':
                $gameScreen.shakeForever = false;
                break;
            case 'toggle':
                $gameScreen.shakeForever = !$gameScreen.shakeForever;
                break;
        }
    }
}



//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.

Game_Screen.prototype.update = function()
{
    if(this.shakeForever) this._shakeDuration = 2;
    Imported.Kocka.ShakeForever.aliases.Game_Screen.update.apply(this, arguments);
}



})();