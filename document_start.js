//stopping document execution immediately (like stop(), but better)
document.open();

//adding basic structure to prevent original from loading
//also to change favicon :3
var bro = chrome || browser;
var ext_url = bro.runtime.getURL("/");
var html = document.createElement('html');
html.innerHTML = '<head></head><body></body>'; //<link rel="shortcut icon" type="image/ico" href="'+ext_url+'media/favicon.ico">
document.appendChild(html);

add_script = function(url,id){
	var script = document.createElement('script');
	if(id){
		script.id = id;
		script.charset = 'utf-8';
		script.setAttribute('data-ext-url',ext_url );
		script.setAttribute('data-ext-id',chrome.runtime.id);
	}
	script.src = url;
	document.head.appendChild(script);
}
//adding extension script and closing the doc
add_script(ext_url+"script.js","gz_script");
document.close();