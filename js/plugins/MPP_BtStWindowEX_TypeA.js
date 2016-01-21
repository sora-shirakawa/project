//=============================================================================
// MPP_BtStWindowEX_TypeA.js
//=============================================================================
// Copyright (c) 2015 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【MPP】戦闘画面でステータスウィンドウのデザインを変更します。
 * @author 木星ペンギン
 * 
 * @help ※アクティブタイムバトル（MPP_ActiveTimeBattle.js）と併用する場合、
 * 　こちらのプラグインが下になるように導入してください。
 * 
 * 　アクティブタイムバトルと併用した際、
 * 　同じ内容のパラメータはこちらのプラグインが優先されます。
 * 
 * ●【ステータスウィンドウの行数】を変更した場合、
 * 　パーティコマンドやアクターコマンドの行数も変わります。
 * 
 * ●ゲージは縦のグラデーションになります。
 * 
 * ●【MPとTPを重ねて表示】する場合、MPゲージの表示位置に描写されます。
 * 
 * ●敵のATゲージはキャラクターの下に表示されます。
 * 
 * ※注意
 * このプラグインは処理が少し重いです。
 * 環境によって大きく処理落ちすることがあるため、
 * 気になるようであれば導入しないでください。
 * 
 * ================================
 * Version : 1.0
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param Window Row
 * @desc ウィンドウの行数
 * @default 4
 *
 * @param HP Gauge Width
 * @desc HPゲージの幅
 * @default 108
 *
 * @param MP Gauge Width
 * @desc MPゲージの幅
 * @default 88
 *
 * @param TP Gauge Width
 * @desc TPゲージの幅
 * @default 80
 *
 * @param Gauge Height
 * @desc ゲージの高さ
 * @default 14
 *
 * @param MP TP Pile?
 * @desc MPとTPを重ねて表示するかどうか
 * @default true
 *
 * @param Gauge Outline Color
 * @desc ゲージの縁取り色
 * @default 48,48,96
 *
 * @param === ATB ===
 *
 * @param AT Gauge Pos
 * @desc ATゲージの位置
 * (-1:非表示, 0:MP/TPの右, 1:名前の下, 2:キャラの下)
 * @default 0
 * 
 * @param AT Gauge Width
 * @desc ATゲージの幅
 * @default 80
 *
 * @param AT Gauge Height
 * @desc ATゲージの高さ
 * @default 14
 * 
 * @param AT Gauge Oy
 * @desc ATゲージのY座標補正
 * @default 0
 * 
 * @param Enemy AT View?
 * @desc 敵のATゲージを表示するかどうか
 * @default false
 * 
 * @param AT Gauge Opacity
 * @desc キャラの下に表示されるATゲージの不透明度
 * @default 192
 * 
 */

