function Chess(obj){
	this._chessName = obj.chessName;
	this._chessImg = obj.chessImg;
	this._initMoveNodes = [];
	this._moveColorNodes = [];
	this._damageColorNodes = [];
	this._skill = obj.skill;
	this._startLocation = obj.startLocation;
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
		this._chess = $("<img src='./imgs/heros/"+_this._chessImg+".png' class='heroicon' draggable='true' id='"+_this._chessName+"'>");
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
		this.initSkills();
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
			var node = checkerBoard.children().eq(index);
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
			var attacker = controllboard.getAttacker();

			_this.showMoveRoundColor($('#'+data), 3);
			if(data == _this._chessName && this.children.length == 0){
				$(e.target).append(document.getElementById(data));
				_this.showMoveRoundColor($('#'+data), 2);
				controllboard.setActionPoint(attacker.getCamp(), 'movenum', 0)
				//触发click
			}
		});
	},
	bindDragstart:function(){
/*		var _this = this;
		this._chess.on('dragstart',function(e){
			//判断是否为该轮阵营的玩家
			if(_this.getCamp() == currentCamp){
				if(camps[_this.getCamp()]['movenum'] > 0){
					if($('#controllboard').length > 0){
						attacker.showDamageRoundColor(2);
						attackTarget = undefined;
						attacker = undefined;
						$('#controllboard').remove();
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
		});*/
		var _this = this;
		this._chess.on('dragstart',function(e){
			popHeroInfo();
			help.writeBordertips();
			controllboard.writeAttacktips();
			var attackInfo = controllboard.judgeHero(_this);
			switch(attackInfo.type){
				case 'attacker':
					var attacker = controllboard.getAttacker();
					if(controllboard.getActionPoint(attacker.getCamp()).movenum > 0){
						attacker.showMoveRoundColor($(e.target), 1);
						controllboard.writeController(_this._chessName);
						e.originalEvent.dataTransfer.setData('chessName',e.target.id);
					}
					else{
						controllboard.writeAttacktips('移动次数为0，无法移动');
					}
					break;
				case 'changeAttacker':
					var attacker = controllboard.getAttacker();
					if(controllboard.getActionPoint(attacker.getCamp()).movenum > 0){
						attacker.showMoveRoundColor($(e.target), 1);
						controllboard.writeController(_this._chessName);
						e.originalEvent.dataTransfer.setData('chessName',e.target.id);
					}
					else{
						controllboard.writeAttacktips('移动次数为0，无法移动');
					}
					break;
				default:
					help.writeBordertips("不是你的回合 请阵营为："+controllboard.currentCamp()+"开始操作");
					break;			
			}
		})
	},
	showDamageRoundColor:function(hero, show){
		if(show == true){
			var damageRangeNodes = hero.getDamageRangeNodes();
			for (var i = 0; i < damageRangeNodes.length; i++) {
				var index = help.getIndex(damageRangeNodes[i]);
				var node = moveColorBoard.children().eq(index);
				hero._damageColorNodes.push(node);
				node.css({
					'background-color':'red'
				});
			}
		}
		else{
			for (var i = 0; i < hero._damageColorNodes.length; i++) {
				hero._damageColorNodes[i].css({
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
				var node = moveColorBoard.children().eq(index);
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
				var node = checkerBoard.children().eq(index);
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
			help.writeBordertips();
			controllboard.writeAttacktips();
			//判断是否为攻击发起人
			var attackInfo = controllboard.judgeHero(_this);
			switch(attackInfo.type){
				case 'attacker':
					controllboard.writeController(_this._chessName);
					break;
				case 'changeAttacker':
					controllboard.writeController(_this._chessName);
					break;
				case 'attackTarget':
					if(attackInfo.info == 'normalAttack'){
						basicCount.attack(controllboard.getAttacker(), controllboard.getAttackTarget());
					}
					break;
				case false:
					if(attackInfo.info == 'camp'){
						help.writeBordertips("不是你的回合 请阵营为："+controllboard.currentCamp()+"开始操作");
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
	/*----技能相关模块----*/
	initSkills:function(){
		return this._hero.skills;
	},
	/*----人物属性模块----*/
	getDom:function(){
		return this._chess;
	},
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
	}

}
/*----------------技能函数------------------*/
function SkillPool(){

}
SkillPool.prototype = {
	/*-技能辅助函数-*/
	blinblinDom:function(moveRanges){
		for (var i = 0; i < moveRanges.length; i++) {
			bl = attacker.getLocation().toString();
			if(moveRanges[i].toString() == bl){
				continue;
			}
			var index = help.getIndex(moveRanges[i]);
			var node = checkerBoard.children().eq(index);
			node.css({
				'opacity':0,
				'background-color':'blue'
			});
			(function(node){
				node.animate({
					'opacity':1
				}, function(){
					node.animate({'opacity':0},function(){
						node.css({
							'background-color':'',
							'opacity':1
						})
					})
				});
			})(node)
		}
	},
	/*-技能函数-*/
	starStorm:function(attacker){
		var dom = attacker.getDom();
		var moveRanges = help.getRound(1, dom.parent());
		this.blinblinDom(moveRanges);
	}
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
	},
	writeBordertips:function(info){
		var dom = $('.bordertips');
		if(info == undefined){
			dom.text("");
			return;
		}
		dom.text(info);
	}

}

/*基本攻击*/
function BasicCount(){
}
BasicCount.prototype = {
	attackCount:function(attacker, attackTarget){
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
	},
	attack:function(attacker, attackTarget){
		if(controllboard.getActionPoint(attacker.getCamp()).attacknum > 0){
			controllboard.setAttackTarget(attackTarget);
			var range = this.attackRangeCount(attacker, attackTarget);
			if(range){
				var attackfinish = this.attackCount(attacker, attackTarget);
				controllboard.getActionPoint(attacker.getCamp()).attacknum = 0;
				controllboard.writeAttacktips('攻击完成');
			}
			else{
				controllboard.writeAttacktips('目标太远，无法攻击');
			}
		}
		else{
			controllboard.writeAttacktips('攻击次数为0，无法攻击');
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
function Controllboard(){
	this._attacker = undefined;
	this._attackTarget = undefined;
	this._attackType = {
		info:undefined,
		callback:undefined
	};
	this._currentCamp = 1;
	this._camps = {
		1:{
			attacknum:1,
			movenum:1
		},
		2:{
			attacknum:1,
			movenum:1
		}
	};
	this.init();
}

Controllboard.prototype = {
	init:function(){
		var board = $("<div id='controllboard'></div>");
		var controller = $("<div class='controllerTip'>选择英雄：无</div>")
		var attackButton = $("<div class='controllboard_attackbutton controllboard_button'>攻击</div>");
		var attackTips = $("<div class='attacktips'></div>");
		var finish = $("<div class='finish controllboard_button'>完成行动</div>");
		board.append(controller);
		board.append(attackButton);
		board.append(attackTips);
		board.append(finish);
		$('#wrap').append(board);
		this.eventCreat();
	},
	eventCreat:function(){
		this.attackButtonClick();
		this.finishButtonClick();
	},
	finishButtonClick:function(){
		var _this = this;
		$('.finish').on('click', function(){
			if(_this._attacker){
				_this._attacker.showDamageRoundColor(_this._attacker, false);
				_this.getActionPoint(_this._attacker.getCamp()).attacknum = 1;
				_this.getActionPoint(_this._attacker.getCamp()).movenum = 1;
				_this._attackTarget = undefined;
				_this._attacker = undefined;
				_this._attackType = {
					info:undefined,
					callback:undefined
				};
				_this._camps = {
					1:{
						attacknum:1,
						movenum:1
					},
					2:{
						attacknum:1,
						movenum:1
					}
				};
			}
			_this._currentCamp == 1?_this._currentCamp = 2:_this._currentCamp = 1;
			_this.writeController();
			_this.writeAttacktips();
			help.writeBordertips();
		})
	},
	attackButtonClick:function(){
		var _this = this;
		$('.controllboard_attackbutton').on('click', function(){
			if(_this._attacker != undefined){
				_this.setAttackType({info:'normalAttack',callback:undefined});
				_this._attacker.showDamageRoundColor(_this._attacker, true);
				_this.writeAttacktips('请指定攻击目标');
			}
			else{
				_this.writeAttacktips('请选择英雄');
			}
		})

	},
	/*icon点击事件提供接口判断英雄角色*/
	judgeHero:function(hero){
		var _this = this;
		if(this._attacker == undefined){
			//进攻方，更新controllBoard
			if(hero.getCamp() == this._currentCamp){
				this._attacker = hero;
				return {
					type:'attacker'
				}
			}
			//该回合不是当前hero阵营
			return {
					type:false,
					info:'camp'
				}
		}
		else{
			if(this._attacker.getCamp() == hero.getCamp()){
				//切换进攻人
				this._attacker.showDamageRoundColor(_this._attacker, false);
				this._attacker = hero;
				this._attackType = {
					info:undefined,
					callback:undefined
				};
				return {
					type:'changeAttacker'
				}
			}
			else{
				//被攻击方回调
				var attackType = this.getAttackType();
				this._attackTarget = hero;
				switch(attackType.info){
					case 'normalAttack':
						return {
							type:'attackTarget',
							info:attackType.info
						}
						break;
					default:
						if(hero.getCamp() == this._currentCamp){
							this.writeAttacktips('请选择攻击模式');
						}
						else{
							return {
								type:false,
								info:'camp'
							}
						}
						break;
				}
			}
		}
	},
	judgeCurrentCamp:function(hero){
		if(hero.getCamp() == this._currentCamp){
			return true;
		}
	},
	writeAttacktips:function(info){
		var dom = $('.attacktips');
		if(info == undefined){
			dom.text("");
			return;
		}
		dom.text(info);
	},
	writeController:function(info){
		var dom = $('.controllerTip');
		if(info == undefined){
			dom.text("选择英雄：无");
			return;
		}
		dom.text("选择英雄："+info);
	},
	currentCamp:function(){
		return this._currentCamp;
	},
	getAttackType:function(){
		return this._attackType;
	},
	getAttacker:function(){
		return this._attacker;
	},
	getAttackTarget:function(){
		return this._attackTarget;
	},
	getActionPoint:function(camp){
		return this._camps[camp];
	},
	setAttacker:function(hero){
		return this._attacker = hero;
	},
	setAttackTarget:function(hero){
		return this._attackTarget = hero;
	},
	setAttackType:function(obj){
		return this._attackType = obj;
	},
	setActionPoint:function(camp, type, num){
		return this._camps[camp][type] = num;
	},
}


var skillHelp = new SkillPool();
var help = new GetLocation(40, 15);
var controllboard = new Controllboard();
var basicCount = new BasicCount();

var checkerBoard = $("#Checkerboard");
var moveColorBoard = $("#Movecolorboard");

var obj1 = {
	chessName:'撼地者',
	chessImg:'撼地者',
	startLocation:[0,0],
	grid:$(".grid"),
	hero:{
		camp:1,
		blood:100,
		magic:50,
		armor:7,
		resistance:5,
		moveRange:3,
		damage:10,
		damageRange:4,
	}
}

var obj2 = {
	chessName:'幽鬼',
	chessImg:'幽鬼',
	startLocation:[7,0],
	grid:$(".grid"),
	hero:{
		camp:1,
		blood:100,
		magic:50,
		armor:7,
		resistance:5,
		moveRange:3,
		damage:10,
		damageRange:4,
	}
}

var obj3 = {
	chessName:'米拉娜',
	chessImg:'米拉娜',
	camp:1,
	startLocation:[14,0],
	grid:$(".grid"),
	hero:{
		camp:1,
		blood:100,
		magic:50,
		armor:4,
		resistance:5,
		moveRange:3,
		damage:10,
		damageRange:4,
		skills:{
			starStorm:skillHelp.starStorm
		}
	}
}

var obj4 = {
	chessName:'敌法师',
	chessImg:'敌法师',
	camp:2,
	startLocation:[0,14],
	grid:$(".grid"),
	hero:{
		camp:2,
		blood:100,
		magic:50,
		armor:6,
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
	startLocation:[7,14],
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
	startLocation:[10,0],
	grid:$(".grid"),
	hero:{
		camp:2,
		blood:100,
		magic:50,
		armor:4,
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







