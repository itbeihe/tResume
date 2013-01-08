/*
	keywordbg —— a keyword parallax background
	
	Dual licensed under MIT and GPL.
*/

(function($) {
    $.keywordbg = function(customConfig) {
        this.config = {
            canvasId : 'parallax-bg',
            keywords : ['CSS3','HTML5','javascript','Node.js','Notepad++','JAVA','Linux','GitHub','PhotoShop'],
            zindexLevel : 3,
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
            self.canvasObj.width = $(document).width() < $('body').width() ? $(document).width() : $('body').width();
            self.canvasObj.height = $(document).height() < $('body').height() ? $(document).height() : $('body').height();
            console.log(self.canvasObj);
            //try{
                self.context = self.canvasObj.getContext('2d');
                console.log(self.context);
                self.keyObjs = self.buildKeyObjs();
                self.fillKeyObjs();
                
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
            var zIndexLevel = self.config.zindexLevel;
            var keyObjs = [];
            if(keywords&&keywords[0]){
                for(var i = 0,j=keywords.length;i<j;i++){
                    if((typeof keywords[i]).toLowerCase() == 'string'){
                        var fontSize = parseInt(Math.random()*(config.maxFontSize-config.minFontSize)+config.minFontSize);
                        var x = parseInt(Math.random()*width);
                        var y = parseInt(Math.random()*height);
                        var index = parseInt(Math.random()*(zIndexLevel-1) + 1);
                        var keyObj = {
                            keyword : keywords[i],
                            fontSize:50,
                            position : [x,y],
                            zIndex : index
                        };
                        keyObjs.push(keyObj);
                    }else{
                        var keyObj = $.extend({},keywords);
                        if(!keyObj.position){
                            var x = parseInt(Math.random()*width);
                            var y = parseInt(Math.random()*height);
                            keyObj.position = [x,y];
                        }
                        if(!keyObj.zIndex){
                            var index = parseInt(Math.random()*(zIndexLevel-1) + 1);
                            keyObj.zIndex = [x,y];
                        }
                        if(keyObj.keyword){
                            keyObjs.push(keyObj);
                        }
                    }
                }
            }
            return keyObjs;
        },
        fillKeyObjs:function(){
            var self = this;
            for(var i=0,len=self.keyObjs.length;i<1;i++){
                self.fillKeyObj(self.keyObjs[i]);
            }
        },
        fillKeyObj:function(keyObj){
            var context = this.context;
            context.font = '50px impact';
            context.fillStyle = '#000';
            console.log(keyObj.position[0]);
            console.log(keyObj.position[1]);
            context.fillText(keyObj.keyword,keyObj.position[0],keyObj.position[1]);
            context.fillText('javascript',100,120);
            context.restore();
        }
    }
})(jQuery);