(function() {

var parameters = PluginManager.parameters('MPP_BtStWindowEX_TypeA');
var MPPlugin = {
    ATB_Plugin:$plugins.some(function(plugin) {
        return (plugin.name === 'MPP_ActiveTimeBattle' && plugin.status);
    }),
    
    windowRow:Math.max(Number(parameters['Window Row'] || 4), 1),
    hpGaugeWidth:Number(parameters['HP Gauge Width'] || 108),
    mpGaugeWidth:Number(parameters['MP Gauge Width'] || 88),
    tpGaugeWidth:Number(parameters['TP Gauge Width'] || 80),
    gaugeHeight:Number(parameters['Gauge Height'] || 14),
    pileMpTp:parameters['MP TP Pile?'] === 'true',
    gaugeOutlineColor:'rgb(%1)'.format(parameters['Gauge Outline Color'] || '48,48,96'),
    
    // === ATB ===
    atGaugePos:Number(parameters['AT Gauge Pos'] || 0),
    atGaugeWidth:Number(parameters['AT Gauge Width'] || 80),
    atGaugeHeight:Number(parameters['AT Gauge Height'] || 14),
    atGaugeOy:Number(parameters['AT Gauge Oy'] || 0),
    enemyAtView:parameters['Enemy AT View?'] === 'true',
    atGaugeOpacity:Number(parameters['AT Gauge Opacity'] || 192),
    atGaugeBackColor:'rgb(32,32,64)'
    
};

var Alias = {};

//-----------------------------------------------------------------------------
// Draw_Actors

function Draw_Actors() {
    throw new Error('This is a static class');
}

Draw_Actors._actors = {};

Draw_Actors.getActor = function(actor) {
    var actorId = actor.actorId();
    var drawActor = this._actors[actorId];
    if (!drawActor) {
        drawActor = new Game_DrawActor(actor);
        this._actors[actorId] = drawActor;
    }
    return drawActor;
};

Draw_Actors.update = function() {
    for (var id in this._actors) {
        this._actors[id].update();
    }
};

Draw_Actors.start = function() {
    for (var id in this._actors) {
        this._actors[id].start();
    }
};

Draw_Actors.clear = function() {
    this._actors = {};
};

//-----------------------------------------------------------------------------
// Game_DrawActor

function Game_DrawActor() {
    this.initialize.apply(this, arguments);
}
Object.defineProperties(Game_DrawActor.prototype, {
    hp: { get: function() { return this._hp; }, configurable: true },
    mp: { get: function() { return this._mp; }, configurable: true },
    tp: { get: function() { return this._tp; }, configurable: true },
    mhp: { get: function() { return this._mhp; }, configurable: true },
    mmp: { get: function() { return this._mmp; }, configurable: true }
});

Game_DrawActor.prototype.initialize = function(actor) {
    this._actor = actor;
    this._hp = actor.hp;
    this._mp = actor.mp;
    this._tp = 0;
    this._targetHp = this._hp;
    this._targetMp = this._mp;
    this._targetTp = this._tp;
    this._mhp = actor.mhp;
    this._mmp = actor.mmp;
    this._targetMhp = this._mhp;
    this._targetMmp = this._mmp;
    this._duration = 0;
};

Game_DrawActor.prototype.start = function() {
    this._targetHp = this._actor.hp;
    this._targetMp = this._actor.mp;
    this._targetTp = this._actor.tp;
    this._targetMhp = this._actor.mhp;
    this._targetMmp = this._actor.mmp;
    if (this._hp !== this._targetHp || this._mp !== this._targetMp ||
            this._tp !== this._targetTp || this._mhp !== this._targetMhp ||
            this._mmp !== this._targetMmp) {
        this._duration = 60;
    }
};

Game_DrawActor.prototype.update = function() {
    if (this._duration > 0) {
        this._duration--;
        this._hp = this.step(this._duration, this._targetHp, this._hp);
        this._mp = this.step(this._duration, this._targetMp, this._mp);
        this._tp = this.step(this._duration, this._targetTp, this._tp);
        this._mhp = this.step(this._duration, this._targetMhp, this._mhp);
        this._mmp = this.step(this._duration, this._targetMmp, this._mmp);
    }
};

Game_DrawActor.prototype.step = function(d, t, n) {
    return Math.round(t + (n - t) * Math.pow(d, 2) / Math.pow(d + 1, 2));
};

Sprite_GradGauge.prototype.isGrad = function() {
    return this._duration > 0;
};

Game_DrawActor.prototype.isDead = function() {
    return this._actor.isDead();
};

Game_DrawActor.prototype.isDying = function() {
    return this._actor.isDying();
};

Game_DrawActor.prototype.hpRate = function() {
    return this._hp / this._mhp;
};

Game_DrawActor.prototype.mpRate = function() {
    return this._mp / this._mmp;
};

Game_DrawActor.prototype.tpRate = function() {
    return this._tp / 100;
};

//-----------------------------------------------------------------------------
// Sprite_GradGauge

function Sprite_GradGauge() {
    this.initialize.apply(this, arguments);
}

Sprite_GradGauge.prototype = Object.create(Sprite.prototype);
Sprite_GradGauge.prototype.constructor = Sprite_GradGauge;

Sprite_GradGauge.prototype.initialize = function(width, height, color1, color2, backColor, mirror) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(width, height);
    this._mirror = mirror || false;
    this._gaugeWidth = width - height - 2;
    this._gaugeBitmap = this.createGaugeBitmap(this._gaugeWidth, height, color1, color2);
    this._backBitmap = this.createBackBitmap(width, height, backColor, this._mirror);
    this._animeCount = 0;
    this._drawCount = 0;
    this._rate = 0;
};

Sprite_GradGauge.prototype.createGaugeBitmap = function(width, height, color1, color2) {
    var bitmap = new Bitmap(width * 2 + 64, height - 2);
    var y = Math.floor(bitmap.height / 2);
    bitmap.gradientFillRect(0, 0, bitmap.width, y, color1, color2, true);
    bitmap.gradientFillRect(0, y, bitmap.width, bitmap.height - y, color2, color1, true);
    var color3 = 'rgba(255,255,255,0)';
    var color4 = 'rgba(255,255,255,1.0)';
    bitmap.gradientFillRect(width, 0, 32, bitmap.height, color3, color4);
    bitmap.gradientFillRect(width + 32, 0, 32, bitmap.height, color4, color3);
    return bitmap;
};

Sprite_GradGauge.prototype.createBackBitmap = function(width, height, backColor, mirror) {
    var bitmap = new Bitmap(width, height);
    var outlineColor = MPPlugin.gaugeOutlineColor;
    var x = mirror ? -2 : height - 3;
    var y = 0;
    var backWidth = width - height - 2;
    for (var i = 0; i < height; i++) {
        var mainColor = (i === 0 || i === height - 1 ? outlineColor : backColor);
        bitmap.fillRect(x + 1, y, 1, 1, outlineColor);
        bitmap.fillRect(x + 2, y, backWidth, 1, mainColor);
        bitmap.fillRect(x + backWidth + 2, y, 1, 1, outlineColor);
        bitmap.paintOpacity = 128;
        bitmap.fillRect(x, y, 1, 1, outlineColor);
        bitmap.fillRect(x + backWidth + 3, y, 1, 1, outlineColor);
        bitmap.paintOpacity = 255;
        mirror ? x++ : x --;
        y++;
    }
    return bitmap;
};

Sprite_GradGauge.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this.visible) {
        return;
    }
    if (this._animeCount > 0) {
        this._animeCount--;
    } else {
        this._animeCount = Math.floor(this._gaugeWidth * (1 + this._rate) / 2) + 32;
    }
    if (this._drawCount < 4) {
        this._drawCount++;
    } else {
        this.drawGauge();
    }
};

