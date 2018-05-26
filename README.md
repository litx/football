
![image](https://ws2.sinaimg.cn/large/006tKfTcly1frec65pd0kj31kw0lkwgr.jpg)
![image](https://ws1.sinaimg.cn/large/006tKfTcly1frec6ae0uwj31kw0so7b3.jpg)

https://wallet.nasscan.io/contract.html

TX Hash: 127fd2f6ee3a2e3dc1626a4451c2980791812ef2472203a806f48d8c43fda1f7

Contract address: n1wTF3Y2d1nteJ5awuLcdNxeMu1cnATMcSg

# index.html 主页呈现方式
```
<!DOCTYPE html>
<html>

<head>
    <title>小小公开信</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">

</head>

<body>

     //首先在html文件里，引入需要的依赖文件：
    <script type="text/javascript" src="./dist/nebulas.js"></script>

    <script type="text/javascript" src="./dist/nebPay.js"></script>
    <script type="text/javascript" src="./jquery-3.3.1.min.js"></script>
    <script src="http://cdn.bootcss.com/bootstrap/3.3.0/js/bootstrap.min.js"></script>


    //然后编写前端样式，这里的前端比较简单，提供一个搜索框，一个展示框，一个录入框：
    <div class="container">
        <div class="row clearfix">
            <div class="col-md-12 column">
                <div style="text-align: center">
                    <h1>小小公开信</h1>
                </div>

                <div class="container-fluid">
                        <div class="row-fluid">
                            <div class="span12">
                                 <span class="label">分隔符</span>
                                <div class="list-group">
                                    <a class="list-group-item active">查询公开信</a>
                                </div>
                            </div>
                        </div>
                    </div>

                <div class="input-group col-md-3" style="margin-top:20p;margin-left:20px">
                    <input type="text" class="form-control" placeholder="请输入信件名称" id=search_title />
                    <span class="input-group-btn">
                        <button class="btn btn-info btn-search" id=search>查找</button>

                    </span>
                </div>



            </div>
            <div class="row clearfix">
                <div class="col-md-12 column">
                </div>
            </div>

            <div style="text-align: center">
                <h1 id=title></h1>
            </div>

            <div id=content style="margin-left:20px"></div>

            <div id=author style="text-align: right"></div>



            <div class="container-fluid">
                    <div class="row-fluid">
                        <div class="span12">
                             <span class="label">分隔符</span>
                            <div class="list-group">
                                <a class="list-group-item active">立即发布</a>
                            </div>
                        </div>
                    </div>
                </div>

            <div class="input-group" style="margin-left:20px">
                <span class="input-group-addon">标题</span>
                <input type="text" class="form-control" placeholder="输入标题" id=input_title>
            </div>
            <div class="input-group" style="margin-top:20px ;margin-left:20px">
                <span class="input-group-addon">正文</span>
                <input type="text" class="form-control" placeholder="输入正文" id=input_content>
            </div>
            <div  style="text-align: right;margin-top:20px ">
                    <button class="btn btn-info" id=post>提交</button>
            </div>


        </div>
</body>






//当用户输入信件名称的时候，调用neb的接口，来获取数据，根据回调来展示数据：
<script>
    "use strict";
    var dappContactAddress = "n1ov7Z5oix23riQKUaVensFie5Tr5UiGmBT";
    var nebulas = require("nebulas"), Account = Account, neb = new nebulas.Neb();
    neb.setRequest(new nebulas.HttpRequest("https://mainnet.nebulas.io"))
    var NebPay = require("nebpay");     //https://github.com/nebulasio/nebPay
    var nebPay = new NebPay();
    var serialNumber
    $("#search").click(function () {
        if (!$("#search_title").val()) {
            alter('搜索标题不能为空');
            return;
        }
        $('#content').text("");
        var from = dappContactAddress
        var value = "0";
        var nonce = "0"
        var gas_price = "1000000"
        var gas_limit = "2000000"
        var callFunction = "get";
        var callArgs = "[\"" + $("#search_title").val() + "\"]";
        console.log(callArgs);
        var contract = {
            "function": callFunction,
            "args": callArgs
        }
        neb.api.call(from, dappContactAddress, value, nonce, gas_price, gas_limit, contract).then(function (resp) {
            var result = resp.result;

            if (result === 'null') {
                $('#content').text("没有发现该标题公开信，你可以立即写一篇！");
                $('#title').text("");
                $('#author').text("");
                return;
            }
            console.log(result);
            result = JSON.parse(result);
            $("#title").text(result.title);
            $('#content').text("正文:  " + result.content);
            $('#author').text("作者：" + result.author);
        }).catch(function (err) {
            console.log("error :" + err.message);
        })
    })

    //此时根据nebpay的api，可以调用起chrome钱包插件进行支付：这个时候，编辑一封公开信，点击提交，即可弹出钱包页面进行GAS支付：等提交完毕，即可查询到你写的公开信的内容。
    如果你点击没有反应，那么说明你没有安装chrome插件的钱包，点击这里安装https://github.com/ChengOrangeJu/WebExtensionWallet
    如此一来遍大功告成！

    $('#post').click(function () {
        if (!$("#input_title").val() || !$("#input_content").val()) {
            alert('标题或者文本不能为空');
            return;
        }
        var to = dappContactAddress;
        var value = "0";
        var callFunction = "save";
        var callArgs = "[\"" + $("#input_title").val() + "\",\"" + $("#input_content").val() + "\"]";
        console.log(callArgs);
        serialNumber = nebPay.call(to, value, callFunction, callArgs, {    //使用nebpay的call接口去调用合约,
            listener: function (resp) {
                console.log("thecallback is " + resp)
            }
        });
    })
</script>

</html>
```
# 智能合约代码:合约即原型，前端即设计；

```
'use strict'

//首先新建一个js文件，编写我们所需要的实体，比如一公开信，他应该有标题，内容，以及作者。
var LetterItem = function(text){
    if(text){
        var obj = JSON.parse(text);
        this.title = obj.title;
        this.content = obj.content;
        this.author = obj.author;
    }
};

//其次，我们应该可以有权限访问我们自己智能合约的存储空间，所以根据官方的API来创建存储空间：
LetterItem.prototype = {
    toString : function(){
        return JSON.stringify(this)
    }
};

//这里的数据是以kep-value形式存储的。相信大家很容易理解。
var TheLetter = function () {
    LocalContractStorage.defineMapProperty(this, "data", {
        parse: function (text) {
            return new LetterItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};


//接下来，只需要再编写两个函数，一个是存储公开信，一个是查询公开信，逻辑比较简单，直接贴代码：
TheLetter.prototype ={
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
        var letterItem = this.data.get(title);
        if(letterItem){
            throw new Error("letter has been occupied");
        }

        letterItem = new LetterItem();
        letterItem.author = from;
        letterItem.title = title;
        letterItem.content = content;

        this.data.put(title,letterItem);
    },

    get:function(title){
        if(!title){
            throw new Error("empty title")
        }
        return this.data.get(title);
    }
}

module.exports = TheLetter;
这样，我们就完成了一个简单的智能合约。
```
