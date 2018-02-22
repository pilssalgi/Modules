module.exports = function(tags,callBack){
	$.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?",
	{ tags: tags,tagmode: "any",format: "json" },
	function(data) {
		var rnd = Math.floor(Math.random() * data.items.length);
		var imgs = [];
		for(var i=0; i<data.items.length; i++){
			var url = data.items[i].media.m.replace('_m','_b');
			imgs.push({url:url,title:data.items[i].title});
		}
		callBack(imgs);
	});
}