Sprite_GradGauge.prototype.drawGauge = function(rate) {
    this.visible = true;
    this._rate = rate || this._rate;
    this._drawCount = 0;
    var fillW = Math.floor(this._gaugeWidth * this._rate);
    var drawBitmap = this._backBitmap;
    this.bitmap.blt(drawBitmap, 0, 0, drawBitmap.width, drawBitmap.height, 0, 0);
    drawBitmap = this._gaugeBitmap;
    var gaugeX = 0;
    var gaugeY = 0;
    var drawX = Math.min(this._animeCount * 2, drawBitmap.width - this._gaugeWidth);
    if (!this._mirror) {
        gaugeX += drawBitmap.height + 1;
    }
    for (var i = 0; i < drawBitmap.height; i++) {
        this._mirror ? gaugeX++ : gaugeX--;
        gaugeY++;
        this.bitmap.blt(drawBitmap, drawX, i, fillW, 1, gaugeX, gaugeY);
    }
};

//-----------------------------------------------------------------------------
// Sprite_AtGauge

if (MPPlugin.ATB_Plugin) {

function Sprite_AtGauge() {
    this.initialize.apply(this, arguments);
}

Sprite_AtGauge.prototype = Object.create(Sprite.prototype);
Sprite_AtGauge.prototype.constructor = Sprite_AtGauge;

Sprite_AtGauge.prototype.initialize = function(width, height) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(width, height);
    this._backColor = MPPlugin.atGaugeBackColor;
    this._subject = null;
    this._blinkCount = 0;
};

Sprite_AtGauge.prototype.setBattler = function(subject) {
    if (this._subject !== subject) {
        this._subject = subject;
        if (!this._subject) {
            this.bitmap.clear();
        }
    }
};

