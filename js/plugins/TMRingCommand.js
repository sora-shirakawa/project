﻿//=============================================================================
// TMVplugin - リングコマンド
// 作者: tomoaky (http://hikimoki.sakura.ne.jp/)
// Version: 0.21b
// 最終更新日: 2015/12/29
//=============================================================================

/*:
 * @plugindesc マップシーンで使えるリングコマンドを追加します。
 *
 * @author tomoaky (http://hikimoki.sakura.ne.jp/)
 *
 * @param useEscape
 * @desc Escキーなどによるメニュー処理を乗っ取る
 * 初期値: 0 ( 1 にするとデフォルトのメニューは使えません)
 * @default 0
 *
 * @param saveLastIndex
 * @desc 最後に選択したコマンドを記憶する
 * 初期値: 0 ( 1 で前回決定したコマンドが初期位置になります)
 * @default 0
 *
 * @param openResetIndex
 * @desc リングコマンド開閉のたびにカーソル位置を初期化する
 * 初期値: 0 ( 1 で開閉のたびに初期化)
 * @default 0
 *
 * @param openGoldWindow
 * @desc リングコマンドと一緒に所持金ウィンドウも開閉する
 * 初期値: 1 ( 0 で開閉しない)
 * @default 1
 *
 * @param goldWindowX
 * @desc 所持金ウィンドウのＸ座標
 * 初期値: 576
 * @default 576
 *
 * @param goldWindowY
 * @desc 所持金ウィンドウのＹ座標
 * 初期値: 0
 * @default 0
 *
 * @param seOpenCommand
 * @desc リングコマンドを開くときに鳴らす効果音
 * 初期値: {name: "Cancel2", volume: 90, pitch: 100, pan: 0}
 * @default {name: "Cancel2", volume: 90, pitch: 100, pan: 0}
 *
 * @param seCloseCommand
 * @desc リングコマンドを閉じるときに鳴らす効果音
 * 初期値: {name: "Cancel2", volume: 90, pitch: 100, pan: 0}
 * @default {name: "Cancel2", volume: 90, pitch: 100, pan: 0}
 *
 * @param commandIconItem
 * @desc アイテムコマンドのアイコン番号
 * 初期値: 176
 * @default 176
 *
 * @param commandIconSkill
 * @desc スキルコマンドのアイコン番号
 * 初期値: 76
 * @default 76
 *
 * @param commandIconEquip
 * @desc 装備コマンドのアイコン番号
 * 初期値: 135
 * @default 135
 *
 * @param commandIconStatus
 * @desc ステータスコマンドのアイコン番号
 * 初期値: 84
 * @default 84
 *
 * @param commandIconFormation
 * @desc 並び替えコマンドのアイコン番号
 * 初期値: 75
 * @default 75
 *
 * @param commandIconOptions
 * @desc オプションコマンドのアイコン番号
 * 初期値: 83
 * @default 83
 *
 * @param commandIconSave
 * @desc セーブコマンドのアイコン番号
 * 初期値: 225
 * @default 225
 *
 * @param commandIconGameEnd
 * @desc ゲーム終了コマンドのアイコン番号
 * 初期値: 82
 * @default 82
 *
 * @param rotateDuration
 * @desc アイコンの移動にかける時間
 * 初期値: 4（フレーム数）
 * @default 4
 *
 * @param iconDistX
 * @desc アイコンの広がり（横方向）
 * 初期値: 16
 * @default 16
 *
 * @param iconDistY
 * @desc アイコンの広がり（縦方向）
 * 初期値: 12
 * @default 12
 *
 * @help
 * マップシーンで Ctrl または Alt を押している間、リングコマンドが表示され
 * ←, → でリングの回転、Z, Enter, Space で各シーンへ移行できます。
 *
 * useEscape に 1 を設定すると Ctrl(Alt) での操作は無効化され、
 * デフォルトメニューと同様に Esc / X / Insert / Num 0 / 右クリック などで
 * リングコマンドを開閉することができるようになります。
 * この場合、キーを押しっぱなしにする必要はありません。
 *
 * マウスで操作する場合は、プレイヤーよりも左あるいは右をクリックすると
 * それぞれの方向へリングを回転させることができ、プレイヤーの近くを
 * クリックすれば正面にあるコマンドアイコンに対応するシーンへ移行します。
 * クリックの座標判定は横方向のみです、画面のどこをクリックしても反応します。
 *
 * プラグインコマンドはありません。
 * 
 */

