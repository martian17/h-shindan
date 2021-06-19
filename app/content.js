(function(){
    //try{
        document.getElementById("drawingCanvas").style.height = "auto";
        //event fancypants
        var resetCanvasEvent = document.createEvent('Event');
        resetCanvasEvent.initEvent("resetCanvasEvent", true, false);
        
        var spamcnt = 0;
        var resetCanvas = function(){
            spamcnt++;
            setTimeout(()=>{
                spamcnt--;
                if(spamcnt === 0)document.dispatchEvent(resetCanvasEvent);
            },200);
        };
        
        var controls = new ELEM(document.querySelectorAll(".drawing-board-controls")[0]);
        var canvas1 = document.querySelectorAll(".drawing-board-canvas")[0];
        var ctx = canvas1.getContext("2d");
        var twidth = canvas1.width;
        var theight = canvas1.height;
        
        var filearea = controls.add("div", "class:drawing-board-file-area drawing-board-control-navigation-reset", false, "width:280px");
        //var finput = filearea.add("input",`type:file;data-buttonText:画像を挿入(推奨サイズ:${twidth}x${theight});`,false,false);
        var finput = filearea.add("input","type:file;",false,"display:none;");
        var fbutton = filearea.add("input",`type:button;value:画像を挿入(推奨サイズ_:${twidth}x${theight});`);
        filearea.e.addEventListener("click",function(){
            finput.e.click();
        });
        finput.e.addEventListener("input",function(){
            refreshImage();
        });
        
        
        var imgconfig = {
            fitx:true,
            fity:false,
            bgColor:"#fff",
            custom:false,
            ox:0,
            oy:0,
            w:twidth,
            h:theight,
            preserveRatio:false,
            ratio:1
        };
        //adding a config area
        var configarea = document.createElement("div");
        configarea.classList.add("configarea");
        configarea.classList.add("inactive");
        var a = document.querySelector(".drawing-board-canvas-wrapper");
        a.parentNode.insertBefore(configarea,a);
        configarea = new ELEM(configarea);
        var header = configarea.add("div",false,"画像配置設定(クリックで展開)▼","color:#0077cc;text-decoration:underline #0077cc;");
        
        header.e.addEventListener("click",function(){
            body.e.classList.toggle("visible");
        });
        
        
        var body = configarea.add("div","class:config-body;");
        
        var easy = body.add("div","class:configchoice;");
        var easyi = easy.add("span");
        easyi.add("label","for:fitx;","横にフィット");
        var fitxi = easyi.add("input","type:checkbox;name:fitx;checked:true;");
        fitxi.e.addEventListener("input",function(){
            imgconfig.fitx = this.checked;
            refreshImage();
        });
        easyi.add("label","for:fity;","縦にフィット");
        var fityi = easyi.add("input","type:checkbox;name:fity;");
        fityi.e.addEventListener("input",function(){
            imgconfig.fity = this.checked;
            refreshImage();
        });
        easy.add("label","for:bgColor;","背景色");
        var bgColori = easy.add("input","type:color;name:bgColor;value:#ffffff;disabled:disabled;");
        bgColori.e.addEventListener("input",function(){
            imgconfig.bgColor = this.value;
            console.log(this.value);
            refreshImage();
        });
        
        body.add("label","for:custom;","カスタム設定","margin-left:10px;");
        var customi = body.add("input","type:checkbox;name:fity;disabled:disabled;");
        customi.e.addEventListener("input",function(){
            if(this.checked){
                makeActive(cust.e);
                makeInactive(easyi.e);
                imgconfig.custom = true;
                refreshImage();
            }else{
                makeActive(easyi.e);
                makeInactive(cust.e);
                imgconfig.custom = false;
                refreshImage();
            }
        });
        var makeActive = function(elem){
            elem.classList.remove("inactive");
            var inputs = elem.querySelectorAll("input");
            for(var i = 0; i < inputs.length; i++){
                inputs[i].removeAttribute("disabled");
            }
        };
        var makeInactive = function(elem){
            elem.classList.add("inactive");
            var inputs = elem.querySelectorAll("input");
            for(var i = 0; i < inputs.length; i++){
                inputs[i].setAttribute("disabled","disabled");
            }
        };
        
        var cust = body.add("div","class:custom configchoice;");
        
        var left = cust.add("div","class:col");
        left.add("label","for:w;","横幅");
        var wi = left.add("input","type:number;name:w;");
        left.add("label","for:w;","px");
        wi.e.addEventListener("input",function(){
            imgconfig.w = parseInt(this.value);
            if(imgconfig.preserveRatio){
                imgconfig.h = imgconfig.w*imgconfig.ratio;
            }
            refreshImage();
        });
        left.add("br");
        left.add("label","for:h;","高さ");
        var hi = left.add("input","type:number;name:h;");
        left.add("label","for:h;","px");
        hi.e.addEventListener("input",function(){
            imgconfig.h = parseInt(this.value);
            if(imgconfig.preserveRatio){
                imgconfig.w = imgconfig.h/imgconfig.ratio;
            }
            refreshImage();
        });
        left.add("br");
        left.add("label","for:preserveRatio;","比率を維持");
        var ratioi = left.add("input","type:checkbox;name:preserveRatio;");
        ratioi.e.addEventListener("input",function(){
            imgconfig.preserveRatio = this.checked;
            if(this.checked){
                //register the ratio
                imgconfig.ratio = imgconfig.h/imgconfig.w;
            }else{
                //do nothing
            }
        });
        
        var right = cust.add("div","class:col");
        right.add("label","for:ox;","X位置");
        var oxi = right.add("input","type:number;name:ox;");
        right.add("label","for:ox;","px");
        oxi.e.addEventListener("input",function(){
            imgconfig.ox = parseInt(this.value);
            refreshImage();
        });
        right.add("br");
        right.add("label","for:oy;","Y位置");
        var oyi = right.add("input","type:number;name:oy;");
        right.add("label","for:oy;","px");
        oyi.e.addEventListener("input",function(){
            imgconfig.oy = parseInt(this.value);
            refreshImage();
        });
        
        makeInactive(easyi.e);
        makeInactive(cust.e);
        var init = true;
        
        var imgcache = false;
        var filecache = false;
        var refreshImage = async function(){
            if(filecache && filecache === finput.e.files[0]){
                var img = imgcache;
            }else{
                var file = finput.e.files[0];
                if(!file)return false;
                var img = await getImageFromFile(file);
                imgcache = img;
                filecache = file;
            }
            //console.log("got the image", img);
            var width = img.width;
            var height = img.height;
            var ox = 0;
            var oy = 0;
            var w = twidth;
            var h = theight;
            if(imgconfig.custom){
                ox = imgconfig.ox;
                oy = imgconfig.oy;
                w = imgconfig.w;
                h = imgconfig.h;
            }else if(imgconfig.fitx && imgconfig.fity){
                //do nothing
            }else if(imgconfig.fitx){
                w = twidth;
                h = twidth*height/width;
                oy = (theight-h)/2;
            }else if(imgconfig.fity){
                h = theight;
                w = theight*width/height;
                ox = (twidth-w)/2;
            }else{
                var w = width;
                var h = height;
            }
            var temp = ctx.fillStyle;
            ctx.fillStyle = imgconfig.bgColor;
            ctx.fillRect(0,0,twidth,theight);
            ctx.drawImage(img,ox,oy,w,h);
            ctx.fillStyle = temp;
            if(resetting = true)
            resetting = true;
            resetCanvas();
            
            
            //update the input field
            imgconfig.ox = ox;
            imgconfig.oy = oy;
            imgconfig.w = w;
            imgconfig.h = h;
            wi.e.value = w;
            hi.e.value = h;
            oxi.e.value = ox;
            oyi.e.value = oy;
            
            if(init){
                makeActive(easyi.e);
                customi.e.removeAttribute("disabled");
                bgColori.e.removeAttribute("disabled");
                configarea.e.classList.remove("inactive");
                init = false;
            }
        }
        
        
        
        finput.e.addEventListener("input",async function(){
            
        });
    /*}catch(err){
        alert("何かのエラーが発生しました。\n\
エラー: "+err+"\n\
ごめんなさい、おそらくサイトの仕様が変わってしまったか何かなので、twitterにて@yoshi9265までご一報いただけると助かります。");
}*/
})();


var scriptStr = `
document.addEventListener("resetCanvasEvent", function() {
  canvas.reset();
});
window.addEventListener("load",function(){
    setTimeout(function(){
        console.log("yay");
        canvas.reset();
    },100);
});
`;

BODY.add("script",false,scriptStr,false);
