// module.exports = function(tags,callBack){
// 	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
// 	{ tags: tags,tagmode: "any",format: "json" },
// 	function(data) {
// 		var rnd = Math.floor(Math.random() * data.items.length);
// 		var imgs = [];
// 		for(var i=0; i<data.items.length; i++){
// 			var url = data.items[i].media.m.replace('_m','_b');
// 			imgs.push({url:url,title:data.items[i].title});
// 		}
// 		callBack(imgs);
// 	});
// }


const $ = require('Jquery');
module.exports = function(_tags,callBack){
	let images = ['127487290@N05','15418398@N00','97031425@N03','98400159@N08','124051802@N04'];
  let tags = ['sun','sky','sea','mountain','sunrise','dawn','light','hill','mono','tree','mist','fog'];
  let id = images[Math.floor((images.length) * Math.random())];

	$.getJSON("https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?&per_page=40",
	{ id:id, tags: tags, tagmode: "any",format: "json" },
	function(data) {
		var imgs = [];
		for(var i=0; i<data.items.length; i++){
			var url = data.items[i].media.m.replace('_m','_b');
			imgs.push({url:url,title:data.items[i].title});
		}
		callBack(imgs);
	});
}