Sprite_AtGauge.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this._subject || Graphics.frameCount % 2 !== 0) {
        return;
    }
    if (this._subject.isStandby()) {
        this._blinkCount++;
        this._blinkCount %= 12;
    } else {
        this._blinkCount = 0;
    }
    if (this.visible) {
        this.drawGauge();
    }
};

Sprite_AtGauge.prototype.drawGauge = function() {
    this.visible = true;
    var width = this.width;
    var height = this.height;
    var gaugeW = width - 2;
    var gaugeH = height - 2;
    var outlineColor = MPPlugin.gaugeOutlineColor;
    this.bitmap.clear();
    this.bitmap.fillRect(0, 0, width, 1, outlineColor);
    this.bitmap.fillRect(0, 1, 1, height - 2, outlineColor);
    this.bitmap.fillRect(width - 1, 1, 1, height - 2, outlineColor);
    this.bitmap.fillRect(0, height - 1, width, 1, outlineColor);
    this.bitmap.fillRect(1, 1, gaugeW, gaugeH, this._backColor);
    
    var rate = this._subject.atGaugeRate();
    var color1 = this._subject.atGaugeColor1();
    var color2 = this._subject.atGaugeColor2();
    var fillW = Math.floor(gaugeW * rate);
    var halfH = Math.floor(gaugeH / 2);
    this.bitmap.paintOpacity = 195 + Math.abs(6 - this._blinkCount) * 10;
    this.bitmap.gradientFillRect(1, 1, fillW, halfH, color1, color2, true);
    this.bitmap.gradientFillRect(1, 1 + halfH, fillW, gaugeH - halfH, color2, color1, true);
    this.bitmap.paintOpacity *= gaugeW * rate % 1;
    this.bitmap.gradientFillRect(1 + fillW, 1, 1, halfH, color1, color2, true);
    this.bitmap.gradientFillRect(1 + fillW, 1 + halfH, 1, gaugeH - halfH, color2, color1, true);
    this.bitmap.paintOpacity = 255;
};

} // if (MPPlugin.ATB_Plugin)

//-----------------------------------------------------------------------------
// Sprite_Icons

function Sprite_Icons() {
    this.initialize.apply(this, arguments);
}

Sprite_Icons.prototype = Object.create(Sprite.prototype);
Sprite_Icons.prototype.constructor = Sprite_Icons;

Sprite_Icons.prototype.initialize = function(width) {
    Sprite.prototype.initialize.call(this);
    this.bitmap = new Bitmap(1, 1);
    this._subject = null;
    this._icons = [];
    this._iconsMax = Math.floor(width / Window_Base._iconWidth);
    this._animeCount = 0;
};

Sprite_Icons.prototype.setIcons = function(icons) {
    this.visible = true;
    if (!this._icons.equals(icons)) {
        this._icons = icons;
        this._animeCount = 0;
        this.setIconFrame();
    }
};

Sprite_Icons.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (!this.visible) {
        this._animeCount = 0;
        return;
    } else if (Graphics.frameCount % 2 === 0) {
        return;
    }
    var size = this._icons.length;
    if (size > this._iconsMax) {
        this._animeCount++;
        var max = (size - this._iconsMax + 2) * Window_Base._iconWidth;
        if (this._animeCount >= max) {
            this._animeCount = 0;
        }
        this.setIconFrame();
    }
};

Sprite_Icons.prototype.redrawIcons = function() {
    this.bitmap.clear();
    this.bitmap.resize(Window_Base._iconWidth * this._icons.length, Window_Base._iconHeight);
    for (var i = 0; i < this._icons.length; i++) {
        this.drawIcon(this._icons[i], Window_Base._iconWidth * i, 0);
    }
    this.setIconFrame();
};

Sprite_Icons.prototype.setIconFrame = function() {
    var x = this._animeCount - Window_Base._iconWidth;
    x = Math.min(x, (this._icons.length - this._iconsMax) * Window_Base._iconWidth);
    x = Math.max(x, 0);
    var width = this._iconsMax * Window_Base._iconWidth;
    this.setFrame(x, 0, width, Window_Base._iconHeight);
};

Sprite_Icons.prototype.drawIcon = function(iconIndex, x, y) {
    var iconSet = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    this.bitmap.blt(iconSet, sx, sy, pw, ph, x, y);
};

