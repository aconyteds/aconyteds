define(["dojo/dom-construct", "dojo/_base/array", "dojo/_base/lang", "dijit/layout/ContentPane", "dojo/dom", "dojo/_base/declare", "dijit/_WidgetBase", "dojo/topic"], 
function(domConstruct, array, lang, ContentPane, dom, declare, _WidgetBase, topic){
    topic.subscribe("cParser/CREATEPAGE", function(h, l, c){
        dom.byId("subTitle").innerHTML=h.title;
        parserObj.clear("leftPane");
        parserObj.createPage(h.page, l, c);
    });
    
    var parserObj={
        createPage:function(node, loc, clear){
            if(!clear)
                this.clear(loc);
            array.forEach(node, lang.hitch(this, function(item){
                this._place(this._parse(item), loc);
                if(item.startup)
                    item.startup();
            }));
        },
        clear:function(loc){
            domConstruct.empty(loc);
        },
        _parse:function(node){
            var elem=new this["__"+node.$type](this._removeConditionals(node));
            if(node.$children)
                this.createPage(node.$children, elem, true);
            return elem
        },
        _place:function(node, loc, place){
            domConstruct.place(node.domNode, loc, place||"last");
        },
        _removeConditionals:function(node){
            //find special conditionals we use that should not make it to end product
            var a=lang.clone(node);
            for(var i in a){ 
                if(i.charAt(0)==="$")
                    delete a[i];
            };
            return a;
        },
        __text:ContentPane,
        __embed:declare([_WidgetBase],{
            buildRendering:function(){
                this.domNode=domConstruct.create("div", {className:this.params.className||"iframeContainer"});
                this._loading=domConstruct.create("div", {innerHTML:"Loading... If nothing shows up here, I meant to show you <a href='"+this.params.src+"' target='_blank'>This</a>", style:"text-align:center;"});
                domConstruct.place(this._loading, this.domNode);
                this._iframe=domConstruct.create("iframe", this.params);
                this._iframe.src+="?wmode=transparent";
                this._iframe.onload=lang.hitch(this, function(){
                    domConstruct.destroy(this._loading);
                });
                if(this.params.allowfullscreen)
                    this._iframe.addAttribute="allowfullscreen";
                domConstruct.place(this._iframe, this.domNode, "first");
            },
            postCreate:function(data){
                return this;
            }
        })
    }
    return parserObj;
});