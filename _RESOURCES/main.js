require(["dojo/parser",'dojo/_base/xhr',"dojo/_base/array", "custom/imw", "dojo/dom-attr", "custom/menu", "custom/parser", "dojo/_base/window", "dojo/on", "dojo/domReady!"],
function(parser, xhr, array, imw, domAttr, menu, Cparser, win, on){
    parser.parse();
    xhr.get({url:"config.json", handleAs:"json",load: function(data)
	{
        document.title=data.title;
		array.map(data.themes, function(theme){
			imw.css(theme.url);
			if(theme["default"])
				domAttr.set(document.body, "class", theme.name);
		});
		array.map(data.css, function(file)
		{
			imw.css(file);
		});
	}}).then(function(data)
	{
        var _menu=new menu({data:data.sections}).placeAt("menuPane").startup();
	});
	on(win.global, "resize", function(obj){
        console.log(obj);
    });
});