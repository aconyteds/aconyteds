require(["dojo/parser",'dojo/_base/xhr',"dojo/_base/array", "custom/imw", "dojo/dom-attr", "custom/menu", "dojo/_base/window", "dojo/on", "custom/hashes", "dojo/hash",  "dojo/domReady!"],
function(parser, xhr, array, cImw, domAttr, cMenu,  win, on, cHashes, hash){
    parser.parse();
    xhr.get({url:"config.json", handleAs:"json",load: function(data)
	{
        document.title=data.title;
		array.map(data.themes, function(theme){
			cImw.css(theme.url);
			if(theme["default"])
				domAttr.set(document.body, "class", theme.name);
		});
		array.map(data.css, function(file)
		{
			cImw.css(file);
		});
	}}).then(function(data)
	{
        var _menu=new cMenu({data:data.sections}).placeAt("menuPane").startup().createRecursiveMenu();
        //var subMenu=new cMenu({data:data.sections, subMenus:false}).placeAt("leftPane").startup();
	}).then(function(){
		if(hash()==="")
        	hash("home");
        else
        	hash(hash());
	});
	on(win.global, "resize", function(obj){
        console.log(obj);
    });
});