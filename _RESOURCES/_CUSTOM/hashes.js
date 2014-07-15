require(["dojo/hash", "dojo/topic", "custom/parser", "dojo/_base/array", "dojo/_base/lang", "dojo/Stateful"], 
function(hash, topic, cParser, array, lang, stateful){
     var _hashes=[];
     var _hashTable=[];
     topic.subscribe("hashes/NEWHASH", function(h){
          var temp=[];
          array.forEach(h.otherNodes, function(node){
               temp.push(h.parentHash+node.hash);
          });
          lang.mixin(h, {otherNodes:temp});
          console.log(h);
          _hashes.push(h);
          _hashTable.push(h.hash.toUpperCase());
          if(hash()==="")
               hash("home");
          else if(h.hash==hash()&&h.page!==undefined)
               topic.publish("cParser/CREATEPAGE", h, "contentPane");
     });
     topic.subscribe("hashes/CHANGEHASH", function(h, m){
          array.forEach(_hashes, function(l){
               if(l.hash===h){
                   l.page=m.content;
                   if(h.toUpperCase()===hash().toUpperCase()){
                        topic.publish("cParser/CREATEPAGE", l, "contentPane");
                   }
               }
          });
     });
     topic.subscribe("/dojo/hashchange", function(a){
          topic.publish("cParser/CREATEPAGE", _hashes[array.indexOf(_hashTable, a.toUpperCase())], "contentPane");
     });
});