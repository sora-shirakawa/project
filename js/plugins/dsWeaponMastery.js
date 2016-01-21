//=============================================================================
// dsWeaponMastery.js
// Copyright (c) 2016 Douraku
// Released under the MIT License.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 武器熟練度システム ver1.01
 * @author 道楽
 *
 * @param Weapon Masteries Max
 * @desc 武器熟練度の影響を受ける武器タイプの最大数
 * @default 12
 *
 * @param Weapon Mastery Table
 * @desc 武器熟練度に使用する武器タイプのテーブル
 * 「,」区切りで熟練度の種類分必要
 * @default 1,2,3,4,5,6,7,8,9,10,11,12
 *
 * @param Weapon Mastery Icon
 * @desc 表示する武器タイプのアイコン
 * 「,」区切りで熟練度の種類分必要
 * @default 96,97,98,99,100,101,102,103,104,105,106,107
 *
 * @param Mastery Level Max
 * @desc 武器熟練度レベルの最大値
 * @default 100
 *
 * @param Mastery Exp Max
 * @desc 武器熟練度レベルアップに必要な経験値
 * この経験値は武器を使用して攻撃するごとに加算されます
 * @default 1000
 *
 * @param Add Mastery Exp
 * @desc 攻撃ごとに加算される武器熟練度経験値
 * 「,」区切りで素質の種類分必要
 * @default 5,10,15,20,25
 *
 * @param Add Damage Rate
 * @desc 熟練度上昇毎に加算されるダメージ率
 * @default 5
 *
 * @param Learning Skill Text
 * @desc スキル習得時に表示されるテキスト
 * @default %1は%2の武器熟練度が %3 に上がった！
 *
 * @help
 * このプラグインは以下のメモタグの設定が必要です。
 *
 * ----------------------------------------------------------------------------
 * アクターに設定するメモタグ
 *
 * <wmAptitude:C,S,B,A,D,C,C,B,A,A,D,C>
 *   各武器に対する適正を設定します。
 *   設定できる値は適正が低い順に「D」「C」「B」「A」「S」となっています。
 *   また、このタグの引数は「,」区切りで、
 *  「Weapon Mastery Max」の数だけ必要になります。
 *
 * ----------------------------------------------------------------------------
 * スキルに設定するメモタグ
 *
 * <wmType:1>
 *   スキルに対応する武器タイプの種類を設定します。
 *
 * <requiredWM:5>
 *   スキルを習得するために必要な武器熟練度レベルを設定します。
 *
 */

