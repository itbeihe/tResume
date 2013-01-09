/*
	keywordbg —— a keyword parallax background
	
	Dual licensed under MIT and GPL.
*/

(function($) {


    var fontDiv = null;
    
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
    
    
    var getCoord = function(keyObj,maxWidht,maxHeight){
        var WH = getWidthHeight(keyObj);
        var width = WH.width;
        var height = WH.height;
        var x = parseInt(Math.random()*(maxWidht-2*width)+width);
        var y = parseInt(Math.random()*(maxHeight-2*height)+height);
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
                window.setInterval(function(){
                    self.fillKeyObjs();
                },50)
                
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
                    keyObj.degree = Math.random()*36;
                    
                    keyObj.position = getCoord(keyObj,width,height);
                    keyObjs.push(keyObj);
                    
                }
            }
            return keyObjs;
        },
        fillKeyObjs:function(){
            //console.log('++');
            var self = this;
            var context = self.context;
            context.clearRect(0,0,self.canvasObj.offsetWidth,self.canvasObj.offsetHeight);
            for(var i=0,len=self.keyObjs.length;i<len;i++){
                self.fillKeyObj(self.keyObjs[i]);
            }
            
        },
        fillKeyObj:function(keyObj){
            var context = this.context;
            context.font = '' + keyObj.fontSize + ' impact';
            context.fillStyle = keyObj.color;
            context.save();
            context.translate(keyObj.position['x'],keyObj.position['y'])
            //keyObj.position['y'] = keyObj.position['y'] + keyObj.zSpeed*5;
            keyObj.degree = keyObj.degree+keyObj.zSpeed;
            context.rotate(Math.PI/72*keyObj.degree);
            //context.fillText(keyObj.keyword,keyObj.position['x'],keyObj.position['y']);
            context.fillText(keyObj.keyword,-keyObj.position['width']/2,keyObj.position['height']/4);
            //context.fillText('0,0',0,0);
            context.restore();
        }
    }
})(jQuery);