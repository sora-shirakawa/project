/*:ja
 * @plugindesc 拡張ステータス画面 Ver0.70-α
 *　ステータス画面の表示を拡張します。
 * @author kure
 *
 * @param ViewCommand
 * @desc 表示するメインコマンドの番号を指定します。
 * 1:能力値　2:基本情報　3:職業情報　4;装備情報　5:プロフィール
 * @default 1,2,3,4,5
 *
 * @param Viewparam
 * @desc 表示する能力値IDを指定します。
 * 表示したい順にIDに半角数字設定「,」で区切ること
 * @default 0,1,2,3,4,5,6,7
 *
 * @param ViewXparam
 * @desc 表示する特殊能力値IDを指定します。
 * 表示したい順にIDに半角数字設定「,」で区切ること
 * @default 0,1,2,3,4,5,6,7,8,9
 *
 * @param ViewSparam
 * @desc 表示する追加能力値IDを指定します。
 * 表示したい順にIDに半角数字設定「,」で区切ること
 * @default 0,1,2,3,4,5,6,7,8,9
 *
 * @param ViewStateRate
 * @desc 表示するステート有効度のIDを指定します。
 * 表示したい順にIDに半角数字設定「,」で区切ること
 * @default 1,2,3,4,5,6,7,8,9,10
 *
 * @param ViewElementRate
 * @desc 表示する属性有効度のIDを指定します。
 * 表示したい順にIDに半角数字設定「,」で区切ること
 * @default 1,2,3,4,5,6,7,8,9
 *
 * @param Command1
 * @desc 能力値のメニューコマンド名です。
 * @default 能力値
 *
 * @param Command2
 * @desc 基本情報のメニューコマンド名です。。
 * @default 基本情報
 *
 * @param Command3
 * @desc 職業情報のメニューコマンド名です。。
 * @default 職業情報
 *
 * @param Command4
 * @desc 装備情報のメニューコマンド名です。。
 * @default 装備情報
 *
 * @param Command5
 * @desc プロフィールのメニューコマンド名です。
 * @default プロフィール
 *
 * @param Xparam0
 * @desc 命中率の表示名です。
 * @default 命中率
 *
 * @param Xparam1
 * @desc 回避率の表示名です。
 * @default 回避率
 *
 * @param Xparam2
 * @desc 会心率の表示名です。
 * @default 会心率
 *
 * @param Xparam3
 * @desc 会心回避率の表示名です。
 * @default 会心回避率
 *
 * @param Xparam4
 * @desc 魔法回避率の表示名です。
 * @default 魔法回避率
 *
 * @param Xparam5
 * @desc 魔法反射率の表示名です。
 * @default 魔法反射率
 *
 * @param Xparam6
 * @desc 反撃率の表示名です。
 * @default 反撃率
 *
 * @param Xparam7
 * @desc HP回復率の表示名です。
 * @default HP回復率
 *
 * @param Xparam8
 * @desc MP回復率の表示名です。
 * @default MP回復率
 *
 * @param Xparam9
 * @desc TP回復率の表示名です。
 * @default TP回復率
 *
 * @param Sparam0
 * @desc 狙われ率の表示名です。
 * @default 狙われ率
 *
 * @param Sparam1
 * @desc 防御効果率の表示名です。
 * @default 防御効果率
 *
 * @param Sparam2
 * @desc 回復効果率の表示名です。
 * @default 回復効果率
 *
 * @param Sparam3
 * @desc 薬の知識の表示名です。
 * @default 薬の知識
 *
 * @param Sparam4
 * @desc MP消費率の表示名です。
 * @default MP消費率
 *
 * @param Sparam5
 * @desc TPチャージ率の表示名です。
 * @default TPチャージ率
 *
 * @param Sparam6
 * @desc 物理ダメージ率の表示名です。
 * @default 物理ダメージ率
 *
 * @param Sparam7
 * @desc 魔法ダメージ率の表示名です。
 * @default 魔法ダメージ率
 *
 * @param Sparam8
 * @desc 床ダメージ率の表示名です。
 * @default 床ダメージ率
 *
 * @param Sparam9
 * @desc 経験値獲得率の表示名です。
 * @default 経験値獲得率
 *
 * @help 
 *
 * ○装備説明文及びプロフィール描画について
 * 　「,」で区切った位置で改行が行われます。
 *
 * ○プロフィールでの画像の利用について
 *　アクターのメモ欄に「<use_img:true>」を記入すると利用可能です。
 *　「picture」フォルダの中に「顔グラフィック_顔INDEX値」の
 *　pngファイルを入れてください。
 *　(例)顔グラフィック名が「Actor1」,INDEX値が「0」であれば
 *　　　「Actor1_0.png」というファイルが読み込まれます。
 *　　　※存在しない場合エラーが発生します。
 *　　
 *　また、シーン終了時に画像のキャッシュをクリアしています。
 */