(function() {

	var parameters = PluginManager.parameters('dsWeaponMastery');
	var gMasteriesMax = Number(parameters['Weapon Masteries Max']);
	var gMasteryLevelMax = Number(parameters['Mastery Level Max']);
	var gMasteryExpMax = Number(parameters['Mastery Exp Max']);
	var gMasteryAptitudeMax = 5;
	var gAddDamageRate = Number(parameters['Add Damage Rate']) * 0.01;
	var gLearningSkillText = String(parameters['Learning Skill Text']);
	var gWMTypeTbl = [];
	if ( parameters['Weapon Mastery Table'] === '' )
	{
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			gWMTypeTbl[ii] = 1 + ii;
		}
	}
	else
	{
		var tbl = parameters['Weapon Mastery Table'].split(',');
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			gWMTypeTbl[ii] = (ii < tbl.length) ? Number(tbl[ii]) : 1 + ii;
		}
	}
	var gWMIconTbl = [];
	if ( parameters['Weapon Mastery Icon'] === '' )
	{
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			gWMIconTbl[ii] = 1 + ii;
		}
	}
	else
	{
		var tbl = parameters['Weapon Mastery Icon'].split(',');
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			gWMIconTbl[ii] = (ii < tbl.length) ? Number(tbl[ii]) : 1 + ii;
		}
	}
	var gAddMasteryExp = [];
	if ( parameters['Add Mastery Exp'] === '' )
	{
		for ( var ii = 0; ii < gMasteryAptitudeMax; ii++ )
		{
			gAddMasteryExp[ii] = 5 + ii * 5;
		}
	}
	else
	{
		var tbl = parameters['Add Mastery Exp'].split(',');
		for ( var ii = 0; ii < gMasteryAptitudeMax; ii++ )
		{
			gAddMasteryExp[ii] = (ii < tbl.length) ? Number(tbl[ii]) : 5 + ii * 5;
		}
	}


	//-------------------------------------------------------------------------
	/** Game_Action */
	var _Game_Action_calcElementRate = Game_Action.prototype.calcElementRate;
	Game_Action.prototype.calcElementRate = function(target)
	{
		var rate = _Game_Action_calcElementRate.call(this, target);
		var subject = this.subject();
		if ( subject.isActor() )
		{
			var item = this.item();
			if ( DataManager.isSkill(item) )
			{
				if ( item.id === 1 ) // 通常攻撃
				{
					subject.weapons().forEach(function(weapon)
						{
							rate *= subject.wmDamageRate(weapon.wtypeId);
						},
					subject);
				}
				else
				{
					if ( item.meta.wmType )
					{
						rate *= subject.wmDamageRate(item.meta.wmType);
					}
				}
			}
		}
		return rate;
	};

	//-------------------------------------------------------------------------
	/** Game_Actor */
	var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
	Game_Actor.prototype.initMembers = function()
	{
		_Game_Actor_initMembers.call(this);
		this._wmAptitude = [];
		this._wmLevel = [];
		this._wmExp = [];
		this._wmGainExp = [];
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			this._wmAptitude[ii] = 0;
			this._wmLevel[ii] = 0;
			this._wmExp[ii] = 0;
			this._wmGainExp[ii] = 0;
		}
	};

	var _Game_Actor_setup = Game_Actor.prototype.setup;
	Game_Actor.prototype.setup = function(actorId)
	{
		_Game_Actor_setup.call(this, actorId);
		this.initMasteries();
	};

	Game_Actor.prototype.initMasteries = function()
	{
		var actor = $dataActors[this._actorId];
		if ( actor.meta.wmAptitude )
		{
			var aptitude = actor.meta.wmAptitude.split(',');
			for ( var ii = 0; ii < gMasteriesMax; ii++ )
			{
				if ( ii < aptitude.length )
				{
					switch ( aptitude[ii] )
					{
					case 'D': this._wmAptitude[ii] = 0; break;
					case 'C': this._wmAptitude[ii] = 1; break;
					case 'B': this._wmAptitude[ii] = 2; break;
					case 'A': this._wmAptitude[ii] = 3; break;
					case 'S': this._wmAptitude[ii] = 4; break;
					}
				}
			}
		}
	};

	Game_Actor.prototype.wmLevel = function(wtypeId)
	{
		var idx = this.wmIndex(wtypeId);
		return (idx >= 0) ? this._wmLevel[idx] : 0;
	};

	Game_Actor.prototype.wmExp = function(wtypeId)
	{
		var idx = this.wmIndex(wtypeId);
		return (idx >= 0) ? this._wmExp[idx] : 0;
	};

	Game_Actor.prototype.wmExpRate = function(wtypeId)
	{
		if ( this.wmLevel(wtypeId) == gMasteryLevelMax )
		{
			return 1.0;
		}
		var idx = this.wmIndex(wtypeId);
		return (idx >= 0) ? (this._wmExp[idx] % gMasteryExpMax) / gMasteryExpMax : 0.0;
	};

	Game_Actor.prototype.wmAptitude = function(wtypeId)
	{
		var idx = this.wmIndex(wtypeId);
		return (idx >= 0) ? this._wmAptitude[idx] : 0;
	};

	Game_Actor.prototype.wmDamageRate = function(wtypeId)
	{
		var wmLevel = this.wmLevel(wtypeId);
		return 1.0 + (wmLevel * gAddDamageRate);
	};

	Game_Actor.prototype.addWMExp = function(wtypeId)
	{
		var wmExpMax = gMasteryLevelMax * gMasteryExpMax;
		var idx = this.wmIndex(wtypeId);
		if ( idx >= 0 )
		{
			var aptitude = this._wmAptitude[idx];
			this._wmGainExp[idx] += gAddMasteryExp[aptitude];
			this._wmGainExp[idx] = this._wmGainExp[idx].clamp(0, wmExpMax);
		}
	};

	var _Game_Actor_useItem = Game_Actor.prototype.useItem;
	Game_Actor.prototype.useItem = function(item)
	{
		_Game_Actor_useItem.call(this, item);
		if ( DataManager.isSkill(item) )
		{
			if ( item.id === 1 ) // 通常攻撃
			{
				this.weapons().forEach(function(weapon)
					{
						this.addWMExp(weapon.wtypeId);
					},
				this);
			}
			else
			{
				if ( item.meta.wmType )
				{
					this.addWMExp(Number(item.meta.wmType));
				}
			}
		}
	};

	Game_Actor.prototype.gainWMExp = function(show)
	{
		var wmExpMax = gMasteryLevelMax * gMasteryExpMax;
		var lastSkills = this.skills();
		var lastWMLevel = [];
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			lastWMLevel[ii] = this._wmLevel[ii];
		}
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			this._wmExp[ii] += this._wmGainExp[ii];
			this._wmExp[ii] = this._wmExp[ii].clamp(0, wmExpMax);
			this._wmGainExp[ii] = 0;
		}

		var wmLevelUp = false;
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			var wtypeId = gWMTypeTbl[ii];
			while ( this._wmExp[ii] >= (this._wmLevel[ii] + 1) * gMasteryExpMax )
			{
				if ( !this.wmLevelUp(wtypeId) )
				{
					break;
				}
				wmLevelUp = true;
			}
			while ( this._wmExp[ii] < this._wmLevel[ii] * gMasteryExpMax )
			{
				if ( !this.wmLevelDown(wtypeId) )
				{
					break;
				}
			}
		}

		if ( show && wmLevelUp )
		{
			$gameMessage.newPage();
			for ( var ii = 0; ii < gMasteriesMax; ii++ )
			{
				if ( this._wmLevel[ii] > lastWMLevel[ii] )
				{
					var wtypeId = gWMTypeTbl[ii];
					var wtypeName = $dataSystem.weaponTypes[wtypeId];
					var text = gLearningSkillText.format(this._name, wtypeName, this._wmLevel[ii]);
					$gameMessage.add(text);
				}
			}
			var newSkills = this.findNewSkills(lastSkills);
			newSkills.forEach(function(skill)
				{
					$gameMessage.add(TextManager.obtainSkill.format(skill.name));
				}
			);
		}
	};

	Game_Actor.prototype.wmLevelUp = function(wtypeId)
	{
		var idx = this.wmIndex(wtypeId);
		if ( idx >= 0 )
		{
			this._wmLevel[idx]++;
			this.skillsWMType(wtypeId).forEach(function(skill)
				{
					if ( skill.meta.requiredWM )
					{
						if ( Number(skill.meta.requiredWM) === this._wmLevel[idx] )
						{
							this.learnSkill(skill.id);
						}
					}
				},
			this, idx);
		}
		return ( idx >= 0 );
	};

	Game_Actor.prototype.wmLevelDown = function(wtypeId)
	{
		var idx = this.wmIndex(wtypeId);
		if ( idx >= 0 )
		{
			this._wmLevel[idx]--;
		}
		return ( idx >= 0 );
	};

	Game_Actor.prototype.wmIndex = function(wtypeId)
	{
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			if ( gWMTypeTbl[ii] === wtypeId )
			{
				return ii;
			}
		}
		return -1;
	};

	Game_Actor.prototype.skillsWMType = function(wtypeId)
	{
		return $dataSkills.filter(function(skill)
			{
				if ( skill )
				{
					if ( skill.meta.wmType )
					{
						if ( Number(skill.meta.wmType) === wtypeId )
						{
							return true;
						}
					}
				}
			},
		wtypeId);
	};

	//-------------------------------------------------------------------------
	/** Window_Base */
	Window_Base.prototype.wmColor1 = function()
	{
		return this.textColor(28);
	};

	Window_Base.prototype.wmColor2 = function()
	{
		return this.textColor(29);
	};

	Window_Base.prototype.lvColor = function()
	{
		return this.textColor(20);
	};

	Window_Base.prototype.wmIcon = function(wtypeId)
	{
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			if ( gWMTypeTbl[ii] === wtypeId )
			{
				return gWMIconTbl[ii];
			}
		}
		return 0;
	};

	Window_Base.prototype.drawMasteryGauge = function(actor, wtypeId, x, y, width)
	{
		var name = $dataSystem.weaponTypes[wtypeId];
		var iconBoxWidth = Window_Base._iconWidth + 4;
		var labelWidth = this.textWidth('LV');
		var valueWidth = this.textWidth('000');
		var gaugeWidth = width - iconBoxWidth * 2 - labelWidth - valueWidth - 4;
		var x1 = x + iconBoxWidth;
		var x2 = x + width - labelWidth - valueWidth - iconBoxWidth;
		var x3 = x + width - valueWidth - iconBoxWidth;
		var x4 = x + width - iconBoxWidth;
		var color1 = this.wmColor1();
		var color2 = this.wmColor2();
		var color3 = this.lvColor();
		this.drawGauge(x1, y, gaugeWidth, actor.wmExpRate(wtypeId), color1, color2);
		this.drawIcon(this.wmIcon(wtypeId), x + 2, y + 2);
		this.changeTextColor(this.systemColor());
		this.drawText(name, x1, y, width);
		this.changeTextColor(color3);
		this.drawText('LV', x2, y, labelWidth);
		this.resetTextColor();
		this.drawText(actor.wmLevel(wtypeId), x3, y, valueWidth, 'right');
		this.drawAptitude(actor.wmAptitude(wtypeId), x4 + 2, y + 2);
	};

	Window_Base.prototype.drawMasteryLevel = function(actor, wtypeId, x, y, width)
	{
		var label = 'LV';
		this.changeTextColor(this.lvColor());
		this.drawText(label, x, y, width);
		this.resetTextColor();
		this.drawText(actor.wmLevel(wtypeId), x, y, width, 'right');
	};

	Window_Base.prototype.drawAptitude = function(aptitude, x, y)
	{
		var bitmap = ImageManager.loadSystem('WMAptitude');
		var pw = Window_Base._iconWidth;
		var ph = Window_Base._iconHeight;
		var sx = aptitude * pw;
		var sy = 0;
		this.contents.blt(bitmap, sx, sy, pw, ph, x, y);
	};

	//-------------------------------------------------------------------------
	/** Window_Status */
	var _Window_Status_initialize = Window_Status.prototype.initialize;
	Window_Status.prototype.initialize = function()
	{
		this._switchWM = false;
		_Window_Status_initialize.call(this);
	};

	var _Window_Status_processOk = Window_Status.prototype.processOk;
	Window_Status.prototype.processOk = function()
	{
		this._switchWM = this._switchWM ? false : true;
		this.playOkSound();
		this.refresh();
	};

	Window_Status.prototype.isOkEnabled = function()
	{
		return true;
	};

	var _Window_Status_drawBlock3 = Window_Status.prototype.drawBlock3;
	Window_Status.prototype.drawBlock3 = function(y)
	{
		if ( this._switchWM )
		{
			this.drawMasteries(48, y);
		}
		else
		{
			_Window_Status_drawBlock3.call(this, y);
		}
	};

	Window_Status.prototype.drawMasteries = function(x, y)
	{
		var lineHeight = this.lineHeight();
		for ( var ii = 0; ii < gMasteriesMax; ii++ )
		{
			var wtypeId = gWMTypeTbl[ii];
			var row = Math.floor(ii / 2);
			var col = ii % 2;
			this.drawMasteryGauge(this._actor, wtypeId, x+342*col, y+lineHeight*row, 342);
		}
	};

	//-------------------------------------------------------------------------
	/** Scene_Boot */
	var _Scene_Boot_loadSystemImages = Scene_Boot.prototype.loadSystemImages;
	Scene_Boot.prototype.loadSystemImages = function()
	{
		_Scene_Boot_loadSystemImages.call(this);
		ImageManager.loadSystem('WMAptitude');
	};

	//-------------------------------------------------------------------------
	/** BattleManager */
	var _BattleManager_gainRewards = BattleManager.gainRewards;
	BattleManager.gainRewards = function()
	{
		_BattleManager_gainRewards.call(this);
		this.gainWMExp();
	};

	BattleManager.gainWMExp = function()
	{
		$gameParty.allMembers().forEach(function(actor)
			{
				actor.gainWMExp(true);
			}
		);
	};

})();

