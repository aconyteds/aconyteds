define([
    "dojo/_base/declare",
    "dijit/_WidgetBase",
    "dojo/Evented",
    "dojo/router",
    "dojo/hash",
    
    "dijit/layout/ContentPane",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/dom-class", 
    'dojo/_base/xhr', 
    "dojo/on", 
    
    "dojo/_base/lang",
    "custom/imw", 
    "dijit/focus", 
    "dojo/when", 
    "dojo/topic",
    "configs/topics",
    "dojo/query"],
function(declare, _WidgetBase, Evented, router, Hash,
    ContentPane, array, domConstruct, domClass, xhr, on,
    lang, cImw, focusUtil, when, topic, Topics, query){
        
        router.startup();
        var Button= declare([_WidgetBase],{
            constructor:function(){
                this.domNode=domConstruct.create("li");
            },
            buildRendering:function(){
                this._label=domConstruct.create("span", {innerHTML:this.label});
                domConstruct.place(this._label, this.domNode);
            },
            postCreate:function(){
                var _this=this;
                if(this.subMenu){
                    this.subMenu=domConstruct.create("span", {class:"flyout"},this.domNode);
                    on(this.subMenu, "click",function(e){
                        e.stopPropagation();
                        e.cancelBubble = true;
                        focusUtil.focus(_this.domNode);
                    });
                }
                on(this.domNode, "click", function(e){
                    e.stopPropagation();
                    e.cancelBubble = true;
                    _this._select(_this.hash);
                });
            },
            startup:function(){
                return this;
            },
            placeAt:function(location, opt){
                domConstruct.place(this.domNode, location, opt||"last");
                return this;
            },
            _select:function(h){
                router.go(h);
            }
        });
            
        var Menu=declare([_WidgetBase],{
            constructor:function(){
                this.domNode=domConstruct.create("ul", {class:"resMenu"});
            },
            postMixInProperties:function(){
                this.buttons=[];
            },
            postCreate:function(){
                var _this=this;
                array.forEach(this.nodes,  function(node){
                    //create list item, run parse pages on array of pages
                    var _button=new Button({
                        label:node.title,
                        page:node.content, 
                        hash:node.hash, 
                        subMenu:!_this.subMenus&&!!node.src
                    }).placeAt(_this.domNode);
                    if(!!node.menuClass){
                        domClass.add(_button.domNode, node.menuClass);
                    }
                    if(_button.page){
                        _this.own(lang.hitch(this, _this._registerPage(_button.hash, _button.page, _button.label)));
                    }
                    _button.startup();
                    _this.buttons.push(_button);
                });
            },
            placeAt:function(location, opt){
                domConstruct.place(this.domNode, location, opt||"last");
                return this;
            },
            _registerPage:function(hash, page, title){
                var _this=this;
                var currParse = function(){
                    _this.parser.cleanParse({
                        page:page,
                        title:title
                    }, "contentPane");
                }
                var currRoute = router.register(hash, currParse);
                if(Hash()==hash){
                    currParse();
                }
                return currRoute;
            }
        });
        
        var menuObj=declare([_WidgetBase],{
            constructor:function(){
                 // create the DOM for this widget
                this.domNode = domConstruct.create("div");
            },
            postMixInProperties:function(){
                this.hashes=[];
                this.router=router;
            },
            postCreate:function(){
                var _this=this;
                this._menuMaster= new Menu({
                    nodes:this.config,
                    subMenus:!!this.subMenus,
                    parser:this.appController.parser
                }).placeAt(this.domNode);
                array.forEach(this.config, function(datas, itr){
                    lang.hitch(_this, _this._initSubMenu(datas, _this._menuMaster.buttons[itr]));
                });
            },
            placeAt:function(location, opt){
                domConstruct.place(this.domNode, location, opt||"last");
                domClass.add(location, "MenuNode");
                return this;
            },
            startup:function(){
                if(!Hash()){
                    Hash("Home");
                }
                return this;
            },
            _initSubMenu:function(d, loc){
                var _this=this;
                if(d.src){
                    require([d.src], function(data){
                        var _currMenu=new Menu({
                            nodes:data.pages,
                            parser:_this.appController.parser
                        }).placeAt(loc.domNode);
                        array.forEach(data.pages, function(page, itr){
                            lang.hitch(_this, _this._initSubMenu(page, _currMenu.buttons[itr]));
                        });
                    });
                }
            },
            _setFocus:function(){
                //function that will flag the main div so that the sub menu stays open
            },
            _reformatSmall:function(){
                //for phones
            },
            _reformatMedium:function(){
                //for tablets
            },
            _reformatLarge:function(){
                //for computers
            }
        });
        return menuObj;
});