//-----------------------------------------------------------------------------
// Spriteset_Battle

if (MPPlugin.ATB_Plugin) {

//2401
Alias.SpsetBa_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
Spriteset_Battle.prototype.createLowerLayer = function() {
    Alias.SpsetBa_createLowerLayer.call(this);
    this.createHubSprite();
    this.createAtGauge();
};

//2416
Alias.SpsetBa_update = Spriteset_Battle.prototype.update;
Spriteset_Battle.prototype.update = function() {
    Alias.SpsetBa_update.call(this);
    this.updateAtGauge();
};
Spriteset_Battle.prototype.createHubSprite = function() {
    var width = Graphics.boxWidth;
    var height = Graphics.boxHeight;
    var x = (Graphics.width - width) / 2;
    var y = (Graphics.height - height) / 2;
    this._hubSprite = new Sprite();
    this._hubSprite.setFrame(x, y, width, height);
    this._hubSprite.x = x;
    this._hubSprite.y = y;
    this._baseSprite.addChild(this._hubSprite);
};

Spriteset_Battle.prototype.createAtGauge = function() {
    var width = MPPlugin.atGaugeWidth;
    var height = MPPlugin.atGaugeHeight;
    if (MPPlugin.enemyAtView) {
        this._enemyAtSprites = [];
        for (var i = 0; i < this._enemySprites.length; i++) {
            var sprite = new Sprite_AtGauge(width, height);
            sprite.anchor.x = 0.5;
            sprite.anchor.y = MPPlugin.atGaugeOy / sprite.height;
            sprite.opacity = MPPlugin.atGaugeOpacity;
            this._enemyAtSprites[i] = sprite;
            this._hubSprite.addChild(sprite);
        }
    }
    if (MPPlugin.atGaugePos === 2) {
        this._actorAtSprites = [];
        for (var j = 0; j < this._actorSprites.length; j++) {
            var sprite = new Sprite_AtGauge(width, height);
            sprite.anchor.x = 0.5;
            sprite.anchor.y = MPPlugin.atGaugeOy / sprite.height;
            sprite.opacity = MPPlugin.atGaugeOpacity;
            this._actorAtSprites[j] = sprite;
            this._hubSprite.addChild(sprite);
        }
    }
};

Spriteset_Battle.prototype.updateAtGauge = function() {
    var sprite, gauge;
    if (MPPlugin.enemyAtView) {
        for (var i = 0; i < this._enemyAtSprites.length; i++) {
            sprite = this._enemySprites[i];
            gauge = this._enemyAtSprites[i];
            gauge.setBattler(sprite._battler);
            gauge.x = sprite.x;
            gauge.y = sprite.y;
            gauge.visible = (sprite.visible && sprite.opacity > 0);
        }
    }
    if (MPPlugin.atGaugePos === 2) {
        for (var j = 0; j < this._actorAtSprites.length; j++) {
            sprite = this._actorSprites[j];
            gauge = this._actorAtSprites[j];
            gauge.setBattler(sprite._battler);
            gauge.x = sprite.x;
            gauge.y = sprite.y;
            gauge.visible = (sprite.visible && sprite.opacity > 0);
        }
    }
};

} // if (MPPlugin.ATB_Plugin)

//-----------------------------------------------------------------------------
// Window_PartyCommand

//5332
Window_PartyCommand.prototype.numVisibleRows = function() {
    return MPPlugin.windowRow;
};

//-----------------------------------------------------------------------------
// Window_ActorCommand

//5374
Window_ActorCommand.prototype.numVisibleRows = function() {
    return MPPlugin.windowRow;
};

//-----------------------------------------------------------------------------
// Window_BattleStatus

//5450
Alias.WiBaSt_initialize = Window_BattleStatus.prototype.initialize;
Window_BattleStatus.prototype.initialize = function() {
    this._gaugeSprites = {};
    Alias.WiBaSt_initialize.call(this);
};

Window_BattleStatus.prototype.drawActorName = function(actor, x, y, width) {
    Window_Base.prototype.drawActorName.call(this, actor, x, y, width);
    if (this.isDrawAt(1)) {
        this.drawActorAt(actor, x, y, MPPlugin.atGaugeWidth);
    }
};

