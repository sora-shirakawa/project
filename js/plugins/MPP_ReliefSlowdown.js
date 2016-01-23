//=============================================================================
// ReliefSlowdown.js
//=============================================================================
// Copyright (c) 2015 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【MPP】処理落ちを軽減します。
 * @author 木星ペンギン
 * 
 * @help このプラグインには、プラグインコマンドはありません。
 * 
 * アニメーションの表示など、重い処理を行った際の処理落ちを軽減します。
 * 
 * 軽量化プラグインではありません。
 * フレームレートを低下させて、処理落ちを減らすものです。
 * 
 * ================================
 * Version : 1.0
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 */

(function() {

//1107
var _Graphics_initialize = Graphics.initialize;
Graphics.initialize = function(width, height, type) {
    _Graphics_initialize.call(this, width, height, type);
    this._lastTime = 0;
    this._skipCount = this._maxSkip;
};

//1225
Graphics.render = function(stage) {
    var endTime = Date.now();
    var elapsed = endTime - this._lastTime - (this._skipCount + 1) * 18;
    if (this._skipCount === this._maxSkip || elapsed <= 0) {
        this._lastTime = endTime;
        if (stage) {
            this._renderer.render(stage);
        }
        this._skipCount = 0;
        this._rendered = true;
    } else {
        this._skipCount++;
        this._rendered = false;
    }
    this.frameCount++;
};

})();
