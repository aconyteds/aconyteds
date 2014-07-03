define(["dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin","dijit/_WidgetsInTemplateMixin", "dijit/layout/ContentPane", "dojo/_base/array", "dojo/dom-construct", "dojo/dom-class", 'dojo/_base/xhr', "dojo/on", 
"dojo/_base/lang", "custom/imw", "custom/parser", "dijit/focus", "dojo/when", "dojo/hash", "dojo/topic", "dojox/gfx"],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ContentPane, array, domConstruct, domClass, xhr, on, lang, imw, parser, focusUtil, when, hash, topic, gfx){
    imw.css("_RESOURCES/CSS/menu.css");
    return declare("menu",[_WidgetBase],{
        hashes:[],
        buildRendering:function(){
            // create the DOM for this widget
            this.domNode = domConstruct.create("div");
            var mainMenu=this;
            mainMenu.hashes=[];
            domConstruct.place(createMenu(this.data), this.domNode);
            function createMenu(nodes){
                var _listMaster=domConstruct.create("ul", {class:"resMenu"});
                var _menuButton=declare("menuButton", [_WidgetBase],{
                    buildRendering:function(){
                        this.domNode=domConstruct.create("li");
                        this._label=domConstruct.create("span", {innerHTML:this.title});
                        domConstruct.place(this._label, this.domNode);
                        if(this.subMenu){
                            //console.log();
                            this.subMenu=new gfx.createSurface(domConstruct.create("span", {class:"flyout"},this.domNode), "25", "25");
                            this.subMenu.createPath('M2.021,9.748L2.021,9.748V9.746V9.748zM2.022,9.746l5.771,5.773l-5.772,5.771l2.122,2.123l7.894-7.895L4.143,7.623L2.022,9.746zM12.248,23.269h14.419V20.27H12.248V23.269zM16.583,17.019h10.084V14.02H16.583V17.019zM12.248,7.769v3.001h14.419V7.769H12.248z').setFill("inherit");
                            //console.log(this.subMenu);
                            //this.subMenu=domConstruct.place(domConstruct.create("svg", {class:"flyout", viewBox:"0 0 30 30", innerHTML:"<path d='M2.021,9.748L2.021,9.748V9.746V9.748zM2.022,9.746l5.771,5.773l-5.772,5.771l2.122,2.123l7.894-7.895L4.143,7.623L2.022,9.746zM12.248,23.269h14.419V20.27H12.248V23.269zM16.583,17.019h10.084V14.02H16.583V17.019zM12.248,7.769v3.001h14.419V7.769H12.248z'></path>"}), this.domNode);
                            on(this.subMenu, "click", lang.hitch(this.domNode, function(e){
                                e.stopPropagation();
                                //console.log(this);
                                focusUtil.focus(this);
                            }));
                        }
                    },
                    startup:function(){
                        //console.log(this);
                        on(this.domNode, "click", lang.hitch(this, function(e){
                            e.stopPropagation();
                            this._select(this.page, this.hash);
                        }));
                        return this;
                    },
                    placeAt:function(location, opt){
                        domConstruct.place(this.domNode, location, opt||"last");
                        return this;
                    },
                    _select:function(p, h){
                        if(hash().toUpperCase()!=h.toUpperCase())
                            hash(h);
                    }
                });
                array.forEach(nodes, function(node){
                    //create list item, run parse pages on array of pages
                    var _button;
                    if(node.src){//Check to see if the page is a placeholder for more pages
                        //xhr the page for more pages
                        xhr.get({url:node.src, handleAs:"json",load:function(data){
                            _button=new _menuButton({title:node.title, page:node.content||data.pages[0].content, hash:node.hash||data.pages[0].hash, subMenu:true}).placeAt(_listMaster);
                            _button.startup();
                            domConstruct.place(createMenu(data.pages), _button.domNode);
                            mainMenu.hashes.push({hash:_button.hash, page:_button.page});
                            if(hash().toUpperCase()==_button.hash.toUpperCase()){
                                parser.createPage(_button.page, "contentPane");
                            }
                        }});
                    }
                    else{//Page only contains content, lowest node, no sub menu
                        _button=new _menuButton({title:node.title, page:node.content, hash:node.hash, subMenu:false}).placeAt(_listMaster);//TODO PARENT HASHING IE: PS4/THIEF
                        _button.startup();
                        mainMenu.hashes.push({hash:_button.hash, page:_button.page});
                    }
                });
                return _listMaster;
            }
        },
        postCreate:function(){
        },
        placeAt:function(location, opt){
            domConstruct.place(this.domNode, location, opt||"last");
            domClass.add(location, "MenuNode");
            return this;
        },
        startup:function(){
            topic.subscribe("/dojo/hashchange", lang.hitch(this, function(a){
                array.forEach(this.hashes, function(hashTable){
                    if(hashTable.hash.toUpperCase()== a.toUpperCase())
                        parser.createPage(hashTable.page, "contentPane");
                }); 
            }));
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
});