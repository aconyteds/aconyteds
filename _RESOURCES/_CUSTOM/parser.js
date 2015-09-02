define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/Evented",
    
    "dojo/dom-construct", 
    "dojo/_base/array", 
    "dojo/_base/lang", 
    "dijit/layout/ContentPane", 
    "dojo/dom"], 
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Evented,
    domConstruct, array, lang, ContentPane, dom){
    
    var contentTypes={
        text:ContentPane,
        embed:declare([_WidgetBase],{
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
        }),
        //WIP
        templated:function(options){
            var me=this;
            require([options.requires], function(args){
                lang.mixin(me, new declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin],{
                    templateString:options.template,
                    constructor:function(){
                        
                    }
                }));
                return;
            });
        }
    };
    
    var parserObj=declare([_WidgetBase, Evented],{
        baseClass:"content",
        postCreate:function(){
            this.inherited(arguments);
        },
        cleanParse:function(h,l,c){
            dom.byId("subTitle").innerHTML=h.title;
            this.clear("contentPane");
            this.createPage(h,l,c);
        },
        createPage:function(node, loc, clear){
            var _this=this;
            if(!!clear){
                this.clear(loc);
            }
            array.forEach(node.page, function(item){
                _this._place(_this._parse(item), loc);
                if(item.startup){
                    item.startup();
                }
            });
        },
        clear:function(loc){
            domConstruct.empty(loc);
        },
        getContent:function(){
            return this.domNode.innerHTML;
        },
        _parse:function(node){
            //console.log(node);
            var elem=new contentTypes[node.$type](this._removeConditionals(node));
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
                if(i.charAt(0)==="$"){
                    delete a[i];
                }
            };
            return a;
        }
    });
    return parserObj;
});