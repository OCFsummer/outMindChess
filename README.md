# outMindChess
年级越来越大了，dota2也打不动了。那就写一个下棋类的dota游戏吧，毕竟是老年选手了。

### V1.0
1.基本框架的建立 <br>
2.各英雄的头像收集 <br>
3.基本攻击的实现 <br>

### V1.0.1
1.修复colorNodes未重置BUG <br>
2.添加getDamageRangeNodes接口，攻击距离判定 <br>
3.添加攻击范围提示 <br>
4.修改getMoveRangeNodes接口，外部调用 <br>
5.优化hero构造函数属性 <br>

### V1.0.2
1.修改grid生成格式，提供接口自定义棋盘大小 <br>
2.修改背景颜色的bug <br>
3.修改攻击函数 <br>
4.添加回合制控制函数 <br>

### V1.0.4
1.重构Controllboard，修改后构造函数 <br>
2.修改Chess事件接口 <br>
3.优化攻击移动逻辑判定 <br>

### V1.0.5
1.开始更新技能函数 <br>
2.更新POM群星技能 <br>
3.优化攻击面板显示 <br>

### V1.0.6
1.创建ModelObject类，建立技能及各种临时模块 <br>
2.完善POM月神之箭技能 <br>
3.创建时间轴TimeLine类，整理事件执行逻辑 <br>