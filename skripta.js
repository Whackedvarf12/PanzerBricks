var music=new Audio("zvok/Anthem.mp3");
var musiclist=["zvok/Anthem.mp3", "zvok/ToServe.mp3", "zvok/TankMarch.mp3"]
music.volume=0.5;
var musicmode=0;
var musicpointer=1;
let userInteracted = false;
window.addEventListener('click', (event) => {
	if (!userInteracted) {
		userInteracted = true;
        music.play();
        document.getElementById("musicbutton").style.backgroundImage="url(slike/music.jpg)";
        musicmode=1;
    }
 });
 music.addEventListener('ended', function(){
    this.currentTime=0;
    this.src=musiclist[musicpointer]
    musicpointer=musicpointer+1;
    this.play();
    if(musicpointer>=musiclist.length){
        musicpointer=0;
    }
  },false);
function musicmanager(){
    if(musicmode==0){
        music.play()
        document.getElementById("musicbutton").style.backgroundImage="url(slike/music.jpg)";
        musicmode=1;
    }
    else if(musicmode==1){
        music.pause();
        document.getElementById("musicbutton").style.backgroundImage="url(slike/nomusic.jpg)";
        musicmode=0;
    }
  }
function begin(){
    document.getElementById("button").style.display="none";
    document.getElementById("title").style.display="none";
    document.getElementById("wrapper").style.display="block";
    document.getElementById("continue").style.display="block";
    var tab=[0,0,0,0,0]
    if(localStorage.getItem("highscores")==null){
        localStorage.setItem("highscores", JSON.stringify(tab));
    }
}
function con(){
    document.getElementById("wrapper").style.display="none";
    document.getElementById("continue").style.display="none";
    document.getElementById("can").style.display="block";
    var canvas=document.getElementById("gamecan");
    var ctx=canvas.getContext("2d");
    var ballR=15;
    var hit=new Audio('zvok/Hit.mp3');
    var bigBoom = new Audio('zvok/BigBoom.mp3');
    var x=canvas.width/2;
    var y=canvas.height-30;
    var dx=3;
    var dy=-3;
    var pongH=100;
    var pongW=300;
    var img = new Image();   // Create new img element
    img.src = 'slike/kv2R.png';
    var panzer=new Image();
    panzer.src='slike/panzer4.png'
    var pongX=(canvas.width-pongW)/2;
    var rightKey=false;
    var leftKey=false;
    var brickRows=3;
    var brickCol=9;
    var brickW=142;
    var brickH=60;
    var brickPadding=10; 
    var brickOffsetTop=30;
    var brickOffsetLeft=30;
    var bricks=[];
    var hitsToDo=81;
    var brickFill="black";
    var score=0;
    for(c=0;c<brickCol;c++){
        for(r=0;r<brickRows;r++){
  	        bricks.push({
  	        x:(c*(brickW+brickPadding))+brickOffsetLeft,
  	        y:(r*(brickH+brickPadding))+brickOffsetTop,
  	        status:3
  	        });
  	    }
    }
    function drawBall(){
  	    ctx.beginPath();
  	    ctx.arc(x, y, ballR, 0, Math.PI*2);
  	    ctx.fillStyle="red";
  	    ctx.fill();
  	    ctx.closePath();
    }
    function drawPong(){
  	    ctx.beginPath();
        //ctx.rect(pongX, canvas.height-pongH, pongW, pongH);
        ctx.drawImage(img, pongX, canvas.height-pongH);
  	    //ctx.fillStyle="black";
  	    //ctx.fill();
  	    ctx.closePath();
    }
    function drawBricks() {
  	    bricks.forEach(function(brick) {
  	    if (!brick.status){
		    return;
	    }
	    if(brick.status==3){
            //brickFill="black";
            panzer.src='slike/panzer4.png';
	    }
        if(brick.status==2){
            //brickFill="orange";
            panzer.src='slike/panzer3.png';
        }
        if(brick.status==1){
           //brickFill="green";
           panzer.src='slike/panzer2.png';
        }
  	    ctx.beginPath();
        //ctx.rect(brick.x, brick.y, brickW, brickH);
        ctx.drawImage(panzer, brick.x, brick.y);  
  	    ctx.fillStyle=brickFill;
  	    ctx.fill();
  	    ctx.closePath();
  	    });
    }
    function collisionDetection(){
  	    bricks.forEach(function(b){
  	        if (!b.status){
                return;
            }
  	        var inBricksColumn=x>b.x&&x<b.x+brickW;
  	        var inBricksRow=y>b.y&&y<b.y+brickH;
  	        if(inBricksColumn&&inBricksRow){
                hit.play();
  	            dy=-dy;
                b.status=b.status-1;
                hitsToDo-=1;
            if(hitsToDo<=0){
                clearInterval(inter);
				if(typeof(Storage)!=="Undefined"){
					localStorage.setItem("score", score)
				}
				else{
					alert("The score sistem can not function properly on this browser.");
				}
				document.getElementById("can").style.display="none";
				letter();
            }
  	    }
  	});
    }
    function draw(){
	    score=81-hitsToDo;
	    console.debug("score "+score);
        if(hitPong()){
            bigBoom.play();
        }
  	    ctx.clearRect(0, 0, canvas.width, canvas.height);
  	    drawBricks();
  	    drawBall();
  	    drawPong();
  	    collisionDetection();
  	    if (hitSideWall()){
            dx=-dx;
        }
  	    if (hitTop()  ||  hitPong()){
            dy=-dy;
        }
  	    if (gameOver()){
            clearInterval(inter);
            if(typeof(Storage)!=="Undefined"){
                localStorage.setItem("score", score)
            }
            else{
                alert("The score sistem can not function properly on this browser.");
            }
            document.getElementById("can").style.display="none";
            letter();
        }
        var RIGHT_ARROW=39;
        var LEFT_ARROW=37;
  	    function hitPong(){
            return hitBottom()&&ballOverPong();
        }
        function ballOverPong(){
            return x>pongX&&x<pongX+pongW;
        }
  	    function hitBottom(){
            return y+dy>canvas.height-ballR;
        }
        function gameOver(){
            return hitBottom()&&!ballOverPong();
        }
  	    function hitSideWall(){
            return x+dx>canvas.width-ballR||x+dx<ballR;
        }
  	    function hitTop(){
            return y+dy<ballR;
        }
  	    function rightPressed(e){
            return e.keyCode==RIGHT_ARROW;
        }
  	    function leftPressed(e){
            return e.keyCode==LEFT_ARROW;
        }
  	    function keyDown(e){
  	        rightKey=rightPressed(e);
  	        leftKey=leftPressed(e);
  	    }
  	    function keyUp(e){
  	        rightKey=rightPressed(e)?false:rightKey;
  	        leftKey=leftPressed(e)?false:leftKey;
  	    }
  	    document.addEventListener("keydown", keyDown, false);
  	    document.addEventListener("keyup", keyUp, false);
        var maxX=canvas.width-pongW;
        var minX=0;
        var pongDelta=rightKey?7:leftKey?-7:0;
  	    pongX=pongX + pongDelta;
  	    pongX=Math.min(pongX, maxX);
  	    pongX=Math.max(pongX, minX);
        x=x+dx;
	    y=y+dy;
    }
    var inter=setInterval(draw, 10); 	  
}
function letter(){
    var newscore=parseInt(localStorage.getItem("score"));
    var lasths;
    var sesionscore=localStorage.getItem("score");
    var highscores=JSON.parse(localStorage.getItem("highscores"));
    for(var i=0;i<highscores.length;i++){
        if(newscore>parseInt(highscores[i])){
            lasths=highscores[i];
            highscores[i]=newscore;
            newscore=lasths;
        }
        else if(newscore<highscores[i]){
        }
        else{
            newscore=0;
        }
    }
    localStorage.setItem("highscores", JSON.stringify(highscores));
    console.debug(localStorage.getItem("highscores"));
    document.getElementById("wrapperend").style.display="block";
    document.getElementById("endbutton").style.display="block";
    document.getElementById("scorebutton").style.display="block";
    document.getElementById("letter").innerHTML="Dead comrade family<br/>I am sorry to inform you of comrades death at the hand of germans. He and crew sacrificed self for motherland, they will not be forgoten. Before he died he sent "+sesionscore+" panzers to gulag.<br/><br/>Papa Stalin";
}
function back(){
    document.getElementById("wrapperend").style.display="none";
    document.getElementById("endbutton").style.display="none";
    document.getElementById("scorebutton").style.display="none";
    document.getElementById("button").style.display="block";
    document.getElementById("title").style.display="block";
}
var mode=0;
function scores(){
    if(mode==1){
        mode=0;
        var sesionscore=localStorage.getItem("score");
        document.getElementById("letter").innerHTML="Dead comrade family<br/>I am sorry to inform you of comrades death at the hand of germans. He and crew sacrificed self for motherland, they will not be forgoten. Before he died he sent "+sesionscore+" panzers to gulag.<br/><br/>Papa Stalin";
    }
    else{
        mode=1;
        var highscores=JSON.parse(localStorage.getItem("highscores"));
        document.getElementById("letter").innerHTML="Top comrades:</br>"+"The Ivan: "+highscores[0]+"</br>"+"Hero of USSR: "+highscores[1]+"</br>"+"Tank ace: "+highscores[2]+"</br>"+"Tank hunter: "+highscores[3]+"</br>"+"Level 1 blyat: "+highscores[4]+"</br>";
    }
}