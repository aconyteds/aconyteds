define(["dojo/dom-construct", "dojo/_base/array", "dojo/_base/lang", "dijit/layout/ContentPane"], function(domConstruct, array, lang, ContentPane){
    return{
        createPage:function(node, loc, clear){
            if(!clear)
                this._clear(loc);
            array.forEach(node, lang.hitch(this, function(item){
                this._place(this._parse(item), loc);
            }));
        },
        _clear:function(loc){
            domConstruct.empty(loc);
        },
        _parse:function(node){
            this._removeConditionals(node);
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
            array.forEach(node, function(i){
                if(i.search("$")>-1)
                    node.splice(i,1);
            })
            return node;
        },
        __text:ContentPane
    }
});