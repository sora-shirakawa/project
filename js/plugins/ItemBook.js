//=============================================================================
// ItemBook.js
//=============================================================================
 
/*:
 * @plugindesc v1.4a by SkottyTV // Displays detailed statuses of items.
 * @author Yoji Ojima & SkottyTV (thx to DragonPC)
 *
 * @param ----- Functions -----
 *
 * @param Unknown Data
 * @desc The index name for an unknown item.
 * @default ??????
 *
 * @param AutoFill
 * @desc Decide if items will automaticly show up in the book
 * when collected. (true or false)
 * @default true
 *
 * @param Gold Icon
 * @desc Decide if you want to use the Gold Icon from
 * Yanfly Core Engine. (true or false)
 * @default true
 *
 * @param Items in Row
 * @desc Decide how many items you want to show up in one row.
 * (default 1)
 * @default 1
 *
 * @param Show Key Items
 * @desc Decide if you want to show the Key Items.
 * (default true)
 * @default true
 *
 * @param Half Index Height
 * @desc Decide if you want to half the Index Window height.
 * (default - true) (false will get overwritten by the damage window!)
 * @default true
 *
 * @param Max Effects Count
 * @desc Decide how many skills will be shown.
 * (default - 7) (7 is recommended for small resolutions!)
 * @default 7
 *
 * @param Max Skill Characters
 * @desc Maximun amount of Characters displayed before "...".
 * @default 17
 *
 * @param ----- Switches -----
 *
 * @param Show Price Switch
 * @desc Choose the switch ID that shows the price.
 * (default 0)
 * @default 0
 *
 * @param Show Effects Switch
 * @desc Choose the switch ID that shows the effects.
 * (default 0)
 * @default 0
 *
 * @param Show Equip/Type Switch
 * @desc Choose the switch ID that shows the equip/type.
 * (default 0)
 * @default 0
 *
 * @param Show Parameters Switch
 * @desc Choose the switch ID that shows the parameters.
 * (default 0)
 * @default 0
 *
 * @param ----- Visuals -----
 *
 * @param Line Opacity
 * @desc Choose the opacity for the lines.
 * (default - 120)
 * @default 120
 *
 * @param Effects Values Color
 * @desc Choose the color for the effects values.
 * (default - 3)
 * @default 3
 *
 * @param ----- Text -----
 *
 * @param Effects Text
 * @desc The text for "Effects".
 * @default Effects
 * 
 * @param Parameter Text
 * @desc The text for "Parameter".
 * @default Parameter
 * 
 * @param HP Regeneration Text
 * @desc The text for "HP Regen".
 * @default HP Regen:
 *
 * @param MP Regeneration Text
 * @desc The text for "MP Regen".
 * @default MP Regen:
 *
 * @param TP Gain Text
 * @desc The text for "TP Gain".
 * @default TP Gain:
 *
 * @param Add State Text
 * @desc The text for "Add State".
 * @default Add State:
 *
 * @param Remove State Text
 * @desc The text for "Remove State".
 * @default Remove State:
 *
 * @param Element Text
 * @desc The text for "Element".
 * @default Element:
 *
 * @param Element Rate Text
 * @desc The text for "Element Rate".
 * @default Element Rate:
 *
 * @param Attack Speed Text
 * @desc The text for "Attack Speed".
 * @default Attack Speed:
 *
 * @param Learn Skill Text
 * @desc The text for "Learn Skill".
 * @default Learn Skill:
 *
 * @param Equip Text
 * @desc The text for "Equip".
 * @default Equip:
 *
 * @param Type Text
 * @desc The text for "Type".
 * @default Type:
 *
 * @param Item Type Text
 * @desc The text for "Item Type".
 * @default Item Type:
 *
 * @param Success Rate Text
 * @desc The text for "Success Rate".
 * @default Success Rate:
 *
 * @help
 *
 * ============================================================================
 * SkottyTV v1.1 ->
 *     
 * - Decide if items will get an entry automaticly when they collected!
 * - Decide how many items appear in one row!
 * - Decide if you want to use the Gold Icon from Yanflys Core Engine!
 * - Advanced Visual upgrades!
 *
 * SkottyTV v1.2 ->
 *
 * - Visual upgrades!
 *
 * SkottyTV v1.3 ->
 *
 * - Decide if you want to half the Index height.
 * - Decide if you want to show Key Items.
 * - Advanced Visual upgrades!
 * - Use switches to enable different information!
 *   (Price, Equip/Type, Stats)
 *
 * SkottyTV v1.4a ->
 *
 * - Advanced Visual upgrades!
 * - Added traits and effects window!
 * - Use switches to enable different windows and informations!
 *   (Price, Equip/Type, Effects, Parameters)
 * - Added Max Character Length for Skills and States text.(see bottom of help)
 * - Bug fixes!
 * 
 * ============================================================================
 *
 * Plugin Command:
 *   ItemBook open             # Open the item book screen
 *   ItemBook add item 1       # Add item #1 to the item book
 *   ItemBook add weapon 2     # Add weapon #2 to the item book
 *   ItemBook add armor 3      # Add armor #3 to the item book
 *   ItemBook remove item 4    # Remove item #4 from the item book
 *   ItemBook remove weapon 5  # Remove weapon #5 from the item book
 *   ItemBook remove armor 6   # Remove armor #6 from the item book
 *   ItemBook complete         # Complete the item book
 *   ItemBook clear            # Clear the item book
 *
 * Item (Weapon, Armor) Note:
 *   <book:no>                # This item does not appear in the item book
 *   
 * ============================================================================
 * 
 *   How to get Max Character Length for Skills and States text.
 *   (to prevent Clipping, customizable by your for your skills and states.)
 *   (keep in mind your longest skills and stats, count characters AND spaces
 *   to get the number then subtract 3(for the dots) and you get your max
 *   displayable characters)
 *   
 */
 
