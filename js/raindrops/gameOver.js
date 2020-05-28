var game_over = function(game){};

game_over.prototype = {
    preload: function(){},
     
    init: function(score, best){
        var bestMessage, message;
/*
        if (googlelogindone){
            socialService.submitScore( score, function(error){});
        }
        
        else{
            try{
                Cocoon.Social.GooglePlayGames.init({
                     defaultLeaderboard: "CgkIje7_iOsBEAIQBg"
                });
                
                socialService = Cocoon.Social.GooglePlayGames.getSocialInterface();
        
                socialService.login(function(loggedIn, error) {
                    if (loggedIn) {
                        googlelogindone = true;
                        socialService.submitScore( score, function(error){});
                    }   
                });
            } catch(e){}
        }      
 */
        if (best){
            bestMessage = '\nNew high score!';
        }
        else{
            bestMessage = '\nTry again!';
        }
        
        message = score + ' Out of '+ MAX +'! (' + Math.round(score / MAX * 100) + '%)' + bestMessage; 
     
        modal.createModal({
            type:"game_over",
            includeBackground: false,
            modalCloseOnInput: false,
            itemsArr: 
            [
                 {
                    type: "image",
                    content: "panel",
                    contentScale: 1.35
                },
                {
                    type: "text",
                    content: message,
                    fontFamily: font,
                    fontSize: 36,
                    offsetY: -100,
                    color: "0xffdd11",
                    stroke: "0xff0ff0",
                    strokeThickness: 4
                },
                {
                    type: "image",
                    content: "inst",
                    offsetY: 70,
                    offsetX: 60,
                    callback: function () { // menu
                    	if(AdMob) AdMob.showInterstitial();
                        game.state.start('Preloader');
                    }
                },            
                {
                    type: "image",
                    content: "replay",
                    offsetY: 70,
                    offsetX: -60,
                    callback: function () { // new game
                    	if(AdMob) AdMob.showInterstitial();
                        game.state.start('Game');
                    }
                }
            ]
        });   
            
        modal.showModal("game_over");
        for (n=0; n<4; n++){
            game.add.tween(modal.getModalItem('game_over',n)).from( { y: - 800 }, 500, Phaser.Easing.Linear.In, true);
        }
        
        replayImg = modal.getModalItem('game_over',2);
        replayImg.input.useHandCursor = true;
        
        playImg = modal.getModalItem('game_over',3);
        playImg.input.useHandCursor = true;
    }
};