(function() {
	//設定項目の値を読み込む
	var parameters = PluginManager.parameters('Ex_status070-alpha');
	var command_visible = parameters['ViewCommand'].split(",").map(Number);
	var param_visible = parameters['Viewparam'].split(",").map(Number);
	var xparam_visible = parameters['ViewXparam'].split(",").map(Number);
	var sparam_visible = parameters['ViewSparam'].split(",").map(Number);
	var state_visible = parameters['ViewStateRate'].split(",").map(Number);
	var element_visible = parameters['ViewElementRate'].split(",").map(Number);

	//-----------------------------------------------------------------------------
	// ImageManager
	//-----------------------------------------------------------------------------
	//指定したキャッシュのクリア
	ImageManager.DeleteCache = function(path, hue) {
	    var key = path + ':' + hue;
	    delete this._cache[key];
	};

	//-----------------------------------------------------------------------------
	// Game_Actor
	//-----------------------------------------------------------------------------
	//EXPテーブルを返す。
	Game_Actor.prototype.Exp = function() {
	    return this._exp;
	};

	//職業IDを返す。
	Game_Actor.prototype.ClassId = function() {
	    return this._classId;
	};

	//指定職業IDのEXPを返す。
	Game_Actor.prototype.ClassExp = function(class_id) {
	    return this._exp[class_id] ? this._exp[class_id] : 0;
	};
	//-----------------------------------------------------------------------------
	// Scene_Status
	//-----------------------------------------------------------------------------
	Scene_Status.prototype.create = function() {
		Scene_MenuBase.prototype.create.call(this);
		this.create_main_command_window();
		this.create_simple_status_window();
		this.create_status_window();

		this.window_setting();
		this.refreshActor();
	};

	//シーンから戻る時にキャッシュをクリアにする
	Scene_Status.prototype.popScene = function() {
		//キャッシュを完全クリアし、システムを読み直す場合はコメントアウトを外す
		//ImageManager.clear();
		//Scene_Boot.prototype.loadSystemImages.call(this);
		SceneManager.pop();
	};

	//メインコマンドウィンドウを作成
	Scene_Status.prototype.create_main_command_window = function() {
	    this._maincommandWindow = new Window_Status_Main_Command();
	   	this._maincommandWindow.setHandler('ok',   this.main_command_ok.bind(this));
	   	this._maincommandWindow.setHandler('cancel',   this.popScene.bind(this));
	   	this._maincommandWindow.setHandler('pagedown', this.nextActor.bind(this));
	   	this._maincommandWindow.setHandler('pageup',   this.previousActor.bind(this));
	   	this.addWindow(this._maincommandWindow);
	};

	//簡易ステータスウィンドウを作成
	Scene_Status.prototype.create_simple_status_window = function() {
		var wx = this._maincommandWindow.width;
		var ww = Graphics.boxWidth - wx;
		var wh = this._maincommandWindow.height;
	    this._simplestatus = new Window_Simple_Actor_Status(wx, 0 ,ww, wh);
	    this.addWindow(this._simplestatus);
	};

	//メインウィンドウを作成
	Scene_Status.prototype.create_status_window = function() {
		var wy = this._maincommandWindow.height;
		var ww = Graphics.boxWidth;
		var wh = Graphics.boxHeight - wy;
	    this._statusWindow = new Window_Main_Status(0, wy, ww, wh);
	   	this._statusWindow.setHandler('ok',   this.status_ok.bind(this));
	   	this._statusWindow.setHandler('cancel',   this.status_cancel.bind(this));
	    this.addWindow(this._statusWindow);
	};

	//各ウィンドウセッティング処理
	Scene_Status.prototype.window_setting = function() {
		this._statusWindow.setIndex(this._maincommandWindow.currentExt());
		this._maincommandWindow.setStatusWindow(this._statusWindow)
	};

	//アクター更新
	Scene_Status.prototype.refreshActor = function() {
	    var actor = this.actor();
	    this._simplestatus.setActor(actor);
		this._statusWindow.setActor(actor);
		//メイン画面の描画INDEXを更新
		this._statusWindow.setIndex(this._maincommandWindow.currentExt());
	};

	//アクター切り替え時の操作
	Scene_Status.prototype.onActorChange = function() {
	    this.refreshActor();
	    this._maincommandWindow.activate();
	};

	//メインコマンド確定
	Scene_Status.prototype.main_command_ok = function() {
		//選択によって処理を分岐
		if (this._maincommandWindow.currentExt() == 0 || this._maincommandWindow.currentExt() == 4000){
			this._maincommandWindow.activate();
		}else{
			this._statusWindow.activate();
			this._statusWindow.select(0);
		}
	};

	//ステータスウィンドウ(決定)
	Scene_Status.prototype.status_ok = function() {
		this._statusWindow.activate();
	};

	//ステータスウィンドウ(キャンセル)
	Scene_Status.prototype.status_cancel = function() {
	    this._statusWindow.deactivate();
		this._statusWindow.deselect();
	    this._maincommandWindow.activate();
		//メイン画面の描画INDEXを更新
		this._statusWindow.setIndex(this._maincommandWindow.currentExt());
	};
	//-----------------------------------------------------------------------------
	// Window_Status_Main_Command
	//-----------------------------------------------------------------------------
	function Window_Status_Main_Command() {
	    this.initialize.apply(this, arguments);
	}

	Window_Status_Main_Command.prototype = Object.create(Window_Command.prototype);
	Window_Status_Main_Command.prototype.constructor = Window_Status_Main_Command;

	Window_Status_Main_Command.prototype.initialize = function(x, y) {
	    Window_Command.prototype.initialize.call(this, x, y);
		this._statusWindow = null
	};

	//ウィンドウ幅
	Window_Status_Main_Command.prototype.windowWidth = function() {
	    return 240;
	};

	//ウィンドウの高さ
	Window_Status_Main_Command.prototype.windowHeight = function() {
	    return this.fittingHeight(4);
	};

	//コマンドの作成
	Window_Status_Main_Command.prototype.makeCommandList = function() {
		for(var i = 0; i < command_visible.length; i++) {
			switch(command_visible[i]){
			case 1:this.addCommand(parameters['Command1'], 'ok', true, 0); break;
			case 2:this.addCommand(parameters['Command2'], 'ok', true, 1000); break;
			case 3:this.addCommand(parameters['Command3'], 'ok', true, 2000); break;
			case 4:this.addCommand(parameters['Command4'], 'ok', true, 3000); break;
			case 5:this.addCommand(parameters['Command5'], 'ok', true, 4000); break;
			}
		}
	};

	//ステータスウィンドウの設定
	Window_Status_Main_Command.prototype.setStatusWindow = function(statusWindow) {
	    if (this._statusWindow !== statusWindow) {
	        this._statusWindow = statusWindow;
	    }
	};

	//選択したコマンドの描画INDEXをステータス画面に送る
	Window_Status_Main_Command.prototype.select = function(index) {
		Window_Command.prototype.select.call(this, index);
		if (this._statusWindow){
			this._statusWindow.setIndex(this.currentExt());
		}
	};

	//-----------------------------------------------------------------------------
	// Window_Simple_Actor_Status
	//-----------------------------------------------------------------------------
	function Window_Simple_Actor_Status() {
	    this.initialize.apply(this, arguments);
	}

	Window_Simple_Actor_Status.prototype = Object.create(Window_Base.prototype);
	Window_Simple_Actor_Status.prototype.constructor = Window_Simple_Actor_Status;

	Window_Simple_Actor_Status.prototype.initialize = function(x, y, width, height) {
	    Window_Base.prototype.initialize.call(this, x, y, width, height);
		this._actor = null;
	};

	//アクターの設定
	Window_Simple_Actor_Status.prototype.setActor = function(actor) {
	    if (this._actor !== actor) {
	        this._actor = actor;
	        this.refresh();
	    }
	};

	//描画処理
	Window_Simple_Actor_Status.prototype.refresh = function() {
	    if (this.contents) {
	        this.contents.clear();
			this.drawActorFace(this._actor, 0, 0, 144,144);
	        this.drawActorSimpleStatus(this._actor, 150, 0, this.contentsWidth);
	    }
	};

	//-----------------------------------------------------------------------------
	// Window_Main_Status
	//-----------------------------------------------------------------------------
	function Window_Main_Status() {
	    this.initialize.apply(this, arguments);
	}

	Window_Main_Status.prototype = Object.create(Window_Command.prototype);
	Window_Main_Status.prototype.constructor = Window_Main_Status;

	//初期化処理
	Window_Main_Status.prototype.initialize = function(x, y, width, height) {
		this._width = width;
		this._height = height;
	    Window_Command.prototype.initialize.call(this, x, y);
		this._actor = null;
		this._draw_index = 0;
		this._max_page = 0;
		this._sub_draw_index = 0;
		//初期状態ではカーソルを表示しない
		this.deactivate();
		this.deselect();
		this.actor_pic = new Bitmap();
		this.sprite = new Sprite();
		this.addChild(this.sprite);
		this.sprite_flag = 0;
		this.old_name = "";
	};

	//ウィンドウの幅
	Window_Main_Status.prototype.windowWidth = function() {
	    return this._width
	};

	//ウィンドウの高さ
	Window_Main_Status.prototype.windowHeight = function() {
	    return this._height
	};

	//→コマンド
	Window_Main_Status.prototype.cursorRight = function(wrap) {
		this._sub_draw_index += 1;
		if (this._sub_draw_index > this._max_page){this._sub_draw_index = 0};
		this.refresh();
	};

	//←コマンド
	Window_Main_Status.prototype.cursorLeft = function(wrap) {
		this._sub_draw_index -= 1;
		if (this._sub_draw_index < 0){this._sub_draw_index = this._max_page};
		this.refresh();
	};

	//カーソル最大数
	Window_Main_Status.prototype.maxPageRows = function() {
	    return Window_Selectable.prototype.maxPageRows.call(this) - 1;
	};

	//矢印描画(処理削除)
	Window_Main_Status.prototype.updateArrows = function() {
	};

	//カーソルの幅
	Window_Main_Status.prototype.itemWidth = function() {
	    return 204
	};

	//カーソル位置
	Window_Main_Status.prototype.itemRect = function(index) {
	    var rect = new Rectangle();
	    var maxCols = this.maxCols();
	    rect.width = this.itemWidth();
	    rect.height = this.itemHeight();
	    rect.x = index % maxCols * (rect.width + this.spacing()) - this._scrollX;
	    rect.y = Math.floor((index + 1) / maxCols) * rect.height - this._scrollY;
	    return rect;
	};

	//スプライトのセット
	Window_Main_Status.prototype.SetSprite = function(){
		var name = this._actor.faceName() + "_" + this._actor.faceIndex();
		var use_img = $dataActors[this._actor.actorId()].meta.use_img;
		this.sprite_flag = 0;
	    if(use_img){
			this.actor_pic = ImageManager.loadPicture(name, 0);
			this.sprite.bitmap = this.actor_pic;
			this.old_name = name;
		}else{
			ImageManager.DeleteCache(this.old_name, 0)
			this.sprite.bitmap = null ;
			this.old_name = "";
		}
	};

	//画面更新処理
    Window_Main_Status.prototype.update = function() {
        Window_Command.prototype.update.call(this);
        if (this.sprite_flag < 4) {
			var zoom_rate = (this.contents.height - 50) / this.sprite.height ;
			this.sprite.scale.x = zoom_rate;
			this.sprite.scale.y = zoom_rate;
			this.sprite.x = this.contents.width - (this.sprite.width * zoom_rate);
			this.sprite.y = this.contents.height - (this.sprite.height * zoom_rate);
			this.sprite_flag += 1;
        }
    };

	//アクター更新
	Window_Main_Status.prototype.setActor = function(actor) {
	    if (this._actor !== actor) {
	        this._actor = actor;
			this.SetSprite();
			this.refresh();
	    }
	};

	//描画INDEXの設定
	Window_Main_Status.prototype.setIndex = function(value) {
	    if (this._draw_index !== value) {
	        this._draw_index = value;
	        this.refresh();
	    }
	};

	//選択したコマンドの描画INDEXをステータス画面に送る
	Window_Main_Status.prototype.select = function(index) {
		Window_Command.prototype.select.call(this, index);
		this._sub_draw_index = 0;
		this.refresh();
	};

	//指定コマンドの拡張データを取得
	Window_Main_Status.prototype.commandExt = function(index) {
	    return this._list[index].ext;
	};

	//コマンドの描画
	Window_Main_Status.prototype.drawItem = function(index) {
	    var rect = this.itemRectForText(index);
	    var align = this.itemTextAlign();
	    this.resetTextColor();
	    this.changePaintOpacity(this.isCommandEnabled(index));
		//装備情報の場合はアイコンを描画する
		if (3000 <= this._draw_index && this._draw_index <= 3999) {
			this.drawItemName(this.commandExt(index), rect.x, rect.y, rect.width);
		}else{
	    	this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
		}
	};


	//コマンドの作成
	Window_Main_Status.prototype.makeCommandList = function() {
		//描画INDEX1000～1999
	   	if (1000 <= this._draw_index && this._draw_index <= 1999) {
	       	this.addCommand("アクター特徴", 'ok', true, 0);
	       	this.addCommand("属性有効度", 'ok', true, 100);
	       	this.addCommand("ステート有効度", 'ok', true, 200);
		}
		//描画INDEX2000～2999
	   	if (2000 <= this._draw_index && this._draw_index <= 2999) {
	       	this.addCommand("職業情報", 'ok', true, 0);
	       	this.addCommand("職業履歴", 'ok', true, 100);
		}
		//描画INDEX3000～3999
	   	if (3000 <= this._draw_index && this._draw_index <= 3999) {
			var list = this._actor.equips();
			for (var i = 0; i < list.length; i++) {
				if(list[i]){this.addCommand(list[i].name, 'ok', true, list[i]);}
			}
		}
	}

	//リフレッシュ
	Window_Main_Status.prototype.refresh = function() {
		if (this.contents && this._actor) {
		Window_Command.prototype.refresh.call(this)
			this.sprite.visible = false;
			//描画INDEX0～999(能力値)
	    	if (0 <= this._draw_index && this._draw_index <= 999) {
	        	this.draw_index_zero(this._actor, 0, 0);
	        }
			//描画INDEX1000～1999(基本情報)
	    	if (1000 <= this._draw_index && this._draw_index <= 1999) {
				this.draw_index_one(this._actor, 210, 0);
	        }
			//描画INDEX2000～2999(職業情報)
	    	if (2000 <= this._draw_index && this._draw_index <= 2999) {
				this.draw_index_two(this._actor, 210, 0);
	        }
			//描画INDEX3000～3999(装備情報)
	    	if (3000 <= this._draw_index && this._draw_index <= 3999) {
				this.draw_index_three(this._actor, 210, 0);
	        }
			//描画INDEX4000～4999(プロフィール)
	    	if (4000 <= this._draw_index && this._draw_index <= 4999) {
				this.sprite.visible = true ;
				this.draw_index_four(this._actor, 210, 0);
	        }
	    }
	};

	//描画INDEX0～999(基本能力値の描画)
	Window_Main_Status.prototype.draw_index_zero = function(actor, x, y) {
		var lineHeight = this.lineHeight();
		var basic_width = (this.contents.width) / 3
		for (var count = 0; count < 3; count++){
        	this.drawGauge(basic_width * count, y, basic_width - 20, 1, this.mpGaugeColor1(), this.crisisColor());
        	}
		this.drawText("基本能力値", basic_width * 0, y, basic_width - 20);
		this.drawText("特殊能力値", basic_width * 1, y, basic_width - 20);
		this.drawText("追加能力値", basic_width * 2, y, basic_width - 20);

		//基本能力値描画
		for(var i = 0; i < param_visible.length; i++) {
        	var paramId = param_visible[i];
			var x2 = basic_width * 0
        	var y2 = y + lineHeight * (i + 1);
        	this.changeTextColor(this.systemColor());
        	this.drawText(TextManager.param(paramId), x2, y2, 160);
        	this.resetTextColor();
        	this.drawText(this._actor.param(paramId), x2, y2, basic_width - 20, 'right');
    	}
		//特殊能力値描画
    	for(var i = 0; i < xparam_visible.length; i++) {
        	var paramId = xparam_visible[i];
			var x2 = basic_width * 1
        	var y2 = y + lineHeight * (i + 1);
        	this.changeTextColor(this.systemColor());
        	this.drawText(TextManager.xparam(paramId), x2, y2, 160);
        	this.resetTextColor();
			var value = TextManager.NumCut(this._actor.xparam(paramId), 3);
        	this.drawText(String(value * 100) + "%", x2, y2, basic_width - 20, 'right');
    	}
		//追加能力値描画
    	for(var i = 0; i < sparam_visible.length; i++) {
        	var paramId = sparam_visible[i];
			var x2 = basic_width * 2
        	var y2 = y + lineHeight * (i + 1);
        	this.changeTextColor(this.systemColor());
        	this.drawText(TextManager.sparam(paramId), x2, y2, 160);
        	this.resetTextColor();
			var value = TextManager.NumCut(this._actor.sparam(paramId),3)
        	this.drawText(String(value * 100) + "%", x2, y2, basic_width - 20, 'right');
    	}
	};

	//描画INDEX1000～1999(基本能力値の描画)
	Window_Main_Status.prototype.draw_index_one = function(actor, x, y) {
		var lineHeight = this.lineHeight();
		this.drawGauge(0, 0, 204, 1, this.mpGaugeColor1(), this.crisisColor());
		this.drawText("基本情報", 0, 0, 204);
		this.drawGauge(x, 0, this.contents.width - x, 1, this.mpGaugeColor1(), this.crisisColor());
		//選択中のコマンドにより描画を分岐
		if (0 <= this.currentExt() && this.currentExt() <= 99) {
			this.drawText("アクター特徴", x, 0, 300);
			//特徴表示用テキスト配列を取得
			var draw_text = TextManager.trait_txt(actor);
			//最大ページ数を設定する
			this._max_page = Math.floor(draw_text.length / 18);
			//順番に描画する
			var first_line = 18 * this._sub_draw_index;
			var last_line = Math.min.apply(null, [18 * (this._sub_draw_index + 1), draw_text.length]);
			for (var i = first_line; i < last_line; i++) {
				var x2 = x + ((this.contents.width - x) / 2) * ((i - first_line) % 2);
        		var y2 = y + lineHeight * (1 + Math.floor((i - first_line) / 2)) ;
				this.drawText(draw_text[i], x2, y2, ((this.contents.width - x) / 2));
			}

	    }
		if (100 <= this.currentExt() && this.currentExt() <= 199) {
			this.drawText("属性有効度", x, 0, 300);
			//最大ページ数を設定する
			this._max_page = Math.floor(element_visible.length / 18);

			//順番に描画する
			var first_line = 18 * this._sub_draw_index;
			var last_line = Math.min.apply(null, [18 * (this._sub_draw_index + 1), element_visible.length]);
			for (var i = first_line; i < last_line; i++) {
				var x2 = x + ((this.contents.width - x) / 2) * ((i - first_line) % 2);
        		var y2 = y + lineHeight * (1 + Math.floor((i - first_line) / 2)) ;
				this.changeTextColor(this.systemColor());
				this.drawText($dataSystem.elements[element_visible[i]], x2, y2, ((this.contents.width - x) / 2));
				this.resetTextColor();
				var value = TextManager.NumCut(this._actor.elementRate(element_visible[i]), 3);
				this.drawText((value * 100) + "%", x2, y2, ((this.contents.width - x) / 2) - 15, 'right');
			}

	    }
		if (200 <= this.currentExt() && this.currentExt() <= 299) {
			this.drawText("ステート有効度", x, 0, 300);
			//最大ページ数を設定する
			this._max_page = Math.floor(state_visible.length / 18);

			//順番に描画する
			var first_line = 18 * this._sub_draw_index;
			var last_line = Math.min.apply(null, [18 * (this._sub_draw_index + 1), state_visible.length]);
			for (var i = first_line; i < last_line; i++) {
				var x2 = x + ((this.contents.width - x) / 2) * ((i - first_line) % 2);
        		var y2 = y + lineHeight * (1 + Math.floor((i - first_line) / 2)) ;
				this.changeTextColor(this.systemColor());
				this.drawIcon($dataStates[state_visible[i]].iconIndex ,x2, y2);
				this.drawText($dataStates[state_visible[i]].name, x2 + 36, y2, ((this.contents.width - x) / 2) - 36);
				this.resetTextColor();
				var value = TextManager.NumCut(this._actor.stateRate(state_visible[i]), 3);
				var text = this._actor.stateResistSet().contains(state_visible[i]) ? "無効" : (value * 100) + "%";
				this.drawText(text, x2 + 36, y2, ((this.contents.width - x) / 2) - 51, 'right');
			}
	    }

		this.drawText("← →：表示切替" + "( " + (this._sub_draw_index + 1) + "/ " + (this._max_page + 1) + " )", x, this.contents.height - lineHeight, this.contents.width - x, 'center');
	};

	//描画INDEX2000～2999(職業情報の描画)
	Window_Main_Status.prototype.draw_index_two = function(actor, x, y) {
		var lineHeight = this.lineHeight();
		this.drawGauge(0, 0, 204, 1, this.mpGaugeColor1(), this.crisisColor());
		this.drawText("職業情報", 0, 0, 204);
		this.drawGauge(x, 0, this.contents.width - x, 1, this.mpGaugeColor1(), this.crisisColor());
		//選択中のコマンドにより描画を分岐
		if (0 <= this.currentExt() && this.currentExt() <= 99) {
			this.drawText("現在の職業", x, 0, 300);
			var class_list = [this._actor.ClassId()];
			//最大ページ数を設定する
			this._max_page = 0;

			for (var i = 0; i < class_list.length; i++) {
				var y2 = (lineHeight) * ((2 * i) + 1)
				var Classname = $dataClasses[class_list[i]].name

				var Classlevel = 1;
				while (TextManager.expForLevel(this._actor.ClassId(), Classlevel) <= Game_Actor.prototype.ClassExp.call(this._actor, this._actor.ClassId())){
					Classlevel += 1;
				}
				Classlevel -= 1;

				this.drawText(Classname + " Lv" + Classlevel, x, y2, this.contents.width - x);
				var need = TextManager.expForLevel(this._actor.ClassId(), Classlevel + 1) - TextManager.expForLevel(this._actor.ClassId(), Classlevel);
				var now = Game_Actor.prototype.ClassExp.call(this._actor, this._actor.ClassId()) - TextManager.expForLevel(this._actor.ClassId(), Classlevel);
				var rate = need != 0 ? now / need : 0

				this.drawGauge(x + 20 , y2 + lineHeight, 250, rate, this.tpGaugeColor1(), this.tpGaugeColor2());
				this.changeTextColor(this.systemColor());
				this.drawText("Exp", x + 20 , y2 + lineHeight , 50);
				this.drawCurrentAndMax(now, need, x + 20, y2 + lineHeight, 250, this.normalColor(), this.normalColor());

				this.changeTextColor(this.systemColor());
				this.drawText("Next", x + 300 , y2 + lineHeight , 50);
				this.resetTextColor();
				this.drawText(need - now , x + 300 , y2 + lineHeight , this.contents.width - (x + 350), 'right');
			}
		}

		if (100 <= this.currentExt() && this.currentExt() <= 199) {
			this.drawText("職業履歴", x, 0, 300);
			var exp_list = Game_Actor.prototype.Exp.call(this._actor);
			var keys = Object.keys(exp_list);

			//最大ページ数を設定する
			this._max_page = Math.floor(keys.length / 18);

			//順番に描画する
			var first_line = 18 * this._sub_draw_index;
			var last_line = Math.min.apply(null, [18 * (this._sub_draw_index + 1), keys.length]);

			for (var i = 0; i < keys.length; i++) {
				var x2 = x + ((this.contents.width - x) / 2) * ((i - first_line) % 2);
        		var y2 = y + lineHeight * (1 + Math.floor((i - first_line) / 2)) ;

				var Classname = $dataClasses[keys[i]].name;
				var Classlevel = 1;
				while (TextManager.expForLevel(keys[i], Classlevel) <= exp_list[keys[i]]){
					Classlevel += 1;
				}
				Classlevel -= 1;

				if (keys[i] == this._actor.ClassId()){this.changeTextColor(this.powerUpColor());}
				this.drawText(Classname + " Lv" + Classlevel, x2, y2, (this.contents.width - x) / 2);
				this.resetTextColor();
			}
		this.drawText("← →：表示切替" + "( " + (this._sub_draw_index + 1) + "/ " + (this._max_page + 1) + " )", x, this.contents.height - lineHeight, this.contents.width - x, 'center');
		}
	};

	//描画INDEX3000～3999(装備情報の描画)
	Window_Main_Status.prototype.draw_index_three = function(actor, x, y) {
		var lineHeight = this.lineHeight();
		var basic_width = (this.contents.width - x) / 2;
		var item = this.currentExt();

		//特徴表示用テキスト配列を取得
		var draw_text = TextManager.trait_txt(item);
		//最大ページ数を設定する
		var info1 = 0 ;
		var info2 = 1 + Math.floor(draw_text.length / 18);
		this._max_page = info1 + info2;


		this.drawGauge(0, 0, 204, 1, this.mpGaugeColor1(), this.crisisColor());
		this.drawText("装備情報", 0, 0, 204);
		this.drawGauge(x, 0, this.contents.width - x, 1, this.mpGaugeColor1(), this.crisisColor());
		this.drawText("選択中の装備", x, 0, 180);
		this.drawItemName(item, x + 200, y);
		
		//1ページ目
		if (this._sub_draw_index <= info1){
			//基本能力値描画
			for(var i = 0; i < param_visible.length; i++) {
				var paramId = param_visible[i];
				var x2 = x + basic_width * (i % 2);
	        	var y2 = y + lineHeight * (Math.floor(i / 2) + 1);
	        	this.changeTextColor(this.systemColor());
	        	this.drawText(TextManager.param(paramId), x2, y2, 160);
				this.resetTextColor();
	        	if(item){
					var value = item.params[paramId] == 0 ? "－" : item.params[paramId] > 0 ? ("+" + item.params[paramId]) : item.params[paramId];
					if(value > 0){this.changeTextColor(this.powerUpColor());}else if(value < 0){this.changeTextColor(this.powerDownColor());};
					this.drawText(value, x2, y2, basic_width - 20, 'right');
				}
			}

			//説明の描画
			if(item){
				var draw_pro = item.description.replace(/\r?\n/g,"").split(",");
				for(var i = 0; i < draw_pro.length; i++) {
					var y2 = y + lineHeight * (6 + i);
					this.drawTextEx(draw_pro[i], x, y2);
				}
			}
		}
		if (info1 < this._sub_draw_index && this._sub_draw_index <= this._max_page){
			//順番に描画する
			var first_line = 18 * (this._sub_draw_index - 1);
			var last_line = Math.min.apply(null, [18 * this._sub_draw_index, draw_text.length]);
			for (var i = first_line; i < last_line; i++) {
				var x2 = x + ((this.contents.width - x) / 2) * ((i - first_line) % 2);
        		var y2 = y + lineHeight * (1 + Math.floor((i - first_line) / 2)) ;
				this.drawText(draw_text[i], x2, y2, ((this.contents.width - x) / 2));
			}

		}

		this.resetTextColor();
		this.drawText("← →：表示切替" + "( " + (this._sub_draw_index + 1) + "/ " + (this._max_page + 1) + " )", x, this.contents.height - lineHeight, this.contents.width - x, 'center');
	};

	//描画INDEX4000～4999(職業情報の描画)
	Window_Main_Status.prototype.draw_index_four = function(actor, x, y) {
		var lineHeight = this.lineHeight();
		this.drawGauge(0, 0, this.contents.width, 1, this.mpGaugeColor1(), this.crisisColor());
		this.drawText("プロフィール", 0, 0, 204);

		var draw_pro = this._actor.profile().replace(/\r?\n/g,"").split(",");

		for(var i = 0; i < draw_pro.length; i++) {
			var y2 = y + lineHeight * (2 + i);
			this.drawTextEx(draw_pro[i], 0, y2);
		}
		this.resetTextColor();
	};
	//-----------------------------------------------------------------------------
	// TextManager
	//-----------------------------------------------------------------------------
	//特殊能力値の名称を返す
	TextManager.xparam = function(paramId) {
		name = 'Xparam' + String(paramId)
		return parameters[name] ? parameters[name] : '';
	};

	//追加能力値の名称を返す
	TextManager.sparam = function(paramId) {
		name = 'Sparam' + String(paramId)
		return parameters[name] ? parameters[name] : '';
	};

	//指定クラスの指定LvまでのEXP値を返す
	TextManager.expForLevel = function(class_Id, level) {
	    var c = $dataClasses[class_Id];
	    var basis = c.expParams[0];
	    var extra = c.expParams[1];
	    var acc_a = c.expParams[2];
	    var acc_b = c.expParams[3];
	    return Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
	            (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
	};
	//放り込んだ値を少数以下指定桁数までで四捨五入する
	TextManager.NumCut = function(num ,dig){
		var p = Math.pow( 10 , dig ) ;
		return Math.round( num * p ) / p ;
	};

	//特徴のテキストを返す
	TextManager.trait_txt = function(object){
		if(!object){return [];}
		var code_data = [];	var result_txt = [];
		var traits = object.constructor.name == 'Game_Actor' ? object.allTraits() : object.traits;
		//特徴リストよりCODEIDとDATAIDをテキスト抜き出す
		for (var i = 0; i < traits.length; i++) {
			if ([11,12,13,21,23,22,32,62,64].contains(traits[i].code)){
				code_data.push([traits[i].code, traits[i].dataId].toString());
			}
			if ([14,31,41,42,43,44,51,52,53,54,55,33,34,61].contains(traits[i].code)){
				code_data.push([traits[i].code, 0].toString());
			}
		}
		//特徴リストより重複を削除
		code_data = code_data.filter(function (x, i, self) { return self.indexOf(x) === i; });
		//特徴リストを扱いやすいように配列に戻す
		code_data = code_data.map(function(text){ return text.split(","); });

		//特徴リストのより、テキストをリザルトに出力
		for (var i = 0; i < code_data.length; i++) {
			var block = [Number(code_data[i][0]),Number(code_data[i][1])];
			var roop_arr = [];
		
			if ([14,31,41,42,43,44,51,52,53,54,55].contains(block[0])) {
				var data = this.traitsSet(traits, block[0]);
				switch(block[0]){
				case 14:roop_arr = data.map(function(id){return $dataStates[id].name + "無効"}); break;
				case 31:roop_arr = data.map(function(id){return $dataSystem.elements[id] + "属性"}); break;
				case 41:roop_arr = data.map(function(id){return $dataSystem.skillTypes[id] + "使用可"}); break;
				case 42:roop_arr = data.map(function(id){return $dataSystem.skillTypes[id] + "使用不可"}); break;
				case 43:roop_arr = data.map(function(id){return $dataSkills[id].name + "使用可"}); break;
				case 44:roop_arr = data.map(function(id){return $dataSkills[id].name + "使用不可"}); break;
				case 51:roop_arr = data.map(function(id){return $dataSystem.weaponTypes[id] + "装備可"}); break;
				case 52:roop_arr = data.map(function(id){return $dataSystem.armorTypes[id] + "装備可"}); break;
				case 53:roop_arr = data.map(function(id){return $dataSystem.equipTypes[id] + "固定"}); break;
				case 54:roop_arr = data.map(function(id){return $dataSystem.equipTypes[id] + "封印"}); break;
				case 55:if (Math.max.apply(null, data) == 1){ roop_arr = ["二刀流"]; }; break;
				}
				
			}
			if ([11,12,13,21,23].contains(block[0])) {
				var data = this.traitsPi(traits, block[0], block[1]) * 100;
				var data2 = '';
				switch(block[0]){
				case 11:roop_arr.push($dataSystem.elements[block[1]] + "有効度" + data + "%"); break;
				case 12:roop_arr.push(TextManager.param(block[1]) + "弱体有効度" + data + "%"); break;
				case 13:roop_arr.push($dataStates[block[1]].name + "有効度" + data + "%"); break;
				case 21:
					data2 = data > 100 ? "+" + (data - 100) : "" + (data - 100);
					roop_arr.push(TextManager.param(block[1]) + data2 + "%"); break;
				case 23:
					data2 = data > 100 ? "+" + (data - 100) : "" + (data - 100);
					if (data != 100){
						switch(block[1]){
						case 0:roop_arr.push("狙われ率" + data2 + "%"); break;
						case 1:roop_arr.push("防御効果" + data2 + "%"); break;
						case 2:roop_arr.push("回復効果" + data2 + "%"); break;
						case 3:roop_arr.push("薬知識" + data2 + "%"); break;
						case 4:roop_arr.push("MP消費率" + data2 + "%"); break;
						case 5:roop_arr.push("TP上昇率" + data2 + "%"); break;
						case 6:roop_arr.push("被物理Dmg" + data2 + "%"); break;
						case 7:roop_arr.push("被魔法Dmg" + data2 + "%"); break;
						case 8:roop_arr.push("床Dmg" + data2 + "%"); break;
						case 9:roop_arr.push("経験値" + data2 + "%"); break;
						}
					}
				}
			}
			if ([22,32].contains(block[0])) {
				var data = this.traitsSum(traits, block[0], block[1]) * 100;
				var data2 = '';
				switch(block[0]){
				case 22:
					data2 = data > 0 ? "+" + data : data;
					switch(block[1]){
					case 0:roop_arr.push("命中率" + data2 + "%"); break;
					case 1:roop_arr.push("回避率" + data2 + "%"); break;
					case 2:roop_arr.push("会心率" + data2 + "%"); break;
					case 3:roop_arr.push("会心回避" + data2 + "%"); break;
					case 4:roop_arr.push("魔法回避" + data2 + "%"); break;
					case 5:roop_arr.push("魔法反射" + data2 + "%"); break;
					case 6:roop_arr.push("反撃率" + data2 + "%"); break;
					case 7:roop_arr.push("毎ﾀｰﾝHP回復" + data2 + "%"); break;
					case 8:roop_arr.push("毎ﾀｰﾝMP回復" + data2 + "%"); break;
					case 9:roop_arr.push("毎ﾀｰﾝTP回復" + data2 + "%"); break;
					}
					break;
				case 32:
					roop_arr.push($dataStates[block[1]].name + "付与" + data2 + "%");
					break;
				}
			}
			if ([33,34].contains(block[0])) {
				var data = this.traitsSumAll(traits, block[0]);
				if (data != 0){
					switch(block[0]){
					case 33:
						if (data > 0){roop_arr.push("攻撃速度増加");}
						if (data < 0){roop_arr.push("攻撃速度減少");}
						break;
					case 34:
						if (data > 0){roop_arr.push("攻撃追加" + data + "回");}
						if (data < 0){roop_arr.push("攻撃減少" + (data * -1) + "回");}
						break;
					}
				}
			}
			if ([61].contains(block[0])) {
				var data = this.traits(traits, block[0]);
				roop_arr = data.map(function(trait){return "追加行動" + (trait.value * 100) + "%"});
			}
			if ([62,64].contains(block[0])) {
				switch(block[0]){
				case 62:
					switch(block[1]){
					case 0:roop_arr.push("自動戦闘"); break;
					case 1:roop_arr.push("自動防御"); break;
					case 2:roop_arr.push("自動献身"); break;
					case 3:roop_arr.push("TP持越"); break;
					}
					break;
				case 64:
					switch(block[1]){
					case 0:roop_arr.push("敵出現率↓"); break;
					case 1:roop_arr.push("敵出現率0"); break;
					case 2:roop_arr.push("不意打無効"); break;
					case 3:roop_arr.push("先制率上昇"); break;
					case 4:roop_arr.push("獲得金額2倍"); break;
					case 5:roop_arr.push("Drop率2倍"); break;
					}
					break;
				}
			}
			//判定したテキストを配列に追加
			Array.prototype.push.apply(result_txt, roop_arr);
		}
		return result_txt;
	};

	//特徴オブジェクトより指定コード物を抜き出す
	TextManager.traits = function(data, code) {
	    return data.filter(function(trait) { return trait.code === code;});
	};

	//特徴オブジェクトより特定のコードの物よりデータIDの配列を得る
	TextManager.traitsSet = function(data, code) {
	    return this.traits(data, code).reduce(function(r, trait) {
	        return r.concat(trait.dataId);
	    }, []);
	};

	//特徴オブジェクトより指定コード、データIDの物を抜き出す
	TextManager.traitsWithId = function(data, code, id) {
	    return data.filter(function(trait) {
	        return trait.code === code && trait.dataId === id;
	    });
	};

	//特徴オブジェクトより指定コード、データIDの乗算値を求める
	TextManager.traitsPi = function(data, code, id) {
	    return this.traitsWithId(data, code, id).reduce(function(r, trait) {
	        return r * trait.value;
	    }, 1);
	};

	//特徴オブジェクトより指定コード、データIDの加算値を求める
	TextManager.traitsSum = function(data, code, id) {
	    return this.traitsWithId(data, code, id).reduce(function(r, trait) {
	        return r + trait.value;
	    }, 0);
	};

	//特徴オブジェクトより指定コードの加算値を求める
	TextManager.traitsSumAll = function(data, code) {
	    return this.traits(data, code).reduce(function(r, trait) {
	        return r + trait.value;
	    }, 0);
	};

})();

