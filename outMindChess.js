var attacker = undefined;
var attackTarget = undefined;
var currentCamp = 1;
var camps = {
	1:{
		attacknum:1,
		movenum:1
	},
	2:{
		attacknum:1,
		movenum:1
	}
}


function Chess(obj){
	this._chessName = obj.chessName;
	this._chessImg = obj.chessImg;
	this._initMoveNodes = [];
	this._moveColorNodes = [];
	this._damageColorNodes = [];
	this._skill = obj.skill;
	this._startLocation = obj.startLocation;
	this._checkerBoard = obj.checkerBoard;
	this._moveColorBoard = obj.moveColorBoard;
	this._grid = obj.grid;

	this._hero = obj.hero;
	this._moveRangeNodes = [];
	this._damageRangeNodes = [];
	this.init();
}

Chess.prototype = {
	init:function(){
		this.moveInit();
		this.heroInit();
	},
	creatChess:function(){
		var _this = this;
		this._chess = $("<img src='./imgs/"+_this._chessImg+".png' class='heroicon' draggable='true' id='"+_this._chessName+"'>");
	},
	moveInit:function(){
		var _this = this;
		this.creatChess();
		this.putChess(_this._startLocation);
		this.bindChessEvent();
	},
	heroInit:function(){
		var _this = this;
		this.getMoveRangeNodes();
	},
	/*----基本移动逻辑模块----*/
	putChess:function(Coordinate){
		var _this = this;
		var index = help.getIndex(Coordinate);
		this._grid.eq(index).append(_this._chess);
	},
	bindChessEvent:function(){
		/*-初次放置棋子定位-*/
		var _this = this;
		var parent = this._chess.parent();
		var neighbors = help.getRound(_this._hero.moveRange, parent);
		for (var i = 0; i < neighbors.length; i++) {
			var index = help.getIndex(neighbors[i]);
			var node = this._checkerBoard.children().eq(index);
			this.bindGridDrop(node);
		}
		this.bindChessOutEvent();
		this.bindDragstart();
		this.iconClick();
		this.iconMouseover();
		this.iconMouseout();
	},
	bindChessOutEvent:function(node){
		var _this = this;
		$('#wrap').on('drop.'+_this._chessName, function(e){
			e.preventDefault();
			_this.showMoveRoundColor($('#'+data), 3);
			var data=e.originalEvent.dataTransfer.getData(_this._chessName);
			/*if(data == _this._chessName && this.children.length == 0){
				$(e.target).append(document.getElementById(data));
				_this.showMoveRoundColor($('#'+data), 2);
			}*/
		});
	},
	bindGridDrop:function(node){
		var _this = this;
		node.on('drop.'+_this._chessName, function(e){
			e.preventDefault();
			var data=e.originalEvent.dataTransfer.getData('chessName');
			_this.showMoveRoundColor($('#'+data), 3);
			if(data == _this._chessName && this.children.length == 0){
				$(e.target).append(document.getElementById(data));
				_this.showMoveRoundColor($('#'+data), 2);
				camps[_this.getCamp()]['movenum'] = 0;
				/*触发click*/
				_this._chess.click();
			}
		});
	},
	bindDragstart:function(){
		var _this = this;
		this._chess.on('dragstart',function(e){
			//判断是否为该轮阵营的玩家
			if(_this.getCamp() == currentCamp){
				if(camps[_this.getCamp()]['movenum'] > 0){
					if($('#controlboard').length > 0){
						attacker.showDamageRoundColor(2);
						attackTarget = undefined;
						attacker = undefined;
						$('#controlboard').remove();
					}
					e.originalEvent.dataTransfer.setData('chessName',e.target.id);
					_this.showMoveRoundColor($(e.target), 1);
				}
				else{
					$('.bordertips').text("当前行动力为0");
				}
			}
			else{
				$('.bordertips').text('该轮是camp为'+currentCamp+'的玩家');
			}
			popHeroInfo(false);
		});
	},
	showDamageRoundColor:function(type){
		var _this = this;
		if(type == 1){
			var damageRangeNodes = this.getDamageRangeNodes();
			for (var i = 0; i < damageRangeNodes.length; i++) {
				var index = help.getIndex(damageRangeNodes[i]);
				var node = this._moveColorBoard.children().eq(index);
				this._damageColorNodes.push(node);
				node.css({
					'background-color':'red'
				});
			}
		}
		else if(type == 2){
			for (var i = 0; i < this._damageColorNodes.length; i++) {
				this._damageColorNodes[i].css({
					'background-color':''
				})
			}

		}
	},
	showMoveRoundColor:function(dom,type){
		var _this = this;
		var parent = dom.parent();
		var neighbors = help.getRound(_this._hero.moveRange, parent);
		if(type == 1){
			this._moveColorNodes = [];
			for (var i = 0; i < neighbors.length; i++) {
				var index = help.getIndex(neighbors[i]);
				var node = this._moveColorBoard.children().eq(index);
				this._moveColorNodes.push(node);
				node.css({
					'background-color':'green'
				});
			}
		}
		else if(type == 2){
			this._grid.off('drop.'+this._chessName);
			for (var i = 0; i < neighbors.length; i++) {
				var index = help.getIndex(neighbors[i]);
				var node = this._checkerBoard.children().eq(index);
				this.bindGridDrop(node);
			}
			this._moveColorNodes = [];
		}
		else{
			if(!this._moveColorNodes.length == 0){
				for (var i = 0; i < this._moveColorNodes.length; i++) {
					this._moveColorNodes[i].css({
						'background-color':''
					})
				}
			}
		}
	},
	/*---chess事件---*/
	iconClick:function(){
		var _this = this;
		this._chess.on('click.controllboard', function(e){
			//判断是否为攻击发起人
			if(attacker == undefined){
				if(_this.getCamp() == currentCamp){
					_this.showDamageRoundColor(1);
					controllboard('attack', 'attacker', _this);
					popHeroInfo(false);
				}
				else{
					$('.bordertips').text('该轮是camp为'+currentCamp+'的玩家');
				}
			}
			else{
				//判断切换攻击人还是对目标进行攻击
				if(attacker.getCamp() == _this.getCamp()){
					if(_this.getCamp() == currentCamp){
						attacker.showDamageRoundColor(2);
						_this.showDamageRoundColor(1);
						controllboard('attack', 'attacker', _this);
						popHeroInfo(false);
					}
					else{
						$('.bordertips').text('该轮是camp为'+currentCamp+'的玩家');
					}
				}
				else{
					controllboard('attack', 'attackTarget', _this);
					popHeroInfo(true, _this._hero, e);
				}
			}
		})
	},
	iconMouseover:function(){
		var _this = this;
		this._chess.on('mouseover.controllboard', function(e){
			popHeroInfo(true, _this._hero, e);
		})
	},
	iconMouseout:function(){
		var _this = this;
		this._chess.on('mouseout.controllboard', function(e){
			popHeroInfo(false);
		})
	},
	/*----人物位置模块----*/
	getLocation:function(){
		var parent = this._chess.parent();
		var location = help.getCoordinate(parent);
		return location;
	},
	/*----人物属性模块----*/
	getBlood:function(){
		return this._hero.blood;
	},
	getMagic:function(){
		return this._hero.magic;
	},
	getArmor:function(){
		return this._hero.armor;
	},
	getResistance:function(){
		return this._hero.resistance;
	},
	getDamage:function(){
		return this._hero.damage;
	},
	getMoveRangeNodes:function(){
		var _this = this;
		return this._moveRangeNodes = help.getRound(_this._hero.moveRange, _this._chess.parent());
	},
	getDamageRangeNodes:function(){
		var _this = this;
		return this._damageRangeNodes = help.getRound(_this._hero.damageRange, _this._chess.parent());
	},
	getCamp:function(){
		return this._hero.camp;
	},
	getSkills:function(){
		return this._hero.skills;
	},
	setBlood:function(arg){
		return this._hero.blood = arg;
	},
	setMagic:function(arg){
		return this._hero.magic = arg;
	},
	setArmor:function(arg){
		return this._hero.armor = arg;
	},
	setResistance:function(arg){
		return this._hero.resistance = arg;
	},
	setDamage:function(arg){
		return this._hero.damage = arg;
	},
	setDamageRange:function(arg){
		return this._hero.damageRange = arg;
	},
	/*----技能逻辑模块----*/
	setSkill:function(){

	}
}
/*----------------技能函数------------------*/
function SkillPool(){

}
SkillPool.prototype = {

}
/*----------------功能函数------------------*/
/*border创建，坐标计算等通用函数*/
function GetLocation(gridlength,line){
	this.gridlength = gridlength+2;
	this.chessboardLength = this.gridlength*line;
	this.line = line;
	this.creatBorder();
}

