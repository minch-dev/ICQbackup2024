const ꕥ = {};
ꕥ.ext_url = document.getElementById('gz_script').getAttribute('data-ext-url');

ꕥ.css = `
.gzMenu,
.gzHistoryDump{
	right: 0px;
	position: fixed;
	z-index: 3000;
	border: solid 1px rgba(var(--theme-color-base_bright));
	border-right:none;
	border-top:none;
	box-sizing: border-box;
	max-width: 36%;
}

.gzMenu{
	color:rgba(var(--theme-color-text_solid));
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
	width: 720px;
	top: 112px;
	bottom:0px;
	overflow-y: auto;
	border-left-width:2px;
}

.gzHistoryDump::-webkit-scrollbar{
	width: 24px !important;
}


.gzSave .gzHistoryDump::-webkit-scrollbar{
	width: 14px !important;
}


*::-webkit-scrollbar {
    all: initial !important;
    width: 15px !important;
    background:rgba(var(--theme-color-chat_environment))  !important;
}

*::-webkit-scrollbar-button { all: initial !important; }
*::-webkit-scrollbar-track { all: initial !important; }
*::-webkit-scrollbar-track-piece { all: initial !important; }
*::-webkit-scrollbar-corner { all: initial !important; }
*::-webkit-resizer { all: initial !important; }


*::-webkit-scrollbar-thumb {
    all: initial !important;
    background: rgba(var(--theme-color-ghost_secondary_inverse)) !important;
	border: solid 1px rgba(var(--theme-color-base_bright_inverse)) !important;
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

#root.gzSave{
	right:0;
}

.gzMenu .gzPreview::before{
    content: "Собранная история чата (предпросмотр)";
    position: absolute;
    top: 100%;
    left: 0;
    margin: 6px 60px;
    white-space: nowrap;
    padding: 5px;
    border-radius: 10px;
    text-align: center;
    font-size: 0.75em;
    background: rgba(var(--theme-color-chat_environment));
}


#root.gzSave #gz_history_dump{
	top: 56px;
    zoom: 1;
    left: 280px;
    width: auto;
    right: 0px;
    max-width: none;
}

#root.gzSave.im-layout-infopanel #gz_history_dump,
#root.gzSave.im-layout-infopanel .gzMenu
{
	right: 330px;
}

#root.gzSave #gz_history_dump::before{
	content:"";
	display:none;
}

#root .gzMenu .gzSave{
	display:none;
}

#root .gzMenu .gzThanks{
	display:none;
}

#root.gzSave .gzPreview{
	display:none;
}

#root.gzSave .gzMenu .gzThanks{
	display:block;
	padding-right:16px;
    width: 190px;
    text-align: right;
	background:rgba(var(--theme-color-base_globalwhite));
}


.gzMenu .gzSave button,
.gzMenu .gzThanks a
{
    color: rgba(var(--theme-color-text_primary));
    display: inline;
    padding: 0;
    border: 0;
    background: none;
    cursor: pointer;
    margin-right: 10px;
}

#root.gzSave .gzMenu{
    right:0px;
	width:auto;
	min-width:140px;
	max-width: none;
	padding: 0px;
	z-index: 3001;
    border-left: none;
    display: flex;
    align-items: center;
	justify-content: right;
	max-height: 100%;
}

#root.gzSave #rightPane,
#root.gzSave #gz_history_dump,
#root.gzSave .gzMenu{
	left:0;
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

ꕥ.add_style_link = function(href){
	let style = document.createElement('link');
	style.rel = "stylesheet";
	style.href = href;
	document.documentElement.appendChild(style);
}

ꕥ.save_html = function(){
	let root = document.getElementById("root");
	
	//fix last date
	let dates = ꕥ.gz_history_dump.querySelectorAll('*[data-next-id] span');
	if(dates.length){
		let last_date_txt = dates[dates.length-1].innerText.trim();
		if(isNaN(last_date_txt[last_date_txt.length-1])){
			dates[dates.length-1].innerText += ' '+new Date().getFullYear();
		}
	}
	
	//unhide all dates
	document.querySelectorAll('#gz_history_dump >.im-messages__date').forEach(function(node) {
			node.removeAttribute('style');
	});

	//remove excess ui
	ꕥ.gz_history_dump.querySelectorAll('.im-quick-menu-wrapper').forEach(function(node) {
		node.remove();
	});
		
	root.classList.add("gzSave");
}


ꕥ.close_save = function(){
	let root = document.getElementById("root");
	root.classList.remove("gzSave");
}

ꕥ.contacts = {};
ꕥ.current_sn = 0;

ꕥ.change_title = function(sn){
	let person = ꕥ.contacts[sn];
	if(sn == ꕥ.current_sn){
		let title = '#'+sn;
		if(!!person.firstName){
			title += ' '+person.firstName;
		}
		if(!!person.lastName){
			title += ' '+person.lastName;
		}
		if(!!person.friendly){
			title += ' ('+person.friendly+')';
		}
		document.title = title;
	}
}
ꕥ.update_contact = function(person){
	let sn = person.sn;
	if(!ꕥ.contacts[sn]){
		ꕥ.contacts[sn] = {sn:sn};
	}
	if(!!person.firstName){
		ꕥ.contacts[sn].firstName = person.firstName;
	}
	if(!!person.lastName){
		ꕥ.contacts[sn].lastName = person.lastName;
	}
	if(!!person.friendly){
		ꕥ.contacts[sn].friendly = person.friendly;
	}
}
ꕥ.dump_the_dump = function(){
	if(!!ꕥ.gz_history_dump){
		ꕥ.gz_history_dump.innerHTML = '';
	}
}


window.gz_process_json = function(json){
	console.debug(json.requestParams.sn,json);
	
	if(!!json.persons && !!json.requestParams && !!json.requestParams.sn){
		for(let p=0; p<json.persons.length; p++){
			if(json.persons[p].sn == json.requestParams.sn){
				ꕥ.update_contact(json.persons[p]);
				ꕥ.change_title(json.persons[p].sn);
				break;
			}
		}
	}
}
window.gz_switch_chat = function(data){
	console.debug('switching to:',data);
	ꕥ.update_contact({sn:data.mail});
	ꕥ.current_sn = data.mail;
	ꕥ.change_title(ꕥ.current_sn);
	ꕥ.dump_the_dump();
}

//this.unloadChat();

//monkey patch and reinject the script and everything
ꕥ.fetch_text(location.href,function(html){
	html = html.replace(/\<link\ rel=(icon|apple-touch-icon)[^>]+\>/gm,'');
	html = html.replace('</head>','<link rel="shortcut icon" type="image/ico" href="data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAgAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3cAAAAAAAAAAAAAAAAACAAANwAAAAAAAAAAAAAAAAACIABwB4cAAAAAAAAAAAgAKqoghwAAgAAAAAAAAAAIAqqqoAACIAcAAAAAAAAAAwqqqqAAKqIIAAAAAAAAAAgCqqqgAKqiCAAAAAAAAAAIAKqqoAKqogiDOHAAAAAIiAAqqqACqqAAAAAIAAAHAAAAAqqgAqogACKiAHAAAAGZEAAqIAqiAAKqqiAwAAAJmZEAAiACIAAqqqqgAAAACZmZkAAAAAAiqqqqoAAABwCZmZkAu7MAqqqqqiAwAACAABGRC7u7ACIqqqIAcABwAAAAAAu7uzAAAAAACAAHAAIiAAALu7swAAAAAIAACAKqqqoiA7u7ACIiAAAwAAMCqqqqogADMAAqqqogAwAIAqqqqiAAAAAgACqqogBwCACqqqIAAiACogACqqoggAAAAiIAACogAqogACKiAHAAAwAAAAKqIAKqoAAAAAMAAAB4iDACqgAKqqIAAzOAAAAAAAAAKqoACqqqIAAAAAAAAAAHAqqiAAqqqqAAAAAAAAAABwKqogAKqqqgAAAAAAAAAAcAqiAAAqqqIAAAAAAAAAAAMCIAdwAqogCAAAAAAAAAAHAACACAAAAIAAAAAAAAAAAAdwAABzAAgAAAAAD//////+P///+A////AGP//gAB//4AAP/+AAD//gAA//4AAAf4AAAD4AAAAeAAAAHgAAAB4AAAAeAAAAHwAAABwAAAA4AAAAeAAAAHgAAAA4AAAAGAAAABwAAAAeAAAAPwAAAH/wAAf/4AAH/+AAB//gAAf/8AAH//AwD//8+B/w==">'+'</head>'); //'+ꕥ.ext_url+'media/favicon.ico
	//console.debug(html);
	document.documentElement.innerHTML = html;
	jsrc = document.querySelector('script[src*="r/webim."]').src;
	ꕥ.fetch_text(jsrc,function(jscript){
		let replace_1 = 'reader.onload=function(event){img.src=event.target.result';
		let replace_2 = 'function _resetMessageBlocks(){';
		let replace_3 = '{this.messageOutDom(obj.node)';
		let replace_4 = 'cb.call(this,fullCode,resultData)';
		let replace_5 = 'function loadChat(pageObject,data){';
		ꕥ.add_style_txt(ꕥ.css);
		jscript = jscript
			.replace('scriptUrl=document.currentScript.src;','scriptUrl="'+jsrc+'";') //"fix automatic publicPath error"
			.replace(replace_1,replace_1+'.replace("data:application/octet-stream;base64,","data:image;base64,")') //fix avatars
			.replace(replace_2,replace_2+ꕥ.patchResetMessageBlocks)
			.replace(replace_3,replace_3+ꕥ.patchStepUpAndDown)
			.replace(replace_4,'window.gz_process_json(resultData);'+replace_4)
			.replace(replace_5,replace_5 + 'window.gz_switch_chat(data);')
			.replace('document.title=tmpTitle','')
		;
		ꕥ.add_script_txt(jscript);
		//console.debug(jscript);
		ꕥ.add_style_link(ꕥ.ext_url + 'dialogue.css');
		ꕥ.gz_history_dump = document.getElementById('gz_history_dump');
		if(!ꕥ.gz_history_dump){
			document.getElementById('root').innerHTML+=`