(function() {
 
    var parameters = PluginManager.parameters('ItemBook');
    var unknownData = String(parameters['Unknown Data'] || '??????');
    var autoFill = String(parameters['AutoFill'] || 'true');
    var goldIcon = String(parameters['Gold Icon'] || 'true');
    var ShowKeyItems = String(parameters['Show Key Items'] || 'true');
    var IndexHeight = String(parameters['Half Index Height'] || 'true');
    var listRow = Number(parameters['Items in Row'] || 1);
    var maxEffects = Number(parameters['Max Effects Count'] || 7);
    
    var ShowPrice = Number(parameters['Show Price Switch'] || 0);
    var ShowEffects = Number(parameters['Show Effects Switch'] || 0);
    var ShowTypes = Number(parameters['Show Equip/Type Switch'] || 0);
    var ShowParams = Number(parameters['Show Parameters Switch'] || 0);

    var lineOpac = Number(parameters['Line Opacity'] || 120);
    var posColor = Number(parameters['Effects Values Color'] || 3);
    
    var Effects = String(parameters['Effects Text'] || 'Effects');
    var parText = String(parameters['Parameter Text'] || 'Parameter');
    var hpReg = String(parameters['HP Regeneration Text'] || 'HP Regen:');
    var mpReg = String(parameters['MP Regeneration Text'] || 'MP Regen:');
    var tpReg = String(parameters['TP Gain Text'] || 'TP Gain:');
    var addState = String(parameters['Add State Text'] || 'Add State:');
    var remState = String(parameters['Remove State Text'] || 'Remove State:');
    var elementText = String(parameters['Element Text'] || 'Element:');
    var elementRate = String(parameters['Element Rate Text'] || 'Element Rate:');
    var attackSpeed = String(parameters['Attack Speed Text'] || 'Attack Speed:');
    var learnSkill = String(parameters['Learn Skill Text'] || 'Learn Skill:');
    var max = Number(parameters['Max Skill Characters'] || 17);
    
    var equipText = String(parameters['Equip Text'] || 'Equip:');
    var typeText = String(parameters['Type Text'] || 'Type:');
    var itemTypeText = String(parameters['Item Type Text'] || 'Item Type:');
    var sucRateText = String(parameters['Success Rate Text'] || 'Success Rate:');
    
        var arr = [0,1,2,3,4,5,6,7,8,9,10,hpReg,mpReg,tpReg,
                   14,15,16,17,18,19,20,addState,remState,23,24,25,26,27,28,29,
                   30,31,32,33,34,35,36,37,38,39,40,41,42,learnSkill,44,45,46,47,48,49,50];
        var arr2 = [0,1,2,3,4,5,6,7,8,9,10,elementRate,12,13,
                   14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,
                   30,elementText,32,attackSpeed,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50];
        var arrl = [hpReg,mpReg,tpReg,addState,remState,learnSkill,elementRate,elementText,sucRateText,itemTypeText,attackSpeed]
        
        var lgth = 0;
        var longest
        var distance = 10;

        for(var i=0; i < arrl.length; i++){
            if(arrl[i].length > lgth){
                var lgth = arrl[i].length;
                var longest = arrl[i];
            }      
        }
    
    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'ItemBook') {
            switch (args[0]) {
            case 'open':
                SceneManager.push(Scene_ItemBook);
                break;
            case 'add':
                $gameSystem.addToItemBook(args[1], Number(args[2]));
                break;
            case 'remove':
                $gameSystem.removeFromItemBook(args[1], Number(args[2]));
                break;
            case 'complete':
                $gameSystem.completeItemBook();
                break;
            case 'clear':
                $gameSystem.clearItemBook();
                break;
            }
        }
    };
 
    Game_System.prototype.addToItemBook = function(type, dataId) {
        if (!this._ItemBookFlags) {
            this.clearItemBook();
        }
        var typeIndex = this.itemBookTypeToIndex(type);
        if (typeIndex >= 0) {
            this._ItemBookFlags[typeIndex][dataId] = true;
        }
    };
 
    Game_System.prototype.removeFromItemBook = function(type, dataId) {
        if (this._ItemBookFlags) {
            var typeIndex = this.itemBookTypeToIndex(type);
            if (typeIndex >= 0) {
                this._ItemBookFlags[typeIndex][dataId] = false;
            }
        }
    };
 
    Game_System.prototype.itemBookTypeToIndex = function(type) {
        switch (type) {
        case 'item':
            return 0;
        case 'weapon':
            return 1;
        case 'armor':
            return 2;
        default:
            return -1;
        }
    };
 
    Game_System.prototype.completeItemBook = function() {
        var i;
        this.clearItemBook();
        for (i = 1; i < $dataItems.length; i++) {
            this._ItemBookFlags[0][i] = true;
        }
        for (i = 1; i < $dataWeapons.length; i++) {
            this._ItemBookFlags[1][i] = true;
        }
        for (i = 1; i < $dataArmors.length; i++) {
            this._ItemBookFlags[2][i] = true;
        }
    };
 
    Game_System.prototype.clearItemBook = function() {
        this._ItemBookFlags = [[], [], []];
    };
 
    Game_System.prototype.isInItemBook = function(item) {
        if (this._ItemBookFlags && item) {
            var typeIndex = -1;
            if (DataManager.isItem(item)) {
                typeIndex = 0;
            } else if (DataManager.isWeapon(item)) {
                typeIndex = 1;
            } else if (DataManager.isArmor(item)) {
                typeIndex = 2;
            }
            if (typeIndex >= 0) {
                return !!this._ItemBookFlags[typeIndex][item.id];
            } else {
                return false;
            }
        } else {
            return false;
        }
    };
 
    var _Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        _Game_Party_gainItem.call(this, item, amount, includeEquip);
        if (item && amount > 0) {
            var type;
            if (DataManager.isItem(item)) {
                type = 'item';
            } else if (DataManager.isWeapon(item)) {
                type = 'weapon';
            } else if (DataManager.isArmor(item)) {
                type = 'armor';
            }
           
            if (autoFill === 'true') {
                $gameSystem.addToItemBook(type, item.id);
            }
        }
    };
 
    function Scene_ItemBook() {
        this.initialize.apply(this, arguments);
    }
 
    Scene_ItemBook.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_ItemBook.prototype.constructor = Scene_ItemBook;
 
    Scene_ItemBook.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
 
    Scene_ItemBook.prototype.create = function() {
       
        var w3 = Graphics.boxWidth / 3;
        var ww = (Graphics.boxWidth / 3)*2 + 2;
        var wh = Graphics.boxHeight / 10;
       
        Scene_MenuBase.prototype.create.call(this);
        this._indexWindow = new Window_ItemBookIndex(0, 0);
        this._indexWindow.setHandler('cancel', this.popScene.bind(this));
 
        this._statusWindow = new Window_ItemBookStatus(w3, 0, ww, wh*3);
        this._statusWindow2 = new Window_ItemBookStatus2(w3, wh*3, ww, wh*5.5);
        
        if ($gameSwitches.value(ShowEffects) === true || ShowEffects === 0) {
            this._statusWindow3 = new Window_ItemBookStatus3(w3, wh*8.5, ww, wh*1.5); }
        else {
            this._statusWindow3 = new Window_ItemBookStatus3(w3, wh*3, ww, wh*1.5); }
            
        this._statusWindow4 = new Window_ItemBookStatus4(0, wh*5, Graphics.boxWidth/3, wh*5);
        this.addWindow(this._indexWindow);
        this.addWindow(this._statusWindow);
        
        if ($gameSwitches.value(ShowEffects) === true || ShowEffects === 0) {
            this.addWindow(this._statusWindow2); }
            
        if ($gameSwitches.value(ShowTypes) === true || ShowTypes === 0) {
            this.addWindow(this._statusWindow3); }
            
        if ($gameSwitches.value(ShowParams) === true || ShowParams === 0) {    
        this.addWindow(this._statusWindow4); }
        
        this._indexWindow.setStatusWindow(this._statusWindow);
        this._indexWindow.setStatusWindow2(this._statusWindow2);
        this._indexWindow.setStatusWindow3(this._statusWindow3);
        this._indexWindow.setStatusWindow4(this._statusWindow4);
    };
 
    function Window_ItemBookIndex() {
        this.initialize.apply(this, arguments);
    }
 
    Window_ItemBookIndex.prototype = Object.create(Window_Selectable.prototype);
    Window_ItemBookIndex.prototype.constructor = Window_ItemBookIndex;
 
    Window_ItemBookIndex.lastTopRow = 0;
    Window_ItemBookIndex.lastIndex  = 0;
 
    Window_ItemBookIndex.prototype.initialize = function(x, y) {
        var width = Graphics.boxWidth / 3;
        if ($gameSwitches.value(ShowParams) === true || ShowParams === 0 || IndexHeight === "true") { 
            var height = Graphics.boxHeight/2;
        }
        else{
            var height = Graphics.boxHeight;
        }
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.setTopRow(Window_ItemBookIndex.lastTopRow);
        this.select(Window_ItemBookIndex.lastIndex);
        this.activate();
    };
 
    Window_ItemBookIndex.prototype.maxCols = function() {
        return listRow;
    };
 
    Window_ItemBookIndex.prototype.maxItems = function() {
        return this._list ? this._list.length : 0;
    };
 
    Window_ItemBookIndex.prototype.setStatusWindow = function(statusWindow) {
        this._statusWindow = statusWindow;
        this.updateStatus();
    };
    Window_ItemBookIndex.prototype.setStatusWindow2 = function(statusWindow2) {
        this._statusWindow2 = statusWindow2;
        this.updateStatus();
    };
    Window_ItemBookIndex.prototype.setStatusWindow3 = function(statusWindow3) {
        this._statusWindow3 = statusWindow3;
        this.updateStatus();
    };
    Window_ItemBookIndex.prototype.setStatusWindow4 = function(statusWindow4) {
        this._statusWindow4 = statusWindow4;
        this.updateStatus();
    };
 
    Window_ItemBookIndex.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateStatus();
    };
 
    Window_ItemBookIndex.prototype.updateStatus = function() {
        if (this._statusWindow) {
            var item = this._list[this.index()];
            this._statusWindow.setItem(item);
        }
        if (this._statusWindow2) {
            var item = this._list[this.index()];
            this._statusWindow2.setItem(item);
        }
        if (this._statusWindow3) {
            var item = this._list[this.index()];
            this._statusWindow3.setItem(item);
        }
        if (this._statusWindow4) {
            var item = this._list[this.index()];
            this._statusWindow4.setItem(item);
        }
    };
 
    Window_ItemBookIndex.prototype.refresh = function() {
        var i, item;
        this._list = [];
        for (i = 1; i < Math.min(2000, $dataItems.length); i++) {
            item = $dataItems[i];
            if (item && item.name && item.itypeId === 1 && item.meta.book !== 'no') {
                this._list.push(item);
            }
        }
        if (ShowKeyItems === 'true') {                
        for (i = 1; i < Math.min(2000, $dataItems.length); i++) {
            item = $dataItems[i];
            if (item && item.name && item.itypeId === 2 && item.meta.book !== 'no') {
                this._list.push(item);
            }
        }
        }
        for (i = 1; i < Math.min(2000, $dataWeapons.length); i++) {
            item = $dataWeapons[i];
            if (item && item.name && item.meta.book !== 'no') {
                this._list.push(item);
            }
        }
        for (i = 1; i < Math.min(2000, $dataArmors.length); i++) {
            item = $dataArmors[i];
            if (item && item.name && item.meta.book !== 'no') {
                this._list.push(item);
            }
        }
        this.createContents();
        this.drawAllItems();
    };
 
    Window_ItemBookIndex.prototype.drawItem = function(index) {
        var item = this._list[index];
        var rect = this.itemRect(index);
        var width = rect.width - this.textPadding();
        if ($gameSystem.isInItemBook(item)) {
            this.drawItemName(item, rect.x, rect.y, width);
        } else {
            var iw = Window_Base._iconWidth + 4;
            this.drawText(unknownData, rect.x + iw, rect.y, width - iw);
        }
    };
 
    Window_ItemBookIndex.prototype.processCancel = function() {
        Window_Selectable.prototype.processCancel.call(this);
        Window_ItemBookIndex.lastTopRow = this.topRow();
        Window_ItemBookIndex.lastIndex = this.index();
    };
 
    function Window_ItemBookStatus() {
        this.initialize.apply(this, arguments);
    }
    function Window_ItemBookStatus2() {
        this.initialize.apply(this, arguments);
    }
    function Window_ItemBookStatus3() {
        this.initialize.apply(this, arguments);
    }
    function Window_ItemBookStatus4() {
        this.initialize.apply(this, arguments);
    }
 
    Window_ItemBookStatus.prototype = Object.create(Window_Base.prototype);
    Window_ItemBookStatus.prototype.constructor = Window_ItemBookStatus;
   
    Window_ItemBookStatus2.prototype = Object.create(Window_Base.prototype);
    Window_ItemBookStatus2.prototype.constructor = Window_ItemBookStatus2;
   
    Window_ItemBookStatus3.prototype = Object.create(Window_Base.prototype);
    Window_ItemBookStatus3.prototype.constructor = Window_ItemBookStatus3;

    Window_ItemBookStatus4.prototype = Object.create(Window_Base.prototype);
    Window_ItemBookStatus4.prototype.constructor = Window_ItemBookStatus4;
 
    Window_ItemBookStatus.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
    };
 
    Window_ItemBookStatus.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };
    Window_ItemBookStatus2.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };
    Window_ItemBookStatus3.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };
    Window_ItemBookStatus4.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };
 
    Window_ItemBookStatus.prototype.refresh = function() {
        var item = this._item;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();
 
        this.contents.clear();
 
        if (!item || !$gameSystem.isInItemBook(item)) {
            return;
        }
       
        this.drawItemName(item, x-1, y);
        
        this.contents.paintOpacity = lineOpac;
        this.contents.fillRect(x, 40, this.contents.width, 2, this.normalColor());
        this.contents.paintOpacity = 255;
        
        this.drawTextEx(item.description, x, (lineHeight)+10);
        
        if ($gameSwitches.value(ShowPrice) === true || ShowPrice === 0) {
            var price = item.price > 0 ? item.price : '-';
       
            if (goldIcon === 'true') {     
                this.drawText(price, this.contents.width - 42 - this.textWidth(price), this.contents.height - lineHeight);
                this.drawIcon(Yanfly.Icon.Gold, this.contents.width - 32, this.contents.height - lineHeight);
            } else {
                this.drawText(price, this.contents.width - this.textWidth(price) - this.textWidth(TextManager.currencyUnit) - 10, this.contents.height - lineHeight);
                this.changeTextColor(this.systemColor());
                this.drawText(TextManager.currencyUnit, this.contents.width - this.textWidth(TextManager.currencyUnit), this.contents.height - lineHeight);
                this.resetTextColor();
            }
        }   
 
    };
 
    Window_ItemBookStatus2.prototype.refresh = function() {
        var item = this._item;
        var x = 0;
        var y = 0;
        var lineHeight = this.lineHeight();
 
        this.contents.clear();
 
        if (!item || !$gameSystem.isInItemBook(item)) {
            return;
        }
            
        this.drawText(Effects, this.contents.width/2 - this.textWidth(Effects)/2, y);
        y += lineHeight + 6;
        
        this.contents.paintOpacity = lineOpac;
        this.contents.fillRect(x, lineHeight, this.contents.width, 2, this.normalColor());
        this.contents.paintOpacity = 255;   
        
        var x1 = x + distance + this.textWidth(longest);
            
        if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            
            for (var j = 0; j < item.traits.length && j < maxEffects; j++) {
            
//---------------------------------------------------------- Is -> Element / Rate ---------------------------------------------  
                var it = item.traits[j];
                    if (it.code === 11 || it.code === 31) {
                        
                        this.changeTextColor(this.systemColor());
                        this.drawText(arr2[it.code], x, y);
                        this.resetTextColor();
                        
                        if (it.code === 31) {
                        var x2 = x1;
                        }else{
                        var x2 = x1 + 56;
                        this.changeTextColor(this.textColor(posColor));
                        this.drawText(Math.round(it.value*100) + "%", x1, y);
                        }
                        this.resetTextColor();
                        this.drawText($dataSystem.elements[it.dataId] + " ", x2, y);

                     y += lineHeight; 
                    }
//---------------------------------------------------------- Is -> Attack Speed --------------------------------------------- 
                    if (it.code === 33) {
                        
                        this.changeTextColor(this.systemColor());
                        this.drawText(arr2[it.code], x, y);
                        this.resetTextColor();
                        
                        var x2 = x1 + 56;
                        this.changeTextColor(this.textColor(posColor));
                        this.drawText(Math.round(it.value), x1, y);
                        this.resetTextColor();

                     y += lineHeight; 
                    }
//---------------------------------------------------------- Is -> Learn Skill --------------------------------------------- 
                    if (it.code === 43) {
                        
                        var Icon = $dataSkills[it.dataId].iconIndex;
                        var Name = $dataSkills[it.dataId].name;
                        
                        this.changeTextColor(this.systemColor());
                        this.drawText(arr[it.code], x, y);
                        this.resetTextColor();
                        
                        this.drawIcon(Icon, x1, y);
                        this.drawText(Name, x1+40, y);    
                     y += lineHeight;   
                    }
//---------------------------------------------------------------------------------------------------------------------------------
            }
            
        }
        else{
            
//---------------------------------------------------------- ITEM EFFECTS Create ----------------------------------------------------       
        
        for (var j = 0; j < item.effects.length && j < maxEffects; j++) {
            
//---------------------------------------------------------- Is -> HP / MP / TP - Regen ---------------------------------------------  
                var ie = item.effects[j];
                    if (ie.code === 11 || ie.code === 12 || ie.code === 13) {
                        var x2 = x1 + this.textWidth("+" + Math.round(ie.value1*100) + "% ");
                        var x3 = x2 + this.textWidth("- ");
                        
                        this.changeTextColor(this.systemColor());
                        this.drawText(arr[ie.code ], x, y);
                        this.resetTextColor();
                        
                        if (ie.value1 > 0 && ie.value2 > 0) {
                            this.changeTextColor(this.textColor(posColor));
                            this.drawText("+" + Math.round(ie.value1*100) + "%",x1, y);
                            this.resetTextColor();
                            
                            this.changeTextColor(this.systemColor());
                            this.drawText(",", x2, y);
                            this.resetTextColor();
                            
                            this.changeTextColor(this.textColor(posColor));
                            this.drawText("+" + Math.round(ie.value2), x3, y);
                            this.resetTextColor();
                        }
                        else if (ie.value1 > 0) {
                            this.changeTextColor(this.textColor(posColor));
                            if (ie.code === 13) {
                                this.drawText("+" + Math.round(ie.value1), x1, y);
                            }
                            else {
                                this.drawText("+" + Math.round(ie.value1*100) + "%", x1, y);
                            }
                            this.resetTextColor();
                        }
                        else if (ie.value2 > 0) {
                            this.changeTextColor(this.textColor(posColor));
                            this.drawText("+" + Math.round(ie.value2), x1, y);
                            this.resetTextColor();
                        }
                     y += lineHeight; 
                    }
//----------------------------------------------------------------------------------------------------------------------------------                       
         
//---------------------------------------------------------- Is -> Add/Remove State ------------------------------------------------                    
                    if (ie.code === 21 ||ie.code === 22) {
                        
                        var Icon = $dataStates[ie.dataId].iconIndex;
                        var Name = $dataStates[ie.dataId].name;
                        
                        this.changeTextColor(this.systemColor());
                        this.drawText(arr[ie.code], x, y);
                        this.resetTextColor();
                        
                        this.drawText(Math.round(ie.value1*100) + "% ", x1, y, 60, "right"); 
                        this.drawIcon(Icon, x1+56, y);
                            if (Name.length >= max) {
                            var newLength = name.length - (Name.length - max) - 4
                            this.drawText(Name.slice(0,newLength) + "...", x1+96, y)
                        }
                        else {
                        this.drawText(Name, x1+96, y);}
                     y += lineHeight;   
                    }
//---------------------------------------------------------------------------------------------------------------------------------

//---------------------------------------------------------- Is -> Learn Skill ----------------------------------------------------                   
                    if (ie.code === 43) {
                        
                        var Icon = $dataSkills[ie.dataId].iconIndex;
                        var Name = $dataSkills[ie.dataId].name;

                        this.changeTextColor(this.systemColor());
                        this.drawText(arr[ie.code], x, y);
                        this.resetTextColor();
                        
                        this.drawIcon(Icon, x1, y);
                        if (Name.length >= max) {
                            var newLength = name.length - (Name.length - max)
                            this.drawText(Name.slice(0,newLength) + "...", x1+40, y)
                        }
                        else {
                        this.drawText(Name, x1+40, y); }   
                     y += lineHeight;   
                    }
//---------------------------------------------------------------------------------------------------------------------------------
            } 
            
        }
    };
  
    Window_ItemBookStatus3.prototype.refresh = function() {
        var item = this._item;
        var x = 0;
        var y = -5;
        var lineHeight = this.lineHeight();
 
        this.contents.clear();
 
        if (!item || !$gameSystem.isInItemBook(item)) {
            return;
        }
        
            if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            
                var etype = $dataSystem.equipTypes[item.etypeId];
                var type;
            
                if (DataManager.isWeapon(item)) {
                    type = $dataSystem.weaponTypes[item.wtypeId];
                } else {
                    type = $dataSystem.armorTypes[item.atypeId];
                }
            
                this.changeTextColor(this.systemColor());
                this.drawText(equipText, x, y);
                this.drawText(typeText, x, y+lineHeight-5);
                this.resetTextColor();
                this.drawText(etype, x + this.textWidth(longest) + distance, y);
                this.drawText(type, x + this.textWidth(longest) + distance, y+lineHeight-5);

            }
            else {
            
                this.changeTextColor(this.systemColor());
                this.drawText(itemTypeText, x, y);
                this.drawText(sucRateText, x, y+lineHeight-5);
                this.resetTextColor();
            
                if (item.itypeId === 1) {
                    this.drawText(TextManager.item, x + this.textWidth(longest) + distance, y);
                }
                else{
                    this.drawText(TextManager.keyItem, x + this.textWidth(longest) + distance, y);
                }
                this.drawText(item.successRate + "%", x + this.textWidth(longest) + distance, y+lineHeight-5);
            } 
    };
    
    Window_ItemBookStatus4.prototype.refresh = function() {
        var item = this._item;
        var lineHeight = this.lineHeight();
        var x = 0;
        var y = lineHeight-8;

        this.contents.clear();

        if (!item || !$gameSystem.isInItemBook(item)) {
            return;
        }
        
        if (DataManager.isWeapon(item) || DataManager.isArmor(item)) {
            
            this.drawText(parText, this.contents.width/2-this.textWidth(parText)/2, -8);
            
            this.contents.paintOpacity = lineOpac;
            this.contents.fillRect(x, 25, this.contents.width, 2, this.normalColor());
            this.contents.paintOpacity = 255;
            
            for (var i = 0; i < 8; i++) {
                this.changeTextColor(this.systemColor());
                this.drawText(TextManager.param(i), x, y);
                this.resetTextColor();
                if (item.params[i] === 0) {
                    this.drawText("-", x + 170, y, 60, 'right');
                } else{
                    this.drawText(item.params[i], x + 170, y, 60, 'right');
                }
                y += lineHeight-5;
            }
        }
        
    };
})();