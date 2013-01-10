/*
	keywordbg —— a keyword parallax background
	
	Dual licensed under MIT and GPL.
*/

(function($) {
    var fontDiv = null;
    var xarr = [];
    var yarr = [];
    var arrObj = {};
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
    
    var getRandomPointFromArr = function(arr,maxValue,span){
        if(arr.length == 0){
            var barr = buildArr(maxValue,span);
            for(var i = 0,len=barr.length;i<len;i++){
                arr[i] = barr[i];
            }
        }
        return getRandomFromArr(arr);
    }
    
    var getCoord = function(keyObj,maxWidht,maxHeight){
        var WH = getWidthHeight(keyObj);
        var width = WH.width;
        var height = WH.height;
        //var x = parseInt(Math.random()*(maxWidht-2*width)+width);
        //var y = parseInt(Math.random()*(maxHeight-2*height)+height);
        
        var x = getRandomPointFromArr(xarr,maxWidht,width);
        var y = getRandomPointFromArr(yarr,maxHeight,height);
        return {
            x:x,
            y:y,
            width:width,
            height:WH.height
        }
    }
    
    
    $.keywordbg = function(customConfig) {
        this.config = {
            canvasId : 'parallax-bg',
            keywords : ['CSS3','HTML5','javascript','Node.js','JAVA','YUI','Linux'],
            zSpeedLevel : 3,
            minFontSize:40,
            maxFontSize:60,
            speed:3,
            fontFamily:'impact'
        };
        this.config = $.extend({}, this.config, customConfig);
        this.context = null;
        this.canvasObj = null;
        this.keyObjs = [];
    }
    $.keywordbg.prototype = {
        init:function(){
            var self = this;
            self.canvasObj = document.getElementById(self.config.canvasId);
            self.canvasObj.width = $(window).width() ;
            self.canvasObj.height = $(window).height();
            
            //console.log(self.canvasObj.width);
            //console.log(self.canvasObj.height);
            //try{
                self.context = self.canvasObj.getContext('2d');
                self.context.save();
                //console.log(self.context);
                self.keyObjs = self.buildKeyObjs();
                self.bindEvent();
                //window.setInterval(function(){
                //    self.fillKeyObjs(-1);
                //},50)
                
            //}catch(e){
            //    return;
            //}
        },
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
                        console.log('11');
                        position = getCoord(keyObj,width,height);
                    }while(!self.checkPosition(position));
                    
                    keyObj.position = position;
                    keyObjs.push(keyObj);
                    
                }
            }
            return keyObjs;
        },
        checkPosition:function(position){
            var self = this;
            for(var i = 0,len=self.keyObjs.length;i<len;i++){
                //console.log(self.keyObjs[i]['x'] == position['x']);
                //console.log(self.keyObjs[i]['x'] == position['y']);
                //console.log(self.keyObjs[i]['x'] == position['x'] && self.keyObjs[i]['y'] == position['y']);
                if(self.keyObjs[i]['x'] == position['x'] && self.keyObjs[i]['y'] == position['y']){
                    return false;
                }
            }
            return true;
        },
        fillKeyObjs:function(seq){
            //console.log('++');
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
        fillKeyObj:function(keyObj,seq){
            var context = this.context;
            context.font = '' + keyObj.fontSize + ' impact';
            context.fillStyle = keyObj.color;
            context.save();
            context.translate(keyObj.position['x'],keyObj.position['y'])
            keyObj.position['y'] = keyObj.position['y'] + keyObj.zSpeed*(seq);
            keyObj.degree = keyObj.degree + keyObj.zSpeed*(seq);
            context.rotate(Math.PI/72*keyObj.degree);
            //context.fillText(keyObj.keyword,keyObj.position['x'],keyObj.position['y']);
            context.fillText(keyObj.keyword,-keyObj.position['width']/2,keyObj.position['height']/4);
            //context.fillText('0,0',0,0);
            context.restore();
        },
        bindEvent:function(){
            var self = this;
            var config = self.config;
            var scrollTop = $(document).scrollTop();
            self.fillKeyObjs();
            
            $(window).on('scroll',function(ev){
                var nowScrollTop = $(document).scrollTop();
                //console.log(nowScrollTop-scrollTop);
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