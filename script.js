const ꕥ = {};
ꕥ.ext_url = document.getElementById('gz_script').getAttribute('data-ext-url');
ꕥ.icq = {contacts:{},chats:{}};//,files:{}

ꕥ.store_json = function(){
	try{
		localStorage.setItem('ꕥICQbackup2024', JSON.stringify(ꕥ.icq));
	} catch {
		console.debug('failed to store json, too big?');
	}
}

ꕥ.restore_json = function(){
	let icq = null;
	try{
		icq = JSON.parse(localStorage.getItem('ꕥICQbackup2024'))
	} catch {
		console.debug('failed to load stored json');
	}
	if(!!icq && icq.contacts && icq.chats){
		ꕥ.icq = icq;
	}
}

ꕥ.json_download = function(json,filename){
	//generating file
	if(!json)return;
	if(!filename)filename = 'ICQbackup2024';
	blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
	var a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = filename +".json";
	a.click();
}

ꕥ.restore_json();

ꕥ.css = `
@charset "utf-8";
.gzMenu,
.gzHistoryDump{
	position: fixed; right: 0px; z-index: 3000;
	box-sizing: border-box; max-width: 36%;
}

.gzMenu{
	top:0px;
	color:rgba(var(--theme-color-text_solid));
	height:56px; width: 360px; padding: 19px;
	border: solid 1px rgba(var(--theme-color-base_bright));border-right:none;border-top:none;
}

.gzHistoryDump{
	background-color: rgba(var(--theme-color-chat_environment));
	zoom: 0.5;
	width:720px; padding:0px; margin:0px; overflow-y:auto;
	top:112px; bottom:0px;
	border:none; border-left:solid 2px rgba(var(--theme-color-base_globalwhite));
}

.gzHistoryDump::-webkit-scrollbar{
	width:24px !important;
}

.gzSave .gzHistoryDump::-webkit-scrollbar{
	width:14px !important;
}

*::-webkit-scrollbar {	all:initial !important; width:15px !important; background:rgba(var(--theme-color-chat_environment)) !important;	}
*::-webkit-scrollbar-button { all: initial !important; }
*::-webkit-scrollbar-track { all: initial !important; }
*::-webkit-scrollbar-track-piece { all: initial !important; }
*::-webkit-scrollbar-corner { all: initial !important; }
*::-webkit-resizer { all: initial !important; }
*::-webkit-scrollbar-thumb {	all:initial !important; background:rgba(var(--theme-color-ghost_secondary_inverse)) !important; border:solid 1px rgba(var(--theme-color-base_bright_inverse)) !important;	}
*::-webkit-scrollbar-button{	display:none !important;	}

.im-scrollbars__horisontal-track,
.im-scrollbars__vertical-track,
.im-scrollbar
{
	display:none !important;
}

.im-scrollbar__source{	scrollbar-width:auto !important;	}
.im-scrollbars__view{	margin:0 !important; overflow:auto !important;	}

#root{
	position:fixed; right:360px; left:0; top:0; bottom:0;
}

#root.gzSave{
	right:0;
}


#root.gzSave #gz_dump{
	top:56px; left:280px; right:0px; width:auto; max-width:none;
    zoom:1;
}

#root.gzSave.im-layout-infopanel #gz_dump,
#root.gzSave.im-layout-infopanel .gzMenu
{
	right: 330px;
}

#root.gzSave #gz_dump::before{
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
    right:0px; z-index:3001;
	width:auto; min-width:140px; max-width:none; max-height:100%; padding:0px;
    border-left: none;
    display:flex; align-items:center; justify-content:right;
}

#root.gzSave #rightPane,
#root.gzSave #gz_dump,
#root.gzSave .gzMenu{
	left:0;
}

`;


