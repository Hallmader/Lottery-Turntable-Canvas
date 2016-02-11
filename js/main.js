var LuckyWheel = function() {
    ///////////////////基本属性///////////////////////
    //获取开始按钮与抽奖文本待替换
    //初始箭头角度为一随机值，每次刷新在不同角度
    //角度在360之内的任意一值
    //事先创建timer对象便于适当时机清空定时器
    var that = this;
    this.flag = true;
    this.timer = null;
    this.btn = document.getElementById('start');
    this.res = document.getElementById('result_text');
    this.arrowPanel = document.getElementById('rotateNeedle');
    this.time = 0;
    this.angle=0;
    //创建canvas对象
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.ctx = canvas.getContext('2d');
    //预先绘制一次面板，并对箭头的位置随机放置
    this.drawPanel();
    //点击按钮开始抽奖
    this.btn.addEventListener("click", function() {
        //若flag为false，点击事件将直接返回，不再进行抽奖
        if (!that.flag) {
            return;
        }
        //传入速度————为50以内的任意一值
        //为增强随机性，在每次点击的时候随机重置指针角度
        that.angle=Math.random()*360;
        that.panelRun(Math.floor(Math.random() * 50));
    });
};
//////////////////////原型方法///////////////////////////
LuckyWheel.prototype = {
    //指针运动方法
    panelRun: function(speed) {
        var that = this;
        //旋转时间/角度将一直递增
        this.time = speed + speed * 5 / 50;
        this.angle += 20;
        //一旦角度超过360度，重置角度于0度00度之间
        if (this.angle >= 360) {
            this.angle = Math.floor(Math.random() * 20);
        }
        //重置面板颜色并将变化的角度传入旋转函数
        this.drawPanel();
        if (this.time > 1000) {
            //当time已超过1000毫秒后
            //旋转终止，此时将flag重置为true，下一次点击时不受影响
            //根据最终角度值返回结果，并重置res文本信息
            this.flag = true;
            if (this.angle > 30 && this.angle < 90) {
                this.res.innerHTML = " o(*≧▽≦)ツ 一台Surface Pro4！运气不错！";
                return;
            } else if (this.angle > 90 && this.angle < 150) {
                this.res.innerHTML = " >ㅂ< 5000块钱到手啦！请吃饭！";
                return;
            } else if (this.angle > 150 && this.angle < 210) {
                this.res.innerHTML = " Σ( ° △ °|||) 什么也没有……看来今天运气不太好呢……";
                return;
            } else if (this.angle > 210 && this.angle < 270) {
                this.res.innerHTML = " ⁄(⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄  一只萌妹子！去掉头就可以吃咯！";
                return;
            } else if (this.angle > 270 && this.angle < 330) {
                this.res.innerHTML = "  (/≥▽≤/)  就算有Iphone6S也不要总是看手机哦！";
                return;
            } else if (this.angle < 30 || this.angle > 330) {
                this.res.innerHTML = "  ミ ﾟДﾟ彡  太厉害了！你赢了一辆车哦！";
                return;
            }
            //定时器被清空
            clearTimeout(this.timer);

        } else {
            //在time小于1000毫秒情况下，定时器不断地调用运动函数
            //但由于time递增，旋转的速度将随之变慢
            //为避免重复点击按钮造成多个定时器线程运行，此时将flag置为false
            this.flag = false;
            this.timer = setTimeout(function() {
                //此时this上下文指向window对象，使用保存好的that来调用正确的this上下文
                that.panelRun(that.time);
            }, that.time);
        }
    },
    //绘制面板
    drawPanel: function() {
        var that = this;
        var radius = 250;
        var style = this.ctx.createRadialGradient(this.canvas.width / 2, this.canvas.height / 2, 0, this.canvas.width / 2, this.canvas.height / 2, 100);
        style.addColorStop(0, "#0080FF");
        style.addColorStop(0.4, "#003A74");
        style.addColorStop(0.8, "#01386F");
        style.addColorStop(1, "#002041");
        //清空canvas绘制区域，以免重复绘制
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < 6; i++) {
            //颜色值每次都是随机生成
            //通过调用封装好的canvas方法来绘制扇形，每个扇形之间相差60度
            var R = Math.floor(Math.random() * 255);
            var G = Math.floor(Math.random() * 255);
            var B = Math.floor(Math.random() * 255);
            var sD = -Math.PI * 2 / 3 + Math.PI * i / 3;
            var eD = -Math.PI / 3 + Math.PI * i / 3;
            this.ctx.beginPath();
            this.ctx.shadowColor = "#666";
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
            this.ctx.shadowBlur = 2;
            this.ctx.sector(this.canvas.width / 2, this.canvas.height / 2, radius, sD, eD, false);
            this.ctx.shadowOffsetX = 2;

            this.ctx.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
            this.ctx.fill();
        }
        //于中心部分绘制内圆,添加径向渐变
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width / 2, this.canvas.height / 2, 100, 0, Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fillStyle = style;
        this.ctx.fill();
        //调用方法绘制出文字、指针
        this.drawText(radius);
        this.drawNeedle(radius);
    },
    //添加文字
    drawText: function(radius) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "#000";
        this.ctx.shadowColor = "#666";
        this.ctx.shadowOffsetX = 2;
        this.ctx.shadowOffsetY = 2;
        this.ctx.shadowBlur = 2;
        this.ctx.font = "lighter 20px Microsoft Yahei";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        //基本数学逻辑————文字处于扇形约四分之三半径长的位置
        //以圆心为原点，通过正弦/余弦函数计算得到横轴与纵轴坐标位置
        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText("一辆小车", (3 * radius / 4) * Math.cos(Math.PI / 2), -(3 * radius / 4) * Math.sin(Math.PI / 2));
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText("Surface Pro4", (3 * radius / 4) * Math.cos(Math.PI / 6), -(3 * radius / 4) * Math.sin(Math.PI / 6));
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText("5000¥", (3 * radius / 4) * Math.cos(Math.PI / 6), (3 * radius / 4) * Math.sin(Math.PI / 6));
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText("什么也米有", (3 * radius / 4) * Math.cos(Math.PI / 2), (3 * radius / 4) * Math.sin(Math.PI / 2));
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText("一只萌妹", -(3 * radius / 4) * Math.cos(Math.PI / 6), (3 * radius / 4) * Math.sin(Math.PI / 6));
        this.ctx.restore();

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.fillText("哀缝6s", -(3 * radius / 4) * Math.cos(Math.PI / 6), -(3 * radius / 4) * Math.sin(Math.PI / 6));
        this.ctx.restore();
    },
    //绘制指针
    drawNeedle: function(radius) {
        //指针渐变色
        var gradientStyle = this.ctx.createLinearGradient(0, 0, 5, radius * 3 / 4);
        gradientStyle.addColorStop(0, "#002041");
        gradientStyle.addColorStop(0.2, "#01386F");
        gradientStyle.addColorStop(0.4, "#003A74");
        gradientStyle.addColorStop(0.6, "#0054A8");
        gradientStyle.addColorStop(0.8, "#016DD8");
        gradientStyle.addColorStop(1, "#0080FF");
        //重置指针阴影
        this.ctx.save();
        this.ctx.shadowColor = "#666";
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
        //指针初始方向与this.angle不对应，预先将指针旋转至正确的位置再旋转
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.rotate(Math.PI);
        this.ctx.save();
        this.ctx.rotate(this.angle / 180 * Math.PI);
        this.ctx.moveTo(0, 0);
        this.ctx.fillStyle = gradientStyle;
        this.ctx.fillRect(0, 0, 4, radius * 3 / 4);
        this.ctx.restore();
        this.ctx.restore();
    },

};


//封装Canvas扇形方法
//原理————
//1、以x,y点为圆心绘制圆弧
//2、将终点位置旋转并与圆心连接，确保圆心与其连线与x轴重合
//3、旋转起点位置，与圆心连接
//4、恢复至旋转前状态
CanvasRenderingContext2D.prototype.sector = function(x, y, r, sD, eD, dis) {
    this.save();
    this.translate(x, y);
    this.beginPath();
    this.arc(0, 0, r, sD, eD, dis || false);
    this.save();
    this.rotate(eD);
    this.moveTo(r, 0);
    this.lineTo(0, 0);
    this.restore();
    this.rotate(sD);
    this.lineTo(r, 0);
    this.restore();
};

var luckyWheel = new LuckyWheel();
