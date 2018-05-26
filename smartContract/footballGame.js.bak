'use strict'

var GameItem = function(text){
    if(text){
        var obj = JSON.parse(text);
        this.title = obj.title;
        this.content = obj.content;
        this.author = obj.author;
    }
};

GameItem.prototype = {
    toString : function(){
        return JSON.stringify(this)
    }
};

var FootBallGame = function () {
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return new GameItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

FootBallGame.prototype ={
    init:function(){

    },

    save:function(title,content){
        if(!title || !content){
            throw new Error("empty title or content")
        }

        if(title.length > 20 || content.length > 500){
            throw new Error("title or content  exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var gameItem = this.data.get(title);
        if(gameItem){
            throw new Error("letter has been occupied");
        }

        gameItem = new GameItem();
        gameItem.author = from;
        gameItem.title = title;
        gameItem.content = content;

        this.data.put(title,gameItem);
    },

    get:function(author){
        if(!author){
            throw new Error("empty author")
        }
        return this.data.get(author);
    }
}

module.exports = FootBallGame;