ꕥ.html = `
<div class="gzHistoryDump" id="gz_dump"></div>
<div class="gzMenu">
	<div class="gzPreview">
		<button id="gz_save_btn" onclick="ꕥ.save_html()">*.mhtml <m>0</m></button>
		<button id="gz_json_chat_btn" onclick="ꕥ.save_json_chat()">*.json, этот чат <c>0</c> <m>0</m></button>
		<button id="gz_json_all_btn" onclick="ꕥ.save_json_all()">*.json, все чаты   <c>0</c> <m>0</m></button>
		<button id="gz_files_btn" onclick=""> </button>
		<button id="gz_auto_scroll_btn" onclick="ꕥ.auto_scroll" title="В конце будет подан звуковой сигнал.">Собрать историю (автопрокрутка).</button>
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
				<li>(Примечание: возможно вы захотите включить панель <i>Информация</i> чтобы сохранить вид профиля собеседника вместе с перепиской)</li>
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

ꕥ.auto_scroll = function(){
	let viewport = document.querySelector('.im-history');
	let delay = 500;
/*	viewport.scrollBy(0,-2*viewport.clientHeight); //step back in case it fails
	window.setTimeout(function(){
		viewport.scrollTo(0,viewport.scrollHeight);
	},parseInt(Math.random()*250)+250);
	window.setTimeout(ꕥ.auto_scroll, delay);*/

}

ꕥ.fix_dump = function(){
	//fix dates
	ꕥ.dump.parentNode.querySelectorAll('#gz_dump >.im-messages__date span').forEach(function(dat) {
		let date_txt = dat.textContent.trim();
		if(date_txt.toLowerCase() == 'сегодня'){
			dat.textContent = new Date().toLocaleString("ru", {year: 'numeric',month: 'long',day: 'numeric'}).replace(' г.','');
		} else {
			if(isNaN(date_txt[date_txt.length-1])){
				dat.textContent = date_txt +' '+new Date().getFullYear();
			}
		}
		dat.parentNode.removeAttribute('style');
	});

	//remove excess ui
	ꕥ.dump.querySelectorAll('.im-quick-menu-wrapper').forEach(function(node) {
		node.remove();
	});
}

ꕥ.scrap_chat = function(){
	let chat = document.querySelector('.imMessagesBlock');
	if(!!chat && !!ꕥ.dump){
		let msgs = chat.childNodes;
		for(let i = msgs.length-1; i>-1;i--) {

			let arch_id = msgs[i].getAttribute('data-arch-id');
			let next_id = msgs[i].getAttribute('data-next-id');
			
			let id = false;
			let type = false;
			if(!!arch_id){
				type = 'arch'; id = arch_id;
			}
			if(!!next_id){
				type = 'next'; id = next_id;
			}
			if(!!id){
				let node = ꕥ.dump.parentNode.querySelector('#gz_dump>*[data-'+type+'-id="'+id+'"]');
				if(!node){
					if('arch' == type){
						ꕥ.dump.prepend(msgs[i].cloneNode(true));
					} else {
						node = ꕥ.dump.parentNode.querySelector('#gz_dump>*[data-arch-id="'+id+'"]');
						ꕥ.dump.insertBefore(msgs[i].cloneNode(true), node);
					}
				} else {
					if('arch' == type){
						node.replaceWith(msgs[i].cloneNode(true));
					}
				}
			}
		}
		let class_list = document.getElementById('mainPagesContReact').classList;
		if(!class_list.contains("gzWarned") && ꕥ.dump.childNodes.length >99){
			class_list.add("gzBeware");
		}
		ꕥ.fix_dump();
		ꕥ.refresh_stats();
	}
}

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


ꕥ.get_total_all_contacts = function(){
	return Object.keys(ꕥ.icq.contacts).length;
}
ꕥ.get_total_chat_contacts = function(chat){
	if(chat && chat.persons){
		return Object.keys(chat.persons).length;
	} else {
		return 1;
	}
}
ꕥ.get_total_chat_messages = function(chat){
	if(chat && chat.messages){
		return Object.keys(chat.messages).length;
	} else {
		return 0;
	}
}
ꕥ.get_total_all_messages = function(){
	var total = 0;
	Object.keys(ꕥ.icq.chats).forEach(function(sn){
		total += ꕥ.get_total_chat_messages(ꕥ.icq.chats[sn]);
	});
	return total;
}

ꕥ.refresh_stats = function(){
	ꕥ.btn_mhtml_m.textContent = ꕥ.dump.querySelectorAll('.im-message').length;
	ꕥ.btn_json_chat_m.textContent = ꕥ.get_total_chat_messages(ꕥ.icq.chats[ꕥ.current_sn]);
	ꕥ.btn_json_chat_c.textContent = ꕥ.get_total_chat_contacts(ꕥ.icq.chats[ꕥ.current_sn]);
	ꕥ.btn_json_all_m.textContent = ꕥ.get_total_all_messages();
	ꕥ.btn_json_all_c.textContent = ꕥ.get_total_all_contacts();
}

ꕥ.save_html = function(){
	ꕥ.scrap_chat();
	let root = document.getElementById("root");
	root.classList.add("gzSave");
}
ꕥ.save_json_chat = function(){
	ꕥ.owner = ꕥ.module_13.a.ACTIVE_MAIL;
	let branch = {contacts:{}};
	branch.chat = ꕥ.icq.chats[ꕥ.current_sn] || {};
	if(!branch.chat.persons){
		branch.contacts[ꕥ.current_sn] = ꕥ.icq.contacts[ꕥ.current_sn];
	} else {
		Object.keys(branch.chat.persons).forEach(function(sn){
			branch.contacts[sn] = ꕥ.icq.contacts[sn];
		});
	}
	let filename = 'ICQ #'+ꕥ.owner+' чат с '+document.title+' контактов['+ꕥ.get_total_chat_contacts(branch.chat)+'] сообщений['+ꕥ.get_total_chat_messages(branch.chat)+']';
	console.debug(filename);
	ꕥ.json_download(branch,filename);
}
ꕥ.save_json_all = function(){
	ꕥ.owner = ꕥ.module_13.a.ACTIVE_MAIL;
	let filename = 'ICQ #'+ꕥ.owner+' контактов['+ꕥ.get_total_all_contacts()+'] сообщений['+ꕥ.get_total_all_messages()+']';
	console.debug(filename);
	ꕥ.json_download(ꕥ.icq,filename);
}

ꕥ.close_save = function(){
	let root = document.getElementById("root");
	root.classList.remove("gzSave");
}

ꕥ.current_sn = 0;

ꕥ.change_title = function(sn){
	let person = ꕥ.icq.contacts[sn];
	if(person && sn == ꕥ.current_sn){
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

ꕥ.update_contact = function(info){
	info = ꕥ.copy(info);
	let sn = info.sn;
	
	if( ꕥ.defined(info.uNick) || !ꕥ.defined(info.nick)){
		info.nick = info.uNick;
		delete info.uNick;
	}
	if( ꕥ.defined(info.firstname) || !ꕥ.defined(info.firstName) ){
		info.firstName = info.firstname;
		delete info.firstname;
	}
	if( ꕥ.defined(info.lastname) || !ꕥ.defined(info.lastName) ){
		info.lastName = info.lastname;
		delete info.lastname;
	}
	
	if(!ꕥ.icq.contacts[sn]){
		ꕥ.icq.contacts[sn] = {sn:sn};
	}
	let contact = ꕥ.icq.contacts[sn];
	Object.keys(info).forEach(function(key){
		if( ꕥ.defined(info[key]) && info[key]!="[deleted]"){
			contact[key] = info[key];
		}
		if( !ꕥ.defined(contact[key]) ){
			contact[key] = undefined;
		}
	});
}

ꕥ.defined = function(smth){
	return typeof(smth)!== 'undefined'
}

ꕥ.copy  = function(obj){
	if(typeof(obj) == 'object'){
		return JSON.parse(JSON.stringify(obj))
	} else {
		return obj;
	}
}

ꕥ.process_contact_info = function(info){
	info = ꕥ.copy(info);
	info.sn = info.email;
	delete info.email;
	if( ꕥ.defined(info.nickname)){
		if(!ꕥ.defined(info.friendly)){
			info.friendly = info.nickname;
		}
		delete info.nickname;
	}

	ꕥ.update_contact(info);
	//console.debug(info);
}

ꕥ.process_persons = function(json){
	var sn = ꕥ.current_sn; //json.requestParams.sn;
	for(let p=0; p<json.persons.length; p++){
		if(json.persons[p].sn == sn){
			ꕥ.update_contact(json.persons[p]);
			ꕥ.change_title(sn);
		}
	}
	//console.debug(json);
}

ꕥ.dump_the_dump = function(){
	if(!!ꕥ.dump){
		ꕥ.dump.innerHTML = '';
	}
}

ꕥ.process_xhr = function(json){
	//console.debug(json.lastMsgId || json.lastMessageId,json);
}


ꕥ.owner = 'outgoing';
ꕥ.process_msgs = function(json){
	ꕥ.owner = ꕥ.module_13.a.ACTIVE_MAIL;
	//console.debug(json);
	if(!!json.requestParams && !!json.requestParams.sn){
		var sn = json.requestParams.sn;
		if( !ꕥ.defined(ꕥ.icq.chats[sn]) ){
			ꕥ.icq.chats[sn] = {messages:{}}
		}
		var chat = ꕥ.icq.chats[sn];
		//add chat params to object
		Object.keys(json).forEach(function(key){
			if(key!='messages' && key!='persons' && key!='requestParams' && key!='responseParams' && key!='historyCurrentPack'){
				if( ꕥ.defined(json[key]) || !ꕥ.defined(chat[key])){ // adds new value or new key
					chat[key] = json[key];
				}
			}
		});
		if(!chat.persons){
			chat.persons = {}
		}
		if(!!json.persons){
			for(let p=0; p<json.persons.length; p++){
				if(json.persons[p].sn == sn){
					ꕥ.update_contact(json.persons[p]);
					ꕥ.change_title(sn);
				}
				chat.persons[json.persons[p].sn] = json.persons[p];
			}
		}
		if(!!json.messages){
			if(!chat.messages){
				chat.messages = {};
			}
			for(let m=0;m<json.messages.length; m++){
				let json_msg = json.messages[m];
				if(!chat.messages[json_msg.msgId]){
					chat.messages[json_msg.msgId] = {};
				}
				let chat_msg = chat.messages[json_msg.msgId];
				
				chat_msg.time = json_msg.time;
				chat_msg.from = json_msg.from;
				if(!chat_msg.from){
					if(!!json_msg.outgoing){
						chat_msg.from = ꕥ.owner;
					} else {
						chat_msg.from = sn;
					}
				}

				Object.keys(json_msg).forEach(function(k){
					if(k!='msgId' && k!='reqId' && k!='outgoing' && k!='updatePatchVersion'){
						chat_msg[k] = json_msg[k];
					}
				});

			}
		}
		ꕥ.refresh_stats();
	}
}


ꕥ.switch_chat = function(data){
	ꕥ.current_sn = data.mail;
	ꕥ.change_title(ꕥ.current_sn);
	ꕥ.dump_the_dump();
	ꕥ.store_json();
	ꕥ.refresh_stats();
	document.getElementById('mainPagesContReact').classList.remove("gzWarned");
}


//getDownloadGDPRDataLink
//checkGDPRData

//lastseen: 1559560271
//var Chat = function() {
//var InfoPanel = function() {
//localStorage _AIM_clist_list
//_AIM_dialogs_data

//return this.updateViewWithFixPosition(updatingFunction)
//function _isScrolledToHistoryEnd()
//function checkLastVisibleMessage() {

//monkey patch and reinject the script and everything
ꕥ.fetch_text(location.href,function(html){
	html = html.replace(/\<link\ rel=(icon|apple-touch-icon)[^>]+\>/gm,'');
	html = html.replace('</head>','<link rel="shortcut icon" type="image/ico" href="data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAgAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3cAAAAAAAAAAAAAAAAACAAANwAAAAAAAAAAAAAAAAACIABwB4cAAAAAAAAAAAgAKqoghwAAgAAAAAAAAAAIAqqqoAACIAcAAAAAAAAAAwqqqqAAKqIIAAAAAAAAAAgCqqqgAKqiCAAAAAAAAAAIAKqqoAKqogiDOHAAAAAIiAAqqqACqqAAAAAIAAAHAAAAAqqgAqogACKiAHAAAAGZEAAqIAqiAAKqqiAwAAAJmZEAAiACIAAqqqqgAAAACZmZkAAAAAAiqqqqoAAABwCZmZkAu7MAqqqqqiAwAACAABGRC7u7ACIqqqIAcABwAAAAAAu7uzAAAAAACAAHAAIiAAALu7swAAAAAIAACAKqqqoiA7u7ACIiAAAwAAMCqqqqogADMAAqqqogAwAIAqqqqiAAAAAgACqqogBwCACqqqIAAiACogACqqoggAAAAiIAACogAqogACKiAHAAAwAAAAKqIAKqoAAAAAMAAAB4iDACqgAKqqIAAzOAAAAAAAAAKqoACqqqIAAAAAAAAAAHAqqiAAqqqqAAAAAAAAAABwKqogAKqqqgAAAAAAAAAAcAqiAAAqqqIAAAAAAAAAAAMCIAdwAqogCAAAAAAAAAAHAACACAAAAIAAAAAAAAAAAAdwAABzAAgAAAAAD//////+P///+A////AGP//gAB//4AAP/+AAD//gAA//4AAAf4AAAD4AAAAeAAAAHgAAAB4AAAAeAAAAHwAAABwAAAA4AAAAeAAAAHgAAAA4AAAAGAAAABwAAAAeAAAAPwAAAH/wAAf/4AAH/+AAB//gAAf/8AAH//AwD//8+B/w==">'+'</head>'); //'+ꕥ.ext_url+'media/favicon.ico
	//console.debug(html);
	document.documentElement.innerHTML = html;
	jsrc = document.querySelector('script[src*="r/webim."]').src;
	ꕥ.fetch_text(jsrc,function(jscript){
		let patch_1 = 'reader.onload=function(event){img.src=event.target.result';
		let patch_2 = 'function _resetMessageBlocks(){';
		let patch_3 = '{this.messageOutDom(obj.node);';
		let patch_4 = 'cb.call(this,fullCode,resultData)';
		let patch_5 = 'function loadChat(pageObject,data){';
		let patch_6 = 'function checkLastVisibleMessage(){';
		let patch_7 = 'var userInfo=fetchUserInfo(reqParams.sn,data);';
		let patch_8 = '}else{delayedUpdate.stop();';
		let patch_9 = 'var _modules_app_AppState__WEBPACK_IMPORTED_MODULE_13__=';
		let patch_10 = 'if(data){this.destroy();this._initCache(data)}';
		let patch_11 = 'var RELOAD_HISTORY_ON_REFRESH=false;var STORAGED_HISTORY_LIMIT=3*HISTORY_PART_VOLUME;';
		let patch_12 = 'dlgToSave.history=[dlg.history[dlg.history.length-1].slice(-historyLimit)];';
		let patch_13 = 'return this.send(rapi.methods.getHistory,params,cb,scope)';
		let patch_14 = 'function(resultValue){var resultCode=resultValue.resultCode,data=resultValue.data;';
		ꕥ.add_style_txt(ꕥ.css);
		jscript = jscript
			.replace('scriptUrl=document.currentScript.src;','scriptUrl="'+jsrc+'";') //"fix automatic publicPath error"
			.replace(patch_1,patch_1+'.replace("data:application/octet-stream;base64,","data:image;base64,")') //fix avatars
			.replace(patch_2,patch_2+'ꕥ.scrap_chat();') //clone messages before unload
			.replace(patch_3,patch_3+'ꕥ.scrap_chat();') //clone messages before unload
				//.replace(patch_4,'ꕥ.process_xhr(resultData);'+patch_4) //all xhrs
			.replace(patch_5,patch_5 + 'ꕥ.switch_chat(data);')	//clear dump
			.replace(patch_6,patch_6 + 'ꕥ.scrap_chat();')	//clone messages after load
			.replace(patch_7,patch_7 + 'ꕥ.process_contact_info(userInfo);')	//get user data
			.replace(patch_9,patch_9 + 'ꕥ.module_13=')	//expose webpack module
			.replace(patch_10,'if(!!data && !!data.dialogs){for(let d=0;d<data.dialogs.length;d++){data.dialogs[d].history = []}};'+patch_10)	//stop loading cached crap 0
			.replace(patch_12,'dlgToSave.history=[];')	//stop loading cached crap 1 
				//.replace(patch_11,'var RELOAD_HISTORY_ON_REFRESH=true;var STORAGED_HISTORY_LIMIT=1;')	//stop loading cached crap 2
			.replace(patch_13,'let cbwas = cb; cb = function(code,reqId,fullCode,resultData){ꕥ.process_msgs(resultData);cbwas(code,reqId,fullCode);};'+patch_13)	//stop loading cached crap 3
			.replace(patch_14,patch_14+'ꕥ.process_persons(data);')	//additional user data
			.replace('document.title=tmpTitle','')	//stop ruining title
		;
		ꕥ.add_script_txt(jscript);
		//console.debug(jscript);
		ꕥ.add_style_link(ꕥ.ext_url + 'dialogue.css');
		ꕥ.dump = document.getElementById('gz_dump');
		if(!ꕥ.dump){
			let root = document.getElementById('root');
			root.innerHTML += ꕥ.html;
			root.addEventListener('click', function (e) {
				let class_list = e.target.classList;
				if ('mainPagesContReact' == e.target.id && !class_list.contains("gzWarned")) {
					class_list.remove("gzBeware");
					class_list.add("gzWarned");
				}
			}, false);
			ꕥ.btn_mhtml = document.getElementById('gz_save_btn');
			ꕥ.btn_json_chat = document.getElementById('gz_json_chat_btn');
			ꕥ.btn_json_all = document.getElementById('gz_json_all_btn');
			ꕥ.btn_mhtml_m = ꕥ.btn_mhtml.querySelector('m');
			ꕥ.btn_json_chat_m = ꕥ.btn_json_chat.querySelector('m');
			ꕥ.btn_json_chat_c = ꕥ.btn_json_chat.querySelector('c');
			ꕥ.btn_json_all_m = ꕥ.btn_json_all.querySelector('m');
			ꕥ.btn_json_all_c = ꕥ.btn_json_all.querySelector('c');
			ꕥ.dump = document.getElementById('gz_dump');
		}

		
	});
});