GetLocation.prototype = {
	creatBorder:function(){
		var wrap = $('<div id="wrap">'+
				'<div id="Checkerboard"></div>'+
				'<div id="Movecolorboard"></div>'+
			'</div>'),
			checkerboard = wrap.find('#Checkerboard');
			movecolorboard = wrap.find('#Movecolorboard');

		var num = this.line*this.line;
		for (var i = 0; i < num; i++) {
			var grid = $('<div class="grid"></div>'),
				colorgrid = $('<div class="colorgrid"></div>');
			checkerboard.append(grid);
			movecolorboard.append(colorgrid);
		}
		checkerboard.css({
		    'width': this.chessboardLength+'px',
		    'height': this.chessboardLength+'px',
		    'top':'150px'
		});
		movecolorboard.css({
		    'width': this.chessboardLength+'px',
		    'height': this.chessboardLength+'px',
		    'top':'150px'
		})
		wrap.css({
			'width': this.chessboardLength+700+'px',
		    'height': this.chessboardLength+300+'px'
		})
		wrap.append('<div class="bordertips"></div>');
		$('body').append(wrap);
	},
	getCoordinate:function($dom){
		var location  = $dom.index();
		var h = parseInt(location/this.line);
		var w = location%this.line;
		return coordinate = [w, h];
	},
	getIndex:function(coordinate){
		return coordinate[1]*this.line+coordinate[0];
	},
	getRound:function(movenum,dom){
		var coordinate = this.getCoordinate(dom);
		var arr = [];
		for (var i = 0-movenum; i <= 0+movenum; i++) {
			for (var j = 0-movenum; j <= 0+movenum; j++) {
				if(coordinate[0]+i >= 0 && coordinate[1]+j >= 0 && coordinate[0]+i < this.line && coordinate[1]+j < this.line){
					var temparr = [coordinate[0]+i, coordinate[1]+j];
					arr.push(temparr);
				}
			}
		}
		return arr;
	}

}

