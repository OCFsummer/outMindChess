var attacker = undefined;
var attackTarget= undefined;


function Chess(obj){
	this._chessName = obj.chessName;
	this._chessImg = obj.chessImg;
	this._initMoveNodes = [];
	this._colorNodes = [];
	this._skill = obj.skill;
	this._startLocation = obj.startLocation;
	this._checkerBoard = obj.checkerBoard;
	this._moveColorBoard = obj.moveColorBoard;
	this._grid = obj.grid;
	this._moveRange = obj.moveRange;
	this._hero = obj.hero;
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
		var neighbors = help.getRound(_this._moveRange, parent);
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
			_this.showBackgroundColor($('#'+data), 3);
			var data=e.originalEvent.dataTransfer.getData(_this._chessName);
			/*if(data == _this._chessName && this.children.length == 0){
				$(e.target).append(document.getElementById(data));
				_this.showBackgroundColor($('#'+data), 2);
			}*/
		});
	},
	bindGridDrop:function(node){
		var _this = this;
		node.on('drop.'+_this._chessName, function(e){
			e.preventDefault();
			var data=e.originalEvent.dataTransfer.getData('chessName');
			_this.showBackgroundColor($('#'+data), 3);
			if(data == _this._chessName && this.children.length == 0){
				$(e.target).append(document.getElementById(data));
				_this.showBackgroundColor($('#'+data), 2);
			}
		});
	},
	bindDragstart:function(){
		var _this = this;
		this._chess.on('dragstart',function(e){
			popHeroInfo(false);
			e.originalEvent.dataTransfer.setData('chessName',e.target.id);
			_this.showBackgroundColor($(e.target), 1);
		})
	},
	showBackgroundColor:function(dom,type){
		var _this = this;
		var parent = dom.parent();
		var neighbors = help.getRound(_this._moveRange, parent);
		if(type == 1){
			for (var i = 0; i < neighbors.length; i++) {
				var index = help.getIndex(neighbors[i]);
				var node = this._moveColorBoard.children().eq(index);
				this._colorNodes.push(node);
				node.css({
					'background-color':'green'
				});
			}
			//console.log(this._colorNodes);
		}
		else if(type == 2){
			this._grid.off('drop.'+this._chessName);
			for (var i = 0; i < neighbors.length; i++) {
				var index = help.getIndex(neighbors[i]);
				var node = this._checkerBoard.children().eq(index);
				this.bindGridDrop(node);
			}
			this._colorNodes = [];
		}
		else{
			if(!this._colorNodes.length == 0){
				for (var i = 0; i < this._colorNodes.length; i++) {
						this._colorNodes[i].css({
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
			if(attacker == undefined){
				controllboard('attack', 'attacker', _this);
				popHeroInfo(false);
			}
			else{
				controllboard('attack', 'attackTarget', _this);
				popHeroInfo(true, _this._hero, e);
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
	getDamageRange:function(){
		return this._hero.damageRange;
	},
	getCamp:function(){
		return this._hero.camp;
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


/*----------------功能函数------------------*/
function GetLocation(gridH, gridW, chessboardH, chessboardW){
	this.gridH = gridH+2;
	this.gridW = gridW+2;
	this.chessboardH = chessboardH;
	this.chessboardW = chessboardW;
	this.h = chessboardH/this.gridH;
	this.w = chessboardW/this.gridW;
	this.line = this.h;
	console.log(this.h);
}

GetLocation.prototype = {
	getCoordinate:function($dom){
		var location  = $dom.index();
		var h = parseInt(location/this.h);
		var w = location%this.w;
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
}

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
					attackTarget = undefined;
					attacker = undefined;
					$('#controlboard').remove();
				})
				break;
			case 'attackTarget':
				if(attacker.getCamp() != hero.getCamp()){
					attackTarget = hero;
					basicCount.basicAttack(attacker, attackTarget);
					$('.attacktips').text('攻击完成');
					break;
				}
				else{
					$('.attacktips').text('阵营错误，傻屌');
				}

		}
	}
	if(action == 'attack'){
		AttackEvent(type,hero);
	}
}


var help = new GetLocation(40, 40, 504, 504);
var basicCount = new BasicCount();

var obj1 = {
	chessName:'撼地者',
	chessImg:'撼地者',
	startLocation:[0,0],
	checkerBoard:$("#Checkerboard"),
	moveColorBoard:$("#Movecolorboard"),
	grid:$(".grid"),
	moveRange:1,
	hero:{
		camp:1,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		damage:10,
		damageRange:2,
	}
}

var obj2 = {
	chessName:'幽鬼',
	chessImg:'幽鬼',
	startLocation:[6,0],
	checkerBoard:$("#Checkerboard"),
	moveColorBoard:$("#Movecolorboard"),
	grid:$(".grid"),
	moveRange:1,
	hero:{
		camp:1,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		damage:10,
		damageRange:2,
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
	moveRange:2,
	hero:{
		camp:1,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
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
	moveRange:2,
	hero:{
		camp:2,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		damage:10,
		damageRange:2,
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
	moveRange:1,
	hero:{
		camp:2,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		damage:10,
		damageRange:2,
	}
}

var obj6 = {
	chessName:'食人魔魔法师',
	chessImg:'食人魔魔法师',
	camp:2,
	startLocation:[11,11],
	checkerBoard:$("#Checkerboard"),
	moveColorBoard:$("#Movecolorboard"),
	grid:$(".grid"),
	moveRange:1,
	hero:{
		camp:2,
		blood:100,
		magic:50,
		armor:5,
		resistance:5,
		damage:10,
		damageRange:2,
	}
}

var hero_1 = new Chess(obj1),
	hero_2 = new Chess(obj2),
	hero_3 = new Chess(obj3),
	hero_4 = new Chess(obj4),
	hero_5 = new Chess(obj5),
	hero_6 = new Chess(obj6);







