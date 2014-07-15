define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin", "dijit/layout/ContentPane", "dojo/_base/array", "dojo/dom-construct", "dojo/dom-class", 'dojo/_base/xhr', "dojo/on", 
"dojo/_base/lang", "custom/imw", "dijit/focus", "dojo/when", "dojo/hash", "dojo/topic", "dojo/query"],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, array, domConstruct, domClass, xhr, on, lang, cImw, focusUtil, when, hash, topic, query){
    cImw.css("_RESOURCES/CSS/menu.css");
    var menuObj=declare("menu",[_WidgetBase],{
        hashes:[],
        postMixInProperties:function(){
            this.buildMenu=declare([_WidgetBase],{
                postMixInProperties:function(){
                    this.buttons=[];
                    this.domNode=domConstruct.create("ul", {class:"resMenu"});
                    this._menuButton=declare([_WidgetBase],{
                        buildRendering:function(){
                            this.domNode=domConstruct.create("li");
                            this._label=domConstruct.create("span", {innerHTML:this.title});
                            domConstruct.place(this._label, this.domNode);
                            if(this.subMenu){
                                this.subMenu=domConstruct.create("span", {class:"flyout"},this.domNode);
                                on(this.subMenu, "click", lang.hitch(this.domNode, function(e){
                                    e.stopPropagation();
                                    e.cancelBubble = true;
                                    focusUtil.focus(this);
                                }));
                            }
                        },
                        startup:function(){
                            on(this.domNode, "click", lang.hitch(this, function(e){
                                e.stopPropagation();
                                e.cancelBubble = true;
                                this._select(this.hash);
                            }));
                            return this;
                        },
                        placeAt:function(location, opt){
                            domConstruct.place(this.domNode, location, opt||"last");
                            return this;
                        },
                        _select:function(h){
                            hash(h);
                        }
                    });
                },
                buildRendering:function(){
                    array.forEach(this.nodes,  lang.hitch(this, function(node){
                        //create list item, run parse pages on array of pages
                        var _button=new this._menuButton({title:node.title, page:node.content, hash:this.parentHash+node.hash, subMenu:this.subMenus===undefined&&node.src!==undefined}).placeAt(this.domNode);
                        topic.publish("hashes/NEWHASH",{hash:_button.hash, page:_button.page, title:_button.title, otherNodes:this.nodes, parentHash:this.parentHash});
                        _button.startup();
                        this.buttons.push(_button);
                    }));
                },
                placeAt:function(location, opt){
                    domConstruct.place(this.domNode, location, opt||"last");
                    return this;
                },
                buttons:[]
            });
            //Recursive Function designed to parse through each node list to createa full menu.
            this._recursivinator=function(d, loc){
                var __X=this;
                if(d.src){
                    xhr.get({url:d.src, handleAs:"json",load:function(data){
                        var _currMenu=__X.buildMenu({nodes:data.pages, parentHash:d.hash+"/"}).placeAt(loc.domNode);
                        array.forEach(data.pages, function(page, itr){
                            if(loc.page===undefined){
                                topic.publish("hashes/CHANGEHASH", loc.hash, page);
                            }
                            __X._recursivinator(page, _currMenu.buttons[itr]);
                        });
                    }});
                }
            }
        },
        buildRendering:function(){
            // create the DOM for this widget
            this.domNode = domConstruct.create("div");
        },
        postCreate:function(){
            this._menuMaster=this.buildMenu({nodes:this.data, parentHash:"", subMenus:this.subMenus}).placeAt(this.domNode);
        },
        createRecursiveMenu:function(){
            array.forEach(this.data, lang.hitch(this, function(datas, itr){
                lang.hitch(this, this._recursivinator(datas, this._menuMaster.buttons[itr]));
            }));
        },
        placeAt:function(location, opt){
            domConstruct.place(this.domNode, location, opt||"last");
            domClass.add(location, "MenuNode");
            return this;
        },
        startup:function(){
            
            if(hash()==="")
                hash("home");
            return this;
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