/*基本攻击*/
function BasicCount(){
}
BasicCount.prototype = {
	basicAttack:function(attacker, attackTarget){
		var damage = this.countbasicDamage(attacker.getDamage(), attackTarget.getArmor());
		var blood = attackTarget.setBlood(attackTarget.getBlood() - damage);
		if(blood > 0 ){
			return blood;
		}
		else{
			return 0;
		}
	},
	countbasicDamage:function(damage, Armor){
		damage -= Armor;
		if(damage > 0 ){
			return damage;
		}
		else{
			return 0;
		}
	},
	attackRangeCount:function(attacker, attackTarget){
		var a = attacker.getDamageRangeNodes(),
			bl = attackTarget.getLocation().toString();
		for (var i = 0; i < a.length; i++) {
			if(a[i].toString() == bl){
				return true;
			}
		}
	}
}

/*属性弹窗*/
function popHeroInfo(creat, obj, e){
	if(creat){
		if($(".pop").length > 0){
			$('.pop').remove();
		}
		var pop = $('<div class="pop"></div>')
		for(var key in obj){
			var p = $('<p>'+key+':'+obj[key]+'</p>');
			pop.append(p);
		}
		$('#wrap').append(pop);
		pop.css({
			'top':(e.clientY+20)+'px',
			'left':(e.clientX+10)+'px',
		})
	}
	else{
		$('.pop').remove();
	}
}