<div class="gzHistoryDump" id="gz_history_dump"></div>
<div class="gzMenu">
	<div class="gzPreview">
		<span>Сохранить:</span>
		<button id="gz_save_btn" onclick="ꕥ.save_html()">.mhtml</button>
		<!--button id="gz_json_btn" onclick="ꕥ.save_json()">.json</button-->
	</div>
	<div class="gzSave">
		<span title="Развернутое пояснение по клику на значок дополнения (цветок ICQ)">Страница готова к сохранению</span>
		<br>
		<button id="gz_haalp">
			Подробнее
			<ul>
				<li>Нажмите <i>⋮</i> в правом верхнем углу браузера</li>
				<li>Выберите <i>Сохранить и поделиться</i> ⇨ <i>Сохранить страницу как...</i></li>
				<li>В открывшемся окне в меню <i>Тип файла</i> выберите <i>Веб-страница, один файл (*.mhtml)</i> и нажмите <i>Сохранить</i></span></li>
				<li>(Примечание: возможно вы захотите включить панель <i>Информация</i> чтобы сохранить базовые данные о собеседнике с перепиской)</li>
				<dd>
					<a href="https://boosty.to/minch-dev/donate" target="_blank">Задонатить</a>  автору
				</dd>
			</ul>
		</button>
		<button id="gz_close_btn" onclick="ꕥ.close_save()">Отмена</button>
	</div>
	<div class="gzThanks">
		<span title="Сохранено с помощью расширения ICQbackup2024">ICQbackup2024<span> <br> <a href="https://github.com/minch-dev" title="Ссылка на Гитхаб">minch-dev</a>
	</div>
</div>
`;
			ꕥ.gz_history_dump = document.getElementById('gz_history_dump');
		}

		
	});
});

