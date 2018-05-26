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
        var GameItem = this.data.get(title);
        if(GameItem){
            throw new Error("letter has been occupied");
        }

        GameItem = new GameItem();
        GameItem.author = from;
        GameItem.title = title;
        GameItem.content = content;

        this.data.put(title,GameItem);
    },

    get:function(title){
        if(!title){
            throw new Error("empty title")
        }
        return this.data.get(title);
    }
}

module.exports = FootBallGame;
