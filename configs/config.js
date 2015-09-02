define([],
	function() {
		return {
			title: "Ian's Personal Website",
			themes: [{
				name: "claro",
				url: "//js.arcgis.com/3.8/js/dojo/dijit/themes/claro/claro.css",
				"default": false
			}, {
				name: "tundra",
				url: "//js.arcgis.com/3.8/js/dojo/dijit/themes/tundra/tundra.css",
				"default": true
			}],
			css: [
				"//js.arcgis.com/3.8/js/esri/css/esri.css",
				"_RESOURCES/CSS/base.css"
			],
			sections: [{
				src: "content/home",
				title: "Home",
				hash: "Home",
				menuClass:"Home"
			},{
				src:"content/webdev",
				title:"Web Development",
				hash:"WebDevelopment",
				menuClass:"Development"
			},{
				src: "content/gaming",
				title: "Gaming",
				hash: "Gaming",
				menuClass:"Gaming"
			}, {
				src: "content/fitness",
				title: "Fitness",
				hash: "Fitness",
				menuClass:"Fitness"
			}]
		};
	});