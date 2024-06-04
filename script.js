const ꕥ = {};
ꕥ.ext_url = document.getElementById('gz_script').getAttribute('data-ext-url');

ꕥ.css = `
.gzMenu,
.gzHistoryDump{
	right: 0px;
	position: fixed;
	z-index: 3000;
	border-left: solid 1px #eceef3;
	box-sizing: border-box;
}

.gzMenu{
	background-color:rgba(var(--theme-color-base_globalwhite));
	border-bottom: solid 1px #eceef3;
	top:0px;
	height:56px;
	padding: 19px;
	width: 360px;
}


.gzHistoryDump{
	background-color: rgba(var(--theme-color-chat_environment));
	zoom: 0.5;
	padding:0px;
	margin:0px;
	height: 100%;
	width: 720px;
	top: 112px;
	bottom:0px;
	overflow-y: auto;
	border-left-width:2px;
}

.gzHistoryDump::-webkit-scrollbar{
	width: 24px !important;
}

.gzSave .gzHistoryDump {
	top:56px;
}


.gzSave .gzHistoryDump::-webkit-scrollbar{
	width: 14px !important;
}


*::-webkit-scrollbar {
    all: initial !important;
    width: 15px !important;
    background: #f1f1f1 !important;
}

*::-webkit-scrollbar-button { all: initial !important; }
*::-webkit-scrollbar-track { all: initial !important; }
*::-webkit-scrollbar-track-piece { all: initial !important; }
*::-webkit-scrollbar-corner { all: initial !important; }
*::-webkit-resizer { all: initial !important; }


*::-webkit-scrollbar-thumb {
    all: initial !important;
    background: #c1c1c1 !important;
	border: solid 1px #c1c1c1 !important;
}

*::-webkit-scrollbar-button{
	display:none !important;
}

.im-scrollbars__horisontal-track,
.im-scrollbars__vertical-track,
.im-scrollbar
{
	display:none !important;
}

.im-scrollbar__source{
	scrollbar-width:auto !important;
}
.im-scrollbars__view{
	margin:0 !important;
    overflow:auto !important;
}

#root{
	position: fixed;
    right: 360px;
    left: 0;
    top: 0;
    bottom: 0;
}
`;

ꕥ.patchResetMessageBlocks = `
	var gz_history_dump = ꕥ.gz_history_dump;
	var gz_msgs = this.messagesBlock.dom.childNodes;
	if(!!gz_msgs && !!gz_history_dump){
		for(let gz_n = gz_msgs.length-1; gz_n>-1;gz_n--) {

			let gz_arch_id = gz_msgs[gz_n].getAttribute('data-arch-id');
			let gz_next_id = gz_msgs[gz_n].getAttribute('data-next-id');
			let gz_file_id = gz_msgs[gz_n].getAttribute('data-file-id');
			if(!!gz_arch_id){
				if(!gz_history_dump.parentNode.querySelector('#gz_history_dump>*[data-arch-id="'+gz_arch_id+'"]')){
					gz_history_dump.prepend(gz_msgs[gz_n].cloneNode(true));
				}
			}
			if(!!gz_next_id){
				if(!gz_history_dump.parentNode.querySelector('#gz_history_dump>*[data-next-id="'+gz_next_id+'"]')){
					gz_history_dump.prepend(gz_msgs[gz_n].cloneNode(true));
				}
			}
			if(!!gz_file_id){
				if(!gz_history_dump.parentNode.querySelector('#gz_history_dump>*[data-file-id="'+gz_file_id+'"]')){
					gz_history_dump.prepend(gz_msgs[gz_n].cloneNode(true));
				}
			}
		
		}
	}
`;

ꕥ.patchStepUpAndDown = `
	if(!!ꕥ.gz_history_dump){
		let gz_arch_id = obj.node.getAttribute('data-arch-id');
		let gz_next_id = obj.node.getAttribute('data-next-id');
		let gz_file_id = obj.node.getAttribute('data-file-id');
		if(!!gz_arch_id){
			if(!gz_history_dump.parentNode.querySelector('#gz_history_dump>*[data-arch-id="'+gz_arch_id+'"]')){
				gz_history_dump.prepend(obj.node.cloneNode(true));
			}
		}
		if(!!gz_next_id){
			if(!gz_history_dump.parentNode.querySelector('#gz_history_dump>*[data-next-id="'+gz_next_id+'"]')){
				gz_history_dump.prepend(obj.node.cloneNode(true));
			}
		}
		if(!!gz_file_id){
			if(!gz_history_dump.parentNode.querySelector('#gz_history_dump>*[data-file-id="'+gz_file_id+'"]')){
				gz_history_dump.prepend(obj.node.cloneNode(true));
			}
		}
	}
`;



