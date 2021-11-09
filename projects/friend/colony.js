/* global $ */

window.onload = function(){ blinker(); mouseSpeedTracker(); };

var blinker = function self() {
    var blinkWaitTime = Math.floor(Math.random() * 3000) + 500;
    
    var blinkerer = function() {
        //setTimeout(function() { document.getElementsByClassName('eye')[0].style.backgroundColor = "#EEE"; document.getElementsByClassName('eye')[1].style.backgroundColor = "#EEE"; }, 150);
        
        setTimeout(function() { 
            document.getElementsByClassName('eye')[0].style.animation = "";
            document.getElementsByClassName('eye')[1].style.animation = "";
        }, 150);
        
        //document.getElementsByClassName('eye')[0].style.backgroundColor = "#1a1a1a";
        //document.getElementsByClassName('eye')[1].style.backgroundColor = "#1a1a1a";
        
        document.getElementsByClassName('eye')[0].style.animation = "blink 0.25s forwards";
        document.getElementsByClassName('eye')[1].style.animation = "blink 0.25s forwards";
        
        blinkWaitTime = Math.floor(Math.random() * 3000) + 500;
        
        clearInterval(blinky);
        self();
    };
    var blinky = setInterval(blinkerer, blinkWaitTime);
};

var friendIndex = 0;

//Mouse movement speed thanks to http://stackoverflow.com/questions/6417036/track-mouse-speed-with-js

function mouseSpeedTracker() {
    var lastmousex=-1; 
    var lastmousey=-1;
    var lastmousetime;
    var mousetravel = 0;
    var mpoints = [];
    var mpoints_max = 30;
    
    
    
    $('html').mousemove(function(e) {
        var mousex = e.pageX;
        var mousey = e.pageY;
        if (lastmousex > -1) {
            mousetravel += Math.max( Math.abs(mousex-lastmousex), Math.abs(mousey-lastmousey) );
        }
        lastmousex = mousex;
        lastmousey = mousey;
    });
    
    var mrefreshinterval = 100;
    
    var mouseChecker = function self() {
        var mdraw = function () {
            
            document.getElementById("coverText").innerHTML = "Look, it's a friend!";
            
            var md = new Date();
            var timenow = md.getTime();
            if (lastmousetime && lastmousetime!=timenow) {
                var pps = Math.round(mousetravel / (timenow - lastmousetime) * 1000);
                mousetravel = 0;
                // All the weird stuff that was written by me goes here
                document.getElementById("nodeContainer").style.top = ((pps*Math.random())*0.01)+"px";
                
                if (mrefreshinterval == 10000) {
                    document.getElementById("nodeContainer").style.transition = "all 0.3s";
                    mrefreshinterval = 100;
                }
                
                if(pps > 5000+(friendIndex*30)) {     
                    friendIndex = 0;                //SCARY!
                    console.log("SCARY!");
                    document.getElementById("coverText").innerHTML = "You scared him :(";
                    document.getElementById("nodeContainer").style.top = "1000px";

                    setTimeout(function() {
                        document.getElementById("nodeContainer").style.transition = "all 5s";
                        
                        setTimeout(function() {
                            document.getElementById("nodeContainer").style.top = "100px";
                            
                            setTimeout(function() {
                                document.getElementById("coverText").innerHTML = "...";
                                document.getElementById("nodeContainer").style.top = "70px";
                                setTimeout(function() {
                                    document.getElementById("nodeContainer").style.top = "0px";
                                }, (Math.random()*1000)+1000);
                            }, (Math.random()*2000)+4000);
                        }, 1000);
                    }, 300);
                    mrefreshinterval = 10000;
                } else {
                    friendIndex += 1-Math.floor(pps/1000);
                }
                
                if (friendIndex > 100) {
                    document.getElementById("coverText").innerHTML = "He trusts you!";
                }
                
                if(document.getElementById("nodeContainer").style.top >= 200) {          // Hide for a bit
                    console.log("hiding");
                    document.getElementById("nodeContainer").style.top = "300px";
                    mrefreshinterval = Math.floor(Math.random()*5)+5;
                }
                
            }
            clearInterval(mousecheckInterval);
            lastmousetime = timenow;
            self();
        }
        var mousecheckInterval = setInterval(mdraw, mrefreshinterval); 
    };
    mouseChecker();
};

var colors = ["green", "orange", "blue", "brown", "#1a1a1a"];
var color = "#1a1a1a";

document.getElementById("node").addEventListener('click', function() {
    color = colors.shift();
    colors.push(color);

    document.getElementById("node").style.backgroundColor = color;
    document.getElementById("node").style.borderColor = color;
});

var w = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

if(w <= 768) {
    document.getElementById("coverText").innerHTML = "He doesn't like phones!";
    friendIndex = -9999999999999999999;
}