//=============================================================================
// MyState.js
// Version: 0.01
//=============================================================================
/*:
 * @plugindesc Time of the attack, put the state on his own.
 * @author karakasr_dool
 * @help
 * I will fill in the skills of the memo field
 * <mystate:id>
 *
 * Example: confused after attack
 * <mystate:8>
 */
 // ↓:jpで日本語
/*:ja
 * @plugindesc 攻撃時、自分にステートをつける.
 * @author 唐傘ドール
 * @help
 * スキルのメモ欄に記入する
 * <mystate:id>
 *
 * 例:攻撃後混乱する
 * <mystate:8>
 */

(function() {
	var old_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
	    old_apply.call(this, target);
	    var n = this.item().meta.mystate;
	    if(n){
	    	n = parseInt(n);
	    	var unit = this.subject();
	    	var alreadyDead = unit.isDead();
	    	unit.addState(n);
	    	if (unit.isDead() && !alreadyDead) { unit.performCollapse(); }
	    	unit.clearResult();
	    }
	};
})();

