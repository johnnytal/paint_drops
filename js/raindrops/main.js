var game_main = function(game){
    score = 0;
    time_passed = 0;
    drop_down = 0;
    time_factor = 0;
};

game_main.prototype = {
    create: function(){
        score = 0;
        time_passed = 0;
        drop_down = 0;
        time_factor = 0;
    
        var bg = this.add.image(0, 0, 'bg');
        bg.alpha = 0.7;

        scoreLabel = this.add.text(300, 60, score + '/' + drop_down, {
            font: '64px ' + font, fill: 'purple', fontWeight: 'normal', align: 'center',
            stroke:'lightyellow', strokeThickness: 4
        });
        scoreLabel.anchor.set(0.5, 0.5);
        scoreLabel.alpha = 0.3;
        
        buckets = game.add.group();
        buckets.enableBody = true;
        buckets.physicsBodyType = Phaser.Physics.ARCADE;
        
        red_bucket = buckets.create(40 ,378, 'bucket');
        red_bucket.frame = 0;
        
        green_bucket = buckets.create(170 ,378, 'bucket');
        green_bucket.frame = 1;
        
        blue_bucket = buckets.create(300 ,378, 'bucket');
        blue_bucket.frame = 2;
        
        yellow_bucket = buckets.create(430 ,378, 'bucket');
        yellow_bucket.frame = 3;
        
        buckets.forEach(function(item) {
            game.physics.enable(item, Phaser.Physics.ARCADE);
            item.inputEnabled = true;
            item.events.onInputDown.add(changeColor, this); 
        }); 
        
        drops = game.add.group();
        drops.enableBody = true;
        drops.physicsBodyType = Phaser.Physics.ARCADE;

        bestScore = localStorage.getItem("raindrops-bestScore");
        if (bestScore == null) bestScore = 0;

        bestScoreLebal = this.add.text(530, 15, 'Best: ' + bestScore, {
            font: '20px ' + font, fill: 'lightgreen', fontWeight: 'normal', align: 'center',
            stroke:'black', strokeThickness: 2
        });
        bestScoreLebal.alpha = 0.8;

        exit_btn = this.add.button(575, 380, 'replay');       
        exit_btn.inputEnabled = true;
        exit_btn.input.useHandCursor = true;
        exit_btn.scale.set(0.65, 0.65);
        
        exit_btn.events.onInputDown.add(function(){ 
            game.state.start('Preloader');
        }, this);

        createDrop();

        modal = new gameModal(game);

        createClouds();
        
        initAd();
    },
    
    update: function(){
        game.physics.arcade.overlap(drops, buckets, drop_hit, null, this);
        game.physics.arcade.overlap(drops, clouds, drop_slow, null, this);
    }
};

function drop_slow(_drop){
    _drop.body.gravity.y -= 9;
    _drop.body.velocity.y -= 3;
}

function changeColor(_item){
    _item.frame++;  
}

function createDrop(){
    if (drop_down == MAX){
        gameOver();
    }
    
    else{
        time_passed++;
    
        time_to_next = 1650 - (time_factor * 1.2);
        
        var x_location;
        
        var drop_to_create = game.rnd.integerInRange(0, 3);
        var x = game.rnd.integerInRange(0, 3);
        var y_location = -20;
        
        switch(x){
            case 0:
                x_location = 40 + (red_bucket.width / 2) - 17;
            break;
            case 1:
                x_location = 170 + (red_bucket.width / 2) - 17;
            break;
            case 2:
                x_location = 300 + (red_bucket.width / 2) - 17;
            break;
            case 3:
                x_location = 430 + (red_bucket.width / 2) - 17;
            break;
        }
    
        drop = drops.create(x_location, y_location, 'drops');
        
        drop.scale.set(0.7, 0.7); 
        game.add.tween(drop.scale).to({ x: 1, y:1 }, 300, Phaser.Easing.Linear.In, true);
        
        drop.frame = drop_to_create;
        game.physics.enable(drop, Phaser.Physics.ARCADE);
        drop.body.gravity.y = 23 + (time_passed * 2 + game.rnd.integerInRange(-5, 5));
        drop.checkWorldBounds = true;
        drop.events.onOutOfBounds.add(dropOut, this);

        cloud_timer = game.time.events.add(time_to_next, function(){
            createDrop(); 
        }, this, []);
        
        time_factor += 12;
    }
}

function dropOut(_drop){
    if (drop_down == MAX){   
        gameOver();
    }
    
    else{
        _drop.kill();
        drop_down++;
        scoreLabel.text = score + '/' + drop_down;
    }
}

function drop_hit(_drop, _bucket){
    if (drop_down == MAX){
        gameOver();
    }
    
    else{
        if (_drop.frame == _bucket.frame){
            
            score++;
            
            animate(_drop.frame, _drop);

            _drop.kill();
            drop_down++;
            scoreLabel.text = score + '/' + drop_down;
        }
    }
}

function animate(_frame, _drop){
    if (_frame == 0){
        debris = game.add.sprite(_drop.x - 11, _drop.y + 31, 'debris_r');
    }
    else if (_frame == 1){
        debris = game.add.sprite(_drop.x - 11, _drop.y + 31, 'debris');
    }
    else if (_frame == 2){
        debris = game.add.sprite(_drop.x - 11, _drop.y + 31, 'debris_b');
    }
    else if (_frame == 3){
        debris = game.add.sprite(_drop.x - 11, _drop.y + 31, 'debris_y');
    }
    
    debris.scale.set(1.5, 1.5);
    debris.animations.add('walk');
    debrisIt = debris.animations.play('walk', 18, false, true);
}

function save_score(){ // if it's the best score ever, save it to local storage
    if (score > bestScore){
        localStorage.setItem( "raindrops-bestScore", score );
        return true;
    }
    else{
        return false;
    }
}

function createClouds(){
    clouds = game.add.group();
    clouds.enableBody = true;
    clouds.physicsBodyType = Phaser.Physics.ARCADE;

    var time_to_next = game.rnd.integerInRange(5000, 12000);
    var start_y = game.rnd.integerInRange(75, 310);
    var velocity_x = game.rnd.integerInRange(-100, 100);
    var cloud_alpha = game.rnd.integerInRange(5, 9);
    var scalingX = game.rnd.integerInRange(75, 95);
    var scalingY = game.rnd.integerInRange(75, 95);
   
    if (velocity_x < 0) start_x = 850;
    else{ start_x = -100; }
    
    cloud = clouds.create(start_x ,start_y, 'cloudN');
    
    var rndNum = game.rnd.integerInRange(0, 3000);

    cloud.body.velocity.x = velocity_x;

    cloud.alpha = '0.' + cloud_alpha;

    cloud.scale.set(scalingX / 100, scalingY / 100);

    if (cloud.body.x < -200 || cloud.body.x > 950) cloud.kill();

    cloud_timer = game.time.events.add(time_to_next, function(){
        createClouds(); 
    }, this, []);
}

function gameOver(){
    drops.forEach(function(item) {
        item.kill();
    }); 
    
    game.state.start('GameOver', false, false, score, save_score()); 
}


function initAd(){
    var admobid = {};

    admobid = {
        interstitial: 'ca-app-pub-9795366520625065/3644945086'
    };
    
    try{
        if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false, isTesting:false} );
    } catch(e){}
}