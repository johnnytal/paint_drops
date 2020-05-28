var preloader = function(game){
    MAX = 60;
};
 
preloader.prototype = {
    preload: function(){ 
        // create progress % text
        font = 'Luckiest Guy';
        font2 = 'MeltdownMF';
         
        this.progress = this.game.add.text(this.game.world.centerX, this.game.world.centerY - 30, '0%',{
             font: '25px ' + font2, fill: 'white', fontWeight: 'normal', align: 'center'
        });
        this.progress.anchor.setTo(0.5, 0.5);
        this.game.load.onFileComplete.add(this.fileComplete, this);

        this.game.load.onFileComplete.add(this.fileComplete, this);
  
        loadingTxt = this.add.text(this.game.world.centerX - 37,  this.game.world.centerY - 150, "Loading...", {
            font: '18px ' + font, fill: 'lightgrey', fontWeight: 'normal', align: 'center'
        });

        game.load.spritesheet('bucket', 'assets/raindrops/images/bucket.png', 398/4, 103);
        game.load.spritesheet('drops', 'assets/raindrops/images/drops.png', 140/4, 52);
        
        game.load.spritesheet('debris', 'assets/raindrops/images/debris.png', 40, 17);
        game.load.spritesheet('debris_b', 'assets/raindrops/images/debris_b.png', 40, 17);
        game.load.spritesheet('debris_r', 'assets/raindrops/images/debris_r.png', 40, 17);
        game.load.spritesheet('debris_y', 'assets/raindrops/images/debris_y.png', 40, 17);
        
        game.load.image('panel', 'assets/raindrops/images/panel.png');
        game.load.image('replay', 'assets/raindrops/images/replay.png');
        game.load.image('inst', 'assets/raindrops/images/inst.png');
        game.load.image('cloudN', 'assets/raindrops/images/cloudN.png');
        game.load.image('bg', 'assets/raindrops/images/bg.jpg');
        game.load.image('bg2', 'assets/raindrops/images/bg2.jpg');
        game.load.image("playBtn","assets/raindrops/images/playbtn.png");
    },
    
    create: function(){
        var bg = this.add.image(0, 0, 'bg');
        var bg2 = this.add.image(0, 0, 'bg2');
        bg.alpha = 0.8;
        bg2.alpha = 0.4;

        text = this.add.text(25,  15, "P a I n T   D r O p S ! ", {
            font: '60px '+ font2, fill: 'white', align: 'center',
       
        });
        text.setShadow(3, 3, 'rgba(50,0,50,0.2)', 5);

        textTween = game.add.tween(text).from( { x: 60, y: -300 }, 500, Phaser.Easing.Sinusoidal.InOut, true); 

        playBtn = this.add.button(240, 290, 'playBtn');       
        playBtn.inputEnabled = true;
        playBtn.scale.set(.8, .8);
        
        playBtn.events.onInputDown.add(function(){ 
            this.game.state.start("Game");  
        }, this);

        instructions = this.add.text(115,  120, "*  Tap  the  buckets\n*  Match  the  colors\n*  Catch  all  " + MAX + "  drops !", {
            font: '36px ' + font, fill: 'blue', align: 'center',
            stroke:'#f7f7f7', strokeThickness: 4
        });
    }, 
};

preloader.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
    this.progress.text = progress+"%";
};