//stopping document execution immediately (like stop(), but better)
document.open();

//adding basic structure to prevent original from loading
//also to change favicon :3
var bro = chrome || browser;
var ext_url = bro.runtime.getURL("/");
var html = document.createElement('html');
html.innerHTML = '<head></head><body></body>'; //<link rel="shortcut icon" type="image/ico" href="'+ext_url+'media/favicon.ico">
document.appendChild(html);

//adding extension script and closing the doc
var script = document.createElement('script');
script.setAttribute('data-ext-url',ext_url );
script.id = "gz_script";
script.src = ext_url+"script.js";
document.head.appendChild(script);
document.close();