ꕥ.fetch_text = function(uri,callback){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', uri);
	xhr.onload = function() {
		if (xhr.status === 200) {
			callback(xhr.responseText);
		}
		else {
			console.log("FAAAAAILED "+xhr.responseText);
		}
	}
	xhr.send();
}

ꕥ.add_script_txt = function(txt){
	let head = document.querySelector('head');
	if(head){
		let script = document.createElement("script");
		script.text = txt;
		head.appendChild(script);
	}
}

ꕥ.add_style_txt = function(txt){
	let head = document.querySelector('head');
	if(head){
		let style = document.createElement('style');
		style.innerHTML = txt;
		head.appendChild(style);
	}
}

//monkey patch and reinject the script and everything
ꕥ.fetch_text(location.href,function(html){
	html = html.replace(/\<link\ rel=(icon|apple-touch-icon)[^>]+\>/gm,'');
	html = html.replace('</head>','<link rel="shortcut icon" type="image/ico" href="data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAgAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3cAAAAAAAAAAAAAAAAACAAANwAAAAAAAAAAAAAAAAACIABwB4cAAAAAAAAAAAgAKqoghwAAgAAAAAAAAAAIAqqqoAACIAcAAAAAAAAAAwqqqqAAKqIIAAAAAAAAAAgCqqqgAKqiCAAAAAAAAAAIAKqqoAKqogiDOHAAAAAIiAAqqqACqqAAAAAIAAAHAAAAAqqgAqogACKiAHAAAAGZEAAqIAqiAAKqqiAwAAAJmZEAAiACIAAqqqqgAAAACZmZkAAAAAAiqqqqoAAABwCZmZkAu7MAqqqqqiAwAACAABGRC7u7ACIqqqIAcABwAAAAAAu7uzAAAAAACAAHAAIiAAALu7swAAAAAIAACAKqqqoiA7u7ACIiAAAwAAMCqqqqogADMAAqqqogAwAIAqqqqiAAAAAgACqqogBwCACqqqIAAiACogACqqoggAAAAiIAACogAqogACKiAHAAAwAAAAKqIAKqoAAAAAMAAAB4iDACqgAKqqIAAzOAAAAAAAAAKqoACqqqIAAAAAAAAAAHAqqiAAqqqqAAAAAAAAAABwKqogAKqqqgAAAAAAAAAAcAqiAAAqqqIAAAAAAAAAAAMCIAdwAqogCAAAAAAAAAAHAACACAAAAIAAAAAAAAAAAAdwAABzAAgAAAAAD//////+P///+A////AGP//gAB//4AAP/+AAD//gAA//4AAAf4AAAD4AAAAeAAAAHgAAAB4AAAAeAAAAHwAAABwAAAA4AAAAeAAAAHgAAAA4AAAAGAAAABwAAAAeAAAAPwAAAH/wAAf/4AAH/+AAB//gAAf/8AAH//AwD//8+B/w==">'+'</head>'); //'+ꕥ.ext_url+'media/favicon.ico
	//console.debug(html);
	document.documentElement.innerHTML = html + '<div class="gzMenu"><span>История чата (предпросмотр)</span> <br></div><div class="gzHistoryDump gzPreview" id="gz_history_dump"></div>';
	ꕥ.gz_history_dump = document.getElementById('gz_history_dump');
	jsrc = document.querySelector('script[src*="r/webim."]').src;
	ꕥ.fetch_text(jsrc,function(jscript){
		ꕥ.add_style_txt(ꕥ.css);
		ꕥ.add_script_txt(
			jscript
			.replace('scriptUrl=document.currentScript.src;','scriptUrl="'+jsrc+'";') //"fix automatic publicPath error"
			.replace('function _resetMessageBlocks(){','function _resetMessageBlocks(){'+ꕥ.patchResetMessageBlocks)
			.replace('{this.messageOutDom(obj.node);','{this.messageOutDom(obj.node);'+ꕥ.patchStepUpAndDown)
		);
	});
});

/*
//
.im-quick-menu-wrapper			like	to delete

document.querySelectorAll('#gz_history_dump >.im-messages__date').forEach(function(node) {
	let style = node.getAttribute('style');
	if(!!style && style.indexOf('visibility')>-1){
		node.removeAttribute('style');
	}
});
*/