var Imported = Imported || {};
Imported.TMRingCommand = true;

(function() {

  var parameters = PluginManager.parameters('TMRingCommand');
  var useEscape      = parameters['useEscape'] === '1' ? true : false;
  var saveLastIndex  = parameters['saveLastIndex'] === '1' ? true : false;
  var openResetIndex = parameters['openResetIndex'] === '1' ? true : false;
  var openGoldWindow = parameters['openGoldWindow'] === '1' ? true : false;
  var goldWindowX = Number(parameters['goldWindowX']);
  var goldWindowY = Number(parameters['goldWindowY']);
  var seOpenCommand = (new Function("return " + parameters['seOpenCommand']))();
  var seCloseCommand = (new Function("return " + parameters['seCloseCommand']))();
  var commandIcon = {};
  commandIcon['item']      = Number(parameters['commandIconItem']);
  commandIcon['skill']     = Number(parameters['commandIconSkill']);
  commandIcon['equip']     = Number(parameters['commandIconEquip']);
  commandIcon['status']    = Number(parameters['commandIconStatus']);
  commandIcon['formation'] = Number(parameters['commandIconFormation']);
  commandIcon['options']   = Number(parameters['commandIconOptions']);
  commandIcon['save']      = Number(parameters['commandIconSave']);
  commandIcon['gameEnd']   = Number(parameters['commandIconGameEnd']);
  var rotateDuration       = Number(parameters['rotateDuration']);
  var iconDistX            = Number(parameters['iconDistX']);
  var iconDistY            = Number(parameters['iconDistY']);
  
  //-----------------------------------------------------------------------------
  // Game_Temp
  //
  
  Game_Temp.prototype.isRingCommandVisible = function() {
    if (this._ringCommandVisible === undefined) {
      this._ringCommandVisible = false;
    }
    return this._ringCommandVisible;
  };
  
  Game_Temp.prototype.setRingCommandVisible = function(flag) {
    this._ringCommandVisible = flag;
  };
  
  Game_Temp.prototype.ringCommandLastIndex = function() {
    if (this._ringCommandLastIndex === undefined) {
      this._ringCommandLastIndex = 0;
    }
    return this._ringCommandLastIndex;
  };
  
  Game_Temp.prototype.setRingCommandLastIndex = function(index) {
    this._ringCommandLastIndex = index;
  };
  
  //-----------------------------------------------------------------------------
  // Game_Player
  //
  
  var _Game_Player_canMove = Game_Player.prototype.canMove;
  Game_Player.prototype.canMove = function() {
    if ($gameTemp.isRingCommandVisible()) {
      return false;
    }
    return _Game_Player_canMove.call(this);
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_TMRingCommandIcon
  //
  
  function Sprite_TMRingCommandIcon() {
    this.initialize.apply(this, arguments);
  }

  Sprite_TMRingCommandIcon.prototype = Object.create(Sprite.prototype);
  Sprite_TMRingCommandIcon.prototype.constructor = Sprite_TMRingCommandIcon;

  Sprite_TMRingCommandIcon.prototype.initialize = function(name) {
    Sprite.prototype.initialize.call(this);
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._commandName = name;
    this.bitmap = ImageManager.loadSystem('IconSet');
    var bx = commandIcon[name] % 16 * Window_Base._iconWidth;
    var by = Math.floor(commandIcon[name] / 16) * Window_Base._iconHeight;
    this.setFrame(bx, by, Window_Base._iconWidth, Window_Base._iconHeight);
    this._targetPosAngle = 0;
    this._posAngle = 0;
  };
  
  Sprite_TMRingCommandIcon.prototype.setIndex = function(index) {
    this._targetPosAngle = Math.PI * 2 / this.parent._commandSprites.length * index;
    var r = this._targetPosAngle - this._posAngle;
    r -= Math.floor(r / (Math.PI * 2)) * (Math.PI * 2);
    if (r > Math.PI) {
      r -= Math.PI * 2;
    }
    this._rotationCount = rotateDuration;
    this._va = r / this._rotationCount;
  };

  Sprite_TMRingCommandIcon.prototype.name = function() {
    return this._commandName;
  };
  
  Sprite_TMRingCommandIcon.prototype.isEnabled = function() {
    switch (this._commandName) {
    case 'save':
      return this.isSaveEnabled();
    case 'options':
      return this.isOptionsEnabled();
    case 'gameEnd':
      return this.isGameEndEnabled();
    default:
      return this.areMainCommandsEnabled();
    }
  };
  
  Sprite_TMRingCommandIcon.prototype.areMainCommandsEnabled = function() {
    return $gameParty.exists();
  };

  Sprite_TMRingCommandIcon.prototype.isFormationEnabled = function() {
    return $gameParty.size() >= 2 && $gameSystem.isFormationEnabled();
  };

  Sprite_TMRingCommandIcon.prototype.isOptionsEnabled = function() {
    return true;
  };

  Sprite_TMRingCommandIcon.prototype.isSaveEnabled = function() {
    return !DataManager.isEventTest() && $gameSystem.isSaveEnabled();
  };

  Sprite_TMRingCommandIcon.prototype.isGameEndEnabled = function() {
    return true;
  };

  Sprite_TMRingCommandIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._rotationCount > 0) {
      this._posAngle += this._va;
      this._rotationCount--;
      if (this._rotationCount === 0) {
        this._posAngle = this._targetPosAngle;
      }
    }
    var r = this._posAngle + Math.PI / 2;
    this.x = Math.cos(r) * this.parent._commandRadius * iconDistX;
    this.y = Math.sin(r) * this.parent._commandRadius * iconDistY - 24;
    var scale = (this.y + 56) / 256 + 0.75;
    this.scale.set(scale, scale);
    this.opacity = this.isEnabled() ? 255 : 160
  };
  
  //-----------------------------------------------------------------------------
  // Sprite_TMRingCommand
  //
  
  function Sprite_TMRingCommand() {
    this.initialize.apply(this, arguments);
  }

  Sprite_TMRingCommand.prototype = Object.create(Sprite.prototype);
  Sprite_TMRingCommand.prototype.constructor = Sprite_TMRingCommand;

  Sprite_TMRingCommand.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this._commandIndex = saveLastIndex ? $gameTemp.ringCommandLastIndex() : 0;
    this._commandRadius = 0;
    this.makeCommandList();
    this.refresh();
  };

  Sprite_TMRingCommand.prototype.makeCommandList = function() {
    this._commandSprites = []
    this.addMainCommands();
    this.addFormationCommand();
    this.addOptionsCommand();
    this.addSaveCommand();
    this.addGameEndCommand();
  };

  Sprite_TMRingCommand.prototype.addMainCommands = function() {
    if (this.needsCommand('item')) {
      var sprite = new Sprite_TMRingCommandIcon('item');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
    if (this.needsCommand('skill')) {
      var sprite = new Sprite_TMRingCommandIcon('skill');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
    if (this.needsCommand('equip')) {
      var sprite = new Sprite_TMRingCommandIcon('equip');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
    if (this.needsCommand('status')) {
      var sprite = new Sprite_TMRingCommandIcon('status');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
  };
  
  Sprite_TMRingCommand.prototype.addFormationCommand = function() {
    if (this.needsCommand('formation')) {
      var sprite = new Sprite_TMRingCommandIcon('formation');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
  };

  Sprite_TMRingCommand.prototype.addOptionsCommand = function() {
    var sprite = new Sprite_TMRingCommandIcon('options');
    this._commandSprites.push(sprite);
    this.addChild(sprite);
  };

  Sprite_TMRingCommand.prototype.addSaveCommand = function() {
    if (this.needsCommand('save')) {
      var sprite = new Sprite_TMRingCommandIcon('save');
      this._commandSprites.push(sprite);
      this.addChild(sprite);
    }
  };

  Sprite_TMRingCommand.prototype.addGameEndCommand = function() {
    var sprite = new Sprite_TMRingCommandIcon('gameEnd');
    this._commandSprites.push(sprite);
    this.addChild(sprite);
  };

  Sprite_TMRingCommand.prototype.needsCommand = function(name) {
    var flags = $dataSystem.menuCommands;
    if (flags) {
      switch (name) {
      case 'item':
        return flags[0];
      case 'skill':
        return flags[1];
      case 'equip':
        return flags[2];
      case 'status':
        return flags[3];
      case 'formation':
        return flags[4];
      case 'save':
        return flags[5];
      }
    }
    return true;
  };

  Sprite_TMRingCommand.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateVisible();
    if ($gameTemp.isRingCommandVisible()) {
      if (this._commandRadius < 4) {
        if (this._commandRadius === 0) {
          if (openResetIndex) {
            this._commandIndex = $gameTemp.ringCommandLastIndex();
            this.refresh();
          }
          if (openGoldWindow) {
            var goldWindow = this.parent.parent._messageWindow._goldWindow;
            goldWindow.x = goldWindowX;
            goldWindow.y = goldWindowY;
            goldWindow.open();
          }
          AudioManager.playSe(seOpenCommand);
        }
        this._commandRadius++;
      }
      this.updateInput();
      this.x = $gamePlayer.screenX();
      this.y = $gamePlayer.screenY();
    } else {
      if (this._commandRadius > 0) {
        if (this._commandRadius === 4) {
          if (openGoldWindow) {
            this.parent.parent._messageWindow._goldWindow.close();
          }
          AudioManager.playSe(seCloseCommand);
        }
        this._commandRadius--;
      }
    }
  };
  
  Sprite_TMRingCommand.prototype.updateVisible = function() {
    if (useEscape) {
    } else {
      $gameTemp.setRingCommandVisible(Input.isPressed('control') &&
        $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning() && !$gameMessage.isBusy());
    }
    this.visible = this._commandRadius > 0;
  };
  
  Sprite_TMRingCommand.prototype.updateInput = function() {
    if (Input.isRepeated('left') || (TouchInput.isRepeated() &&
        TouchInput.x < $gamePlayer.screenX() - 24)) {
      this._commandIndex--
      if (this._commandIndex < 0) {
        this._commandIndex = this._commandSprites.length - 1;
      }
      this.refresh();
      SoundManager.playCursor();
    }
    if (Input.isRepeated('right') || (TouchInput.isRepeated() &&
        TouchInput.x > $gamePlayer.screenX() + 24)) {
      this._commandIndex++;
      if (this._commandIndex >= this._commandSprites.length) {
        this._commandIndex = 0;
      }
      this.refresh();
      SoundManager.playCursor();
    }
    if (Input.isTriggered('ok') || (TouchInput.isTriggered() &&
        TouchInput.x >= $gamePlayer.screenX() - 24 &&
        TouchInput.x <= $gamePlayer.screenX() + 24)) {
      var sprite = this._commandSprites[this._commandIndex];
      if (sprite.isEnabled()) {
        switch (sprite.name()) {
        case 'item':
          SceneManager.push(Scene_Item);
          break;
        case 'skill':
          this.loadImages();
          SceneManager.push(Scene_Skill);
          break;
        case 'equip':
          SceneManager.push(Scene_Equip);
          break;
        case 'status':
          this.loadImages();
          SceneManager.push(Scene_Status);
          break;
        case 'formation':
          SceneManager.push(Scene_RCFormation);
          break;
        case 'options':
          SceneManager.push(Scene_Options);
          break;
        case 'save':
          SceneManager.push(Scene_Save);
          break;
        case 'gameEnd':
          SceneManager.push(Scene_GameEnd);
          break;
        }
        this._commandRadius = 0;
        if (openGoldWindow) {
          this.parent.parent._messageWindow._goldWindow.hide();
        }
        $gameTemp.setRingCommandLastIndex(this._commandIndex);
        $gameTemp.setRingCommandVisible(false);
        SoundManager.playOk();
      } else {
        SoundManager.playBuzzer();
      }
    }
    if (useEscape && this._commandRadius === 4 &&
        (Input.isTriggered('menu') || TouchInput.isCancelled())) {
      $gameTemp.setRingCommandVisible(false);
    }
  };

  Sprite_TMRingCommand.prototype.refresh = function() {
    for (var i = 0; i < this._commandSprites.length; i++) {
      var sprite = this._commandSprites[i];
      var index = (this._commandIndex - i) % this._commandSprites.length;
      sprite.setIndex(index);
    }
  };
  
  Sprite_TMRingCommand.prototype.loadImages = function() {
    $gameParty.members().forEach(function(actor) {
      ImageManager.loadFace(actor.faceName());
    }, this);
  };

  //-----------------------------------------------------------------------------
  // Spriteset_Map
  //
  
  var _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
  Spriteset_Map.prototype.createLowerLayer = function() {
    _Spriteset_Map_createLowerLayer.call(this);
    this.createRingCommand();
  };

  Spriteset_Map.prototype.createRingCommand = function() {
    this._ringCommand = new Sprite_TMRingCommand();
    this.addChild(this._ringCommand);
  };
  
  //-----------------------------------------------------------------------------
  // Window_Message
  //
  
  var _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
  Window_Message.prototype.updatePlacement = function() {
    _Window_Message_updatePlacement.call(this);
    this._goldWindow.x = Graphics.boxWidth - this._goldWindow.width;
  };

  //-----------------------------------------------------------------------------
  // Scene_Map
  //
  
  var _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
  Scene_Map.prototype.callMenu = function() {
    if (useEscape) {
      $gameTemp.setRingCommandVisible(true);
      this.menuCalling = false;
    } else {
      _Scene_Map_callMenu.call(this);
    }
  };

  //-----------------------------------------------------------------------------
  // Scene_RCFormation
  //

  function Scene_RCFormation() {
    this.initialize.apply(this, arguments);
  }

  Scene_RCFormation.prototype = Object.create(Scene_MenuBase.prototype);
  Scene_RCFormation.prototype.constructor = Scene_RCFormation;

  Scene_RCFormation.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
  };

  Scene_RCFormation.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createStatusWindow();
  };

  Scene_RCFormation.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    this._statusWindow.refresh();
    this._statusWindow.setFormationMode(true);
    this._statusWindow.selectLast();
    this._statusWindow.activate();
    this._statusWindow.setHandler('ok',     this.onFormationOk.bind(this));
    this._statusWindow.setHandler('cancel', this.onFormationCancel.bind(this));
  };

  Scene_RCFormation.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_MenuStatus(0, 0);
    this._statusWindow.x = (Graphics.boxWidth - this._statusWindow.width) / 2;
    this.addWindow(this._statusWindow);
  };

  Scene_RCFormation.prototype.onFormationOk = function() {
    var index = this._statusWindow.index();
    var actor = $gameParty.members()[index];
    var pendingIndex = this._statusWindow.pendingIndex();
    if (pendingIndex >= 0) {
      $gameParty.swapOrder(index, pendingIndex);
      this._statusWindow.setPendingIndex(-1);
      this._statusWindow.redrawItem(index);
    } else {
      this._statusWindow.setPendingIndex(index);
    }
    this._statusWindow.activate();
  };

  Scene_RCFormation.prototype.onFormationCancel = function() {
    if (this._statusWindow.pendingIndex() >= 0) {
      this._statusWindow.setPendingIndex(-1);
      this._statusWindow.activate();
    } else {
      this.popScene();
    }
  };

})();
