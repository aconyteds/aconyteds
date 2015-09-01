require([
	"dojo/_base/array",
	"dojo/_base/window",
	"dojo/on",
	"dojo/dom-attr",
	
	"custom/imw",
	"custom/menu",
	"custom/parser",
	
	"configs/config",
	"dojo/topic",
	"configs/topics",
	
	"dojo/domReady!"
],function(
	array, win, on, domAttr,
	cImw, cMenu, cParser,
	config,	topic, Topics, router){
    document.title=config.title;
    
    var Controller = {
    	appConfig:config,
    	parser : new cParser({config:config}, "contentPane")
    };
	array.forEach(config.themes, function(theme){
		cImw.css(theme.url);
		if(theme["default"]){
			domAttr.set(document.body, "class", theme.name);
		}
	});
	array.forEach(config.css, function(file)
	{
		cImw.css(file);
	});
    
    Controller.menu = new cMenu({
    	config:config.sections,
    	appController:Controller
    }).placeAt("menuPane").startup();
	
	on(win.global, "resize", function(obj){
        console.log(obj);
    });
});