Window_BattleStatus.prototype.drawActorIcons = function(actor, x, y, width) {
    width = width || 144;
    var sprite = this.getIconsSprite(x, y, width);
    sprite.setIcons(actor.allIcons());
    this.setupSpritePos(sprite, x, y);
};

Window_BattleStatus.prototype.getIconsSprite = function(x, y, width) {
    var sprite = this.getSprite(x, y);
    if (!sprite) {
        var key = this.getSpriteKey(x, y);
        sprite = new Sprite_Icons(width);
        this._gaugeSprites[key] = sprite;
        this.addChild(sprite);
    }
    return sprite;
};

Window_BattleStatus.prototype.getSpriteKey = function(x, y) {
    return x + ',' + y;
};

Window_BattleStatus.prototype.getSprite = function(x, y) {
    var key = this.getSpriteKey(x, y);
    return this._gaugeSprites[key];
};

//5468
Window_BattleStatus.prototype.numVisibleRows = function() {
    return MPPlugin.windowRow;
};

//5476
Alias.WiBaSt_refresh = Window_BattleStatus.prototype.refresh;
Window_BattleStatus.prototype.refresh = function() {
    for (var key in this._gaugeSprites) {
        this._gaugeSprites[key].visible = false;
    }
    Draw_Actors.start();
    Alias.WiBaSt_refresh.call(this);
};

//5500
Window_BattleStatus.prototype.gaugeAreaWidth = function() {
    var width = 0;
    if (this.isDrawHp()) {
        width += MPPlugin.hpGaugeWidth + 15;
    }
    if (this.isDrawMp()) {
        width += MPPlugin.mpGaugeWidth + 15;
    }
    if (this.isDrawTp()) {
        width += MPPlugin.tpGaugeWidth + 15;
    }
    if (this.isDrawAt(0)) {
        width += MPPlugin.atGaugeWidth + 15;
    }
    return Math.max(width - 15, 0);
};

Window_BattleStatus.prototype.isDrawHp = function() {
    return MPPlugin.hpGaugeWidth > 0;
};

Window_BattleStatus.prototype.isDrawMp = function() {
    return MPPlugin.mpGaugeWidth > 0;
};

Window_BattleStatus.prototype.isDrawTp = function() {
    return $dataSystem.optDisplayTp && MPPlugin.tpGaugeWidth > 0 &&
            !MPPlugin.pileMpTp;
};

Window_BattleStatus.prototype.isDrawAt = function(pos) {
    return MPPlugin.ATB_Plugin && MPPlugin.atGaugeWidth > 0 &&
            MPPlugin.atGaugePos === pos;
};

Window_BattleStatus.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    this.updateGauge();
};

Window_BattleStatus.prototype.updateGauge = function() {
    if (this.visible) {
        var topIndex = this.topIndex();
        for (var i = 0; i < this.maxPageItems(); i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                var actor = $gameParty.battleMembers()[index];
                this.checkActorGauge(actor, index);
            }
        }
    }
};

Window_BattleStatus.prototype.checkActorGauge = function(actor, index) {
    var rect = this.gaugeAreaRect(index);
    var drawActor = Draw_Actors.getActor(actor);
    var sprite;
    if (this.isDrawHp()) {
        sprite = this.getSprite(rect.x, rect.y);
        if (sprite && drawActor.hpRate() !== sprite._rate) {
            this.contents.clearRect(rect.x - 2, rect.y, MPPlugin.hpGaugeWidth + 4, this.lineHeight());
            this.drawActorHp(drawActor, rect.x, rect.y, MPPlugin.hpGaugeWidth);
        }
        rect.x += MPPlugin.hpGaugeWidth + 15;
    }
    if (this.isDrawMp()) {
        if (MPPlugin.pileMpTp) {
            sprite = this.getSprite(rect.x, rect.y - MPPlugin.gaugeHeight + 6);
            if (sprite && drawActor.mpRate() !== sprite._rate) {
                sprite.drawGauge(drawActor.mpRate());
            }
            sprite = this.getSprite(rect.x + 10, rect.y);
            if (sprite && drawActor.tpRate() !== sprite._rate) {
                sprite.drawGauge(drawActor.tpRate());
            }
        } else {
            sprite = this.getSprite(rect.x, rect.y);
            if (sprite && drawActor.mpRate() !== sprite._rate) {
                this.contents.clearRect(rect.x - 2, rect.y, MPPlugin.mpGaugeWidth + 4, this.lineHeight());
                this.drawActorMp(drawActor, rect.x, rect.y, MPPlugin.mpGaugeWidth);
            }
        }
        rect.x += MPPlugin.mpGaugeWidth + 15;
    }
    if (this.isDrawTp()) {
        sprite = this.getSprite(rect.x, rect.y);
        if (sprite && drawActor.tpRate() !== sprite._rate) {
            this.contents.clearRect(rect.x - 2, rect.y, MPPlugin.tpGaugeWidth + 4, this.lineHeight());
            this.drawActorTp(drawActor, rect.x, rect.y, MPPlugin.tpGaugeWidth);
        }
    }
};

//5509
Window_BattleStatus.prototype.drawGaugeArea = function(rect, actor) {
    var plusX = 0;
    var drawActor = Draw_Actors.getActor(actor);
    if (this.isDrawHp()) {
        this.drawActorHp(drawActor, rect.x + plusX, rect.y, MPPlugin.hpGaugeWidth);
        plusX += MPPlugin.hpGaugeWidth + 15;
    }
    if (this.isDrawMp()) {
        if (MPPlugin.pileMpTp) {
            this.drawActorMpTp(drawActor, rect.x + plusX, rect.y, MPPlugin.mpGaugeWidth);
        } else {
            this.drawActorMp(drawActor, rect.x + plusX, rect.y, MPPlugin.mpGaugeWidth);
        }
        plusX += MPPlugin.mpGaugeWidth + 15;
    }
    if (this.isDrawTp()) {
        this.drawActorTp(drawActor, rect.x + plusX, rect.y, MPPlugin.tpGaugeWidth);
        plusX += MPPlugin.tpGaugeWidth + 15;
    }
    if (this.isDrawAt(0) ) {
        this.drawActorAt(actor, rect.x + plusX, rect.y, MPPlugin.atGaugeWidth);
    }
};

Window_BattleStatus.prototype.drawGauge = function(x, y, width, rate, color1, color2, mirror) {
    mirror = mirror || false;
    var sprite = this.getSprite(x, y);
    if (!sprite) {
        var key = this.getSpriteKey(x, y);
        var height = MPPlugin.gaugeHeight;
        sprite = new Sprite_GradGauge(width + 12, height, color1, color2,
                                        this.gaugeBackColor(), mirror);
        this._gaugeSprites[key] = sprite;
        this.addChildToBack(sprite);
    }
    this.setupSpritePos(sprite, x - 6, y);
    sprite.drawGauge(rate);
};

Window_BattleStatus.prototype.setupSpritePos = function(sprite, x, y) {
    var padding = this.standardPadding();
    sprite.x = x + padding;
    sprite.y = y + padding + this.lineHeight() - 2 - sprite.height;
};

Window_BattleStatus.prototype.drawActorMpTp = function(actor, x, y, width) {
    width = (width || 186) - 10;
    var color1 = this.mpGaugeColor1();
    var color2 = this.mpGaugeColor2();
    var drawY = y - MPPlugin.gaugeHeight + 6;
    this.drawGauge(x, drawY, width, actor.mpRate(), color1, color2);
    color1 = this.tpGaugeColor1();
    color2 = this.tpGaugeColor2();
    this.drawGauge(x + 10, y, width, actor.tpRate(), color1, color2, true);
    this.contents.fontSize = 24;
    this.changeTextColor(this.systemColor());
    this.contents.drawText(TextManager.tpA, x, y + 1, 32, 24);
    this.contents.drawText(TextManager.mpA, x + 22, y + 10, 32, 24);
    this.contents.fontSize = this.standardFontSize();
};

Alias.WiBaSt_drawActorAt = Window_BattleStatus.prototype.drawActorAt;
Window_BattleStatus.prototype.drawActorAt = function(actor, x, y, width) {
    Alias.WiBaSt_drawActorAt.call(this, actor, x, y, width);
    var sprite = this.getSprite(x, y);
    sprite.visible = true;
    sprite.setBattler(actor);
};