/*----------------控制面板函数------------------*/
function controllboard(action, type, hero){
	function AttackEvent(type,hero){
		switch(type){
			case 'attacker':
				/*创建面板*/
				var board = $("<div id='controlboard'></div>");
				var attackButton = $("<div class='controllboard_attackbutton controllboard_button'>攻击</div>");
				var attackTips = $("<div class='attacktips'></div>");
				var finish = $("<div class='finish controllboard_button'>完成行动</div>");
				board.append(attackButton);
				board.append(attackTips);
				board.append(finish);
				$('#wrap').append(board);
				/*业务逻辑*/
				attacker = hero;
				attackButton.on('click', function(){
					attackTips.text('请指定攻击目标');
				})
				finish.on('click', function(){
					attacker.showDamageRoundColor(2);
					camps[attacker.getCamp()]['attacknum'] = 1;
					camps[attacker.getCamp()]['movenum'] = 1;
					attackTarget = undefined;
					attacker = undefined;
					currentCamp == 1?currentCamp = 2:currentCamp = 1;
					$('.bordertips').text("");
					$('#controlboard').remove();
				})
				break;
			case 'attackTarget':
				if(camps[attacker.getCamp()]['attacknum'] > 0){
					attackTarget = hero;
					var range = basicCount.attackRangeCount(attacker, attackTarget);
					if(range){
						var attackfinish = basicCount.basicAttack(attacker, attackTarget);
						camps[attacker.getCamp()]['attacknum'] = 0;
						$('.attacktips').text('攻击完成');
					}
					else{
						$('.attacktips').text('目标太远，无法攻击');
					}
				}
				else{
					$('.bordertips').text("攻击次数为0");
				}
				break;

		}
	}
	if(action == 'attack'){
		$('.bordertips').text("");
		AttackEvent(type,hero);
	}
}


var help = new GetLocation(40, 15);
var basicCount = new BasicCount();

var obj1 = {
	chessName:'撼地者',
	chessImg:'撼地者',
	startLocation:[0,0],
	checkerBoard:$("#Checkerboard"),
	moveColorBoard:$("#Movecolorboard"),
	grid:$(".grid"),
	hero:{
		camp:1,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		moveRange:1,
		damage:10,
		damageRange:1,
	}
}

var obj2 = {
	chessName:'幽鬼',
	chessImg:'幽鬼',
	startLocation:[6,0],
	checkerBoard:$("#Checkerboard"),
	moveColorBoard:$("#Movecolorboard"),
	grid:$(".grid"),
	hero:{
		camp:1,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		moveRange:3,
		damage:10,
		damageRange:3,
	}
}

var obj3 = {
	chessName:'米拉娜',
	chessImg:'米拉娜',
	camp:1,
	startLocation:[11,0],
	checkerBoard:$("#Checkerboard"),
	moveColorBoard:$("#Movecolorboard"),
	grid:$(".grid"),
	hero:{
		camp:1,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		moveRange:2,
		damage:10,
		damageRange:2,
	}
}

var obj4 = {
	chessName:'敌法师',
	chessImg:'敌法师',
	camp:2,
	startLocation:[0,11],
	checkerBoard:$("#Checkerboard"),
	moveColorBoard:$("#Movecolorboard"),
	grid:$(".grid"),
	hero:{
		camp:2,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		moveRange:2,
		damage:10,
		damageRange:1,
	}
}

var obj5 = {
	chessName:'冥界亚龙',
	chessImg:'冥界亚龙',
	camp:2,
	startLocation:[6,11],
	checkerBoard:$("#Checkerboard"),
	moveColorBoard:$("#Movecolorboard"),
	grid:$(".grid"),
	hero:{
		camp:2,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		moveRange:1,
		damage:10,
		damageRange:2,
	}
}

var obj6 = {
	chessName:'食人魔魔法师',
	chessImg:'食人魔魔法师',
	camp:2,
	startLocation:[9,0],
	checkerBoard:$("#Checkerboard"),
	moveColorBoard:$("#Movecolorboard"),
	grid:$(".grid"),
	hero:{
		camp:2,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		moveRange:1,
		damage:10,
		damageRange:1,
	}
}

var hero_1 = new Chess(obj1),
	hero_2 = new Chess(obj2),
	hero_3 = new Chess(obj3),
	hero_4 = new Chess(obj4),
	hero_5 = new Chess(obj5),
	hero_6 = new Chess(obj6);







