/*
	keywordbg —— 用于生成关键字背景
    非常有想重写的欲望，空下时间就重写了，擦。
*/

(function($) {
    var fontDiv = null;
    var xarr = [];
    var yarr = [];
    var arrObj = {};
    var testIndex = 0;
    
    var getRandomFromArr = function(arr){
        var index = parseInt(Math.random()*arr.length);
        return arr[index];
    }
    
    var buildArr = function(max,span){
        var arr = [];
        var currentNum = 2*span;
        do{
            arr.push(currentNum);
            currentNum += span;
        }while(currentNum < (max-span));
        return arr;
    };
    
    
    //获取文案的宽度和高度，这里我错了，对canvas的api了解不熟悉，导致中心点计算有偏移
    var getWidthHeight = function(keyObj){
        if(!fontDiv){
            fontDiv = document.createElement('div');
            fontDiv.style.position = 'absolute';
            fontDiv.style.top = '0';
            document.body.appendChild(fontDiv);
        }
        fontDiv.innerHTML = keyObj.keyword;
        fontDiv.style.fontSize = keyObj.fontSize;  
        fontDiv.style.fontFamily = keyObj.fontFamily;
        fontDiv.style.visibility = 'hidden';
        fontDiv.style.zIndex = '-100';
        return {
            width:$(fontDiv).width(),
            height:$(fontDiv).height()
        }
    };
    
    // 从坐标数组获取随机坐标，废弃，不是最优方案
    var getRandomPointFromArr = function(arr,maxValue,span){
        if(arr.length == 0){
            var barr = buildArr(maxValue,span);
            for(var i = 0,len=barr.length;i<len;i++){
                arr[i] = barr[i];
            }
        }
        return getRandomFromArr(arr);
    }
    
    // 获取随机坐标，整个坐标获取方法有待改进
    var getCoord = function(keyObj,maxWidht,maxHeight){
        var WH = getWidthHeight(keyObj);
        var width = WH.width;
        var height = WH.height;
        var x = parseInt(Math.random()*(maxWidht-2*width)+width);
        var y = parseInt(Math.random()*(maxHeight-2*height)+height);
        
        //var x = getRandomPointFromArr(xarr,maxWidht,width);
        //var y = getRandomPointFromArr(yarr,maxHeight,height);
        return {
            x:x,
            y:y,
            width:width,
            height:WH.height
        }
    }
    
    // 插件对象
    $.keywordbg = function(customConfig) {
        this.config = {
            canvasId : 'parallax-bg',
            //keywords : ['CSS3','HTML5','javascript','Node.js','JAVA'],
            keywords : ['CSS3','HTML5','javascript','Node.js'],
            zSpeedLevel : 3,
            minFontSize:40,
            maxFontSize:60,
            speed:1,
            fontFamily:'impact'
        };
        this.config = $.extend({}, this.config, customConfig);
        this.context = null;
        this.canvasObj = null;
        this.keyObjs = [];
    }
    //插件方法
    $.keywordbg.prototype = {
        //初始化方法
        init:function(){
            var self = this;
            self.canvasObj = document.getElementById(self.config.canvasId);
            self.canvasObj.width = $(window).width() ;
            self.canvasObj.height = $(window).height();
            
            try{
                self.context = self.canvasObj.getContext('2d');
                self.context.save();
                self.keyObjs = self.buildKeyObjs();
                self.bindEvent();
                //window.setInterval(function(){
                //    self.fillKeyObjs(-1);
                //},50)
                
            }catch(e){
            //    return false;
            }
        },
        //用于生成关键字对象
        buildKeyObjs : function(){
            var self = this;
            var config = self.config;
            var keywords = self.config.keywords;
            var width = self.canvasObj.offsetWidth;
            var height = self.canvasObj.offsetHeight;
            var zSpeedLevel = self.config.zSpeedLevel;
            var keyObjs = [];
            if(keywords&&keywords[0]){
                for(var i = 0,j=keywords.length;i<j;i++){
                    var defObj = {
                        fontSize:'50px',
                        fontFamily:'impact',
                        color:'#ccc'
                    }
                    
                    var keyObj = {};
                     
                    if((typeof keywords[i]).toLowerCase() == 'string'){
                        keyObj = $.extend(defObj,{keyword : keywords[i]});
                    }else{
                        keyObj = $.extend(defObj,keywords);
                    }

                    if(!keyObj.zSpeed){
                        var speed = parseInt(Math.random()*(zSpeedLevel-1) + 1);
                        keyObj.zSpeed = speed;
                    }
                    keyObj.degree = Math.random()*6;
                    
                    
                    var position = getCoord(keyObj,width,height);
                    
                    do{
                        position = getCoord(keyObj,width,height);
                    }while(!self.checkPosition(position,keyObjs));
                    keyObj.position = position;
                    keyObjs.push(keyObj);
                }
            }
            return keyObjs;
        },
        //检查生成的坐标是否跟已存在的关键字对象重合。
        checkPosition:function(position,keyObjs){
            for(var i = 0,len = keyObjs.length;i<len;i++){
                var comparePosition = keyObjs[i].position;    
                var xGap =  Math.abs(position['x'] - comparePosition['x']);
                var widthGap = parseInt((position['width'] + comparePosition['width'])/2);
                var yGap = Math.abs(position['y'] - comparePosition['y'])
                var heightGap = parseInt((position['height'] + comparePosition['height'])/2);
                
                if((xGap*xGap+xGap*yGap) < (widthGap*widthGap + heightGap*heightGap)){
                    //console.log('gap1:'+ xGap+'_'+yGap);
                    //console.log('gap2:'+ widthGap+'_'+heightGap);
                    //console.log('false:'+ ++testIndex);
                    return false;
                }
            }
            return true;
        },
        // 填充所有关键字对象
        fillKeyObjs:function(seq){
            var self = this;
            if(typeof seq == 'undefined'){
                seq = 1;
            }
            seq = seq*self.config.speed;
            var context = self.context;
            context.clearRect(0,0,self.canvasObj.offsetWidth,self.canvasObj.offsetHeight);
            for(var i=0,len=self.keyObjs.length;i<len;i++){                
                self.fillKeyObj(self.keyObjs[i],seq);
            }
            
        },
        //填充关键字对象
        fillKeyObj:function(keyObj,seq){
            var context = this.context;
            context.font = '' + keyObj.fontSize + ' impact';
            context.fillStyle = keyObj.color;
            context.save();
            context.translate(keyObj.position['x'],keyObj.position['y'])
            //keyObj.position['y'] = keyObj.position['y'] + keyObj.zSpeed*(seq);
            keyObj.degree = keyObj.degree + keyObj.zSpeed*(seq);
            context.rotate(Math.PI/72*keyObj.degree);
            //context.fillText(keyObj.keyword,keyObj.position['x'],keyObj.position['y']);
            context.fillText(keyObj.keyword,-keyObj.position['width']/2,keyObj.position['height']/4);
            //context.fillText('0,0',0,0);
            context.restore();
        },
        //绑定滚动条事件
        bindEvent:function(){
            var self = this;
            var config = self.config;
            var scrollTop = $(document).scrollTop();
            self.fillKeyObjs();

            $(window).on('scroll',function(ev){
                var nowScrollTop = $(document).scrollTop();
                if(nowScrollTop-scrollTop>15){
                    self.fillKeyObjs();
                    scrollTop = nowScrollTop;
                }else if(nowScrollTop-scrollTop<-15){
                    self.fillKeyObjs(-1);
                    scrollTop = nowScrollTop;
                };
            });
        }
    }
})(jQuery);