Window_BattleStatus.prototype.drawAtGauge = function(x, y, width) {
    var sprite = this.getSprite(x, y);
    if (!sprite) {
        var key = this.getSpriteKey(x, y);
        sprite = new Sprite_AtGauge(width, MPPlugin.atGaugeHeight);
        this._gaugeSprites[key] = sprite;
        this.addChildToBack(sprite);
    }
    this.setupSpritePos(sprite, x, y);
};

//-----------------------------------------------------------------------------
// Window_BattleActor

//5548
//Alias.WiBaAc_show = Window_BattleActor.prototype.show;
//Window_BattleActor.prototype.show = function() {
//    Alias.WiBaAc_show.call(this);
//    this.resetAnime();
//};
//
//-----------------------------------------------------------------------------
// Window_BattleEnemy

//5596
Window_BattleEnemy.prototype.numVisibleRows = function() {
    return MPPlugin.windowRow;
};

//-----------------------------------------------------------------------------
// Window_AtbSkillStatus

if (MPPlugin.ATB_Plugin) {

Alias.WiAtSkSt_initialize = Window_AtbSkillStatus.prototype.initialize;
Window_AtbSkillStatus.prototype.initialize = function(x, y, width, height) {
    this._gaugeSprites = {};
    Alias.WiAtSkSt_initialize.call(this, x, y, width, height);
};

Window_AtbSkillStatus.prototype.getSpriteKey = function(x, y) {
    return Window_BattleStatus.prototype.getSpriteKey.call(this, x, y);
};

Window_AtbSkillStatus.prototype.getSprite = function(x, y) {
    return Window_BattleStatus.prototype.getSprite.call(this, x, y);
};

Window_AtbSkillStatus.prototype.setupSpritePos = function(sprite, x, y) {
    Window_BattleStatus.prototype.setupSpritePos.call(this, sprite, x, y);
};

Window_AtbSkillStatus.prototype.update = function() {
    Window_Base.prototype.update.call(this);
    this.updateGauge();
};

Window_AtbSkillStatus.prototype.updateGauge = function() {
    if (this.visible && this._actor) {
        var width = this.contentsWidth() - 8;
        var drawActor = Draw_Actors.getActor(this._actor);
        var sprite = this.getSprite(4, 0);
        if (sprite && drawActor.mpRate() !== sprite._rate) {
            this.contents.clearRect(2, 0, width + 4, this.lineHeight());
            this.drawActorMp(drawActor, 4, 0, width);
        }
        if ($dataSystem.optDisplayTp) {
            sprite = this.getSprite(4, this.lineHeight());
            if (sprite && drawActor.tpRate() !== sprite._rate) {
                this.contents.clearRect(2, this.lineHeight(), width + 4, this.lineHeight());
                this.drawActorTp(drawActor, 4, this.lineHeight(), width);
            }
        }
    }
};

Window_AtbSkillStatus.prototype.refresh = function() {
    this.contents.clear();
    if (this._actor) {
        var width = this.contentsWidth() - 8;
        if ($dataSystem.optDisplayTp) {
            this.drawActorMp(this._actor, 4, 0, width);
            this.drawActorTp(this._actor, 4, this.lineHeight(), width);
        } else {
            this.drawActorMp(this._actor, 4, 0, width);
        }
    }
};

Window_AtbSkillStatus.prototype.getSprite = function(x, y) {
    return Window_BattleStatus.prototype.getSprite.call(this, x, y)
};

Window_AtbSkillStatus.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    Window_BattleStatus.prototype.drawGauge.call(this, x, y, width, rate, color1, color2);
};

} // if (MPPlugin.ATB_Plugin)

//-----------------------------------------------------------------------------
// Scene_Battle

//2035
Alias.ScBa_update = Scene_Battle.prototype.update;
Scene_Battle.prototype.update = function() {
    Draw_Actors.update();
    Alias.ScBa_update.call(this);
};

//2146
Alias.ScBa_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
    Draw_Actors.clear();
    Alias.ScBa_createAllWindows.call(this);
};


})();
