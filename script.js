const ꕥ = {};
ꕥ.ext_url = document.getElementById('gz_script').getAttribute('data-ext-url');
ꕥ.ext_id = document.getElementById('gz_script').getAttribute('data-ext-id');
ꕥ.icq = {contacts:{},chats:{}};
ꕥ.icq_loading = true;
ꕥ.msg_counter = 0;
const ALERT_SND = new Audio(ꕥ.ext_url+"media/sndSrvMsg.wav");


ꕥ.message = function(action,object,callback){
	if(!action){
		return;
	}

	let request = {action:action,object:object};
	//console.debug(action,object,callback);
	chrome.runtime.sendMessage(ꕥ.ext_id,request,null,function(response){
		if (chrome.runtime.lastError) { //needed for chrome to shut up
			console.debug('establishing extension connections');
		} else {
			//console.debug(typeof callback);
			if(typeof callback === 'function'){
				callback(response);
			}
		}
	});
}

ꕥ.store_icq = function(){
	if(ꕥ.icq_loading){
		return;
	}
	let object = {};
	if(ꕥ.icq.contacts && Object.keys(ꕥ.icq.contacts).length>0){
		object.contacts = ꕥ.icq.contacts;
	}
	if(ꕥ.icq.chats && Object.keys(ꕥ.icq.chats).length>0){
		object.chats = ꕥ.icq.chats;
	}
	ꕥ.message('store',object);
}


window.addEventListener("beforeunload", function(event) {
	ꕥ.store_icq();
	//event.returnValue = true;
});
ꕥ.merge_icq = function(collected,stored){
	//console.debug(collected,stored);
	if (collected.contacts){
		if(!stored.contacts){
			stored.contacts = collected.contacts;
		} else {
			Object.keys(collected.contacts).forEach(function(sn){
				if(!stored.contacts[sn]){
						stored.contacts[sn] = collected.contacts[sn];
				} else {
					Object.keys(collected.contacts[sn]).forEach(function(key){
						if(!ꕥ.defined(stored.contacts[sn][key]) ){ // adds new value or new key
							stored.contacts[sn][key] = collected.contacts[sn][key];
						} else {
							if( ꕥ.defined(collected.contacts[sn][key]) && collected.contacts[sn][key]!='[deleted]'){
								stored.contacts[sn][key] = collected.contacts[sn][key];
							}
						}
					});
				}
			});
		}
	}

	if(collected.chats){
		if(!stored.chats){
			stored.chats = collected.chats;
		} else {
			Object.keys(collected.chats).forEach(function(sn){
				if(!stored.chats[sn]){
						stored.chats[sn] = collected.chats[sn];
				} else {
					Object.keys(collected.chats[sn]).forEach(function(key){
						if(key!='messages' && key!='files'){
							if( !ꕥ.defined(stored.chats[sn][key]) ||  ꕥ.defined(collected.chats[sn][key]) ){ // adds new value or new key
								stored.chats[sn][key] = collected.chats[sn][key];
							}
						}
					});
					if(!stored.chats[sn].messages){
						stored.chats[sn].messages = collected.chats[sn].messages;
					} else {
						Object.keys(collected.chats[sn].messages).forEach(function(msgId){
							stored.chats[sn].messages[msgId] = collected.chats[sn].messages[msgId];
						});
					}
					if(!stored.chats[sn].files){
						stored.chats[sn].files = collected.chats[sn].files;
					} else {
						Object.keys(collected.chats[sn].files).forEach(function(file_id){
							let file_collected = collected.chats[sn].files[file_id];
							let file_stored = stored.chats[sn].files[file_id];
							if(!file_stored){
								stored.chats[sn].files[file_id] = file_collected;
							} else {
								Object.keys(file_collected).forEach(function(key){
									file_stored[key] = file_collected[key];
								});
							}
						});
					}
					if(download_automatically()){ //if download is on
						Object.keys(collected.chats[sn].files).forEach(function(file_id){
							let file = stored.chats[sn].files[file_id];
							ꕥ.download_file({file:file, chat_sn:sn, save_path:'#'+sn+'/'+ꕥ.make_filename(file)});
						});
					}
				}
			});
		}
	}

	return stored;
}

ꕥ.remove_loading = function(){
	ꕥ.icq_loading = false;
	let loading = document.querySelector('.gzLoading');
	if(loading){
		loading.classList.remove('gzLoading');
	}
}

ꕥ.restore_icq = function(){
	//if ꕥ.icq has some data add that data
	ꕥ.message('retrieve',null,function(icq){
		ꕥ.icq = ꕥ.merge_icq(ꕥ.icq,icq);
		ꕥ.refresh_stats();
		ꕥ.remove_loading();
	});
}
ꕥ.restore_icq();
ꕥ.interval = null;
ꕥ.stop_auto_scroll = function(){
	clearInterval(ꕥ.interval)
	ꕥ.earliest_id = 0;
	ꕥ.earliest_same = 0;
	ꕥ.store_icq();
	document.getElementById('rightPane').classList.remove('gzScanning');
}
ꕥ.start_auto_scroll = function(){
	document.getElementById('rightPane').classList.add('gzScanning');
	ꕥ.interval = window.setInterval(ꕥ.auto_scroll, 1000);
}


ꕥ.earliest_id = 0;
ꕥ.earliest_same = 0;
ꕥ.auto_scroll = function(){
	let viewport = document.querySelector('.im-history');
	let earliest = document.querySelector('.imMessagesBlock >div[data-arch-id]');
	let new_earliest_id =  -1;
	if(earliest){
		new_earliest_id = earliest.getAttribute('data-arch-id');
	}
	if(ꕥ.earliest_id != new_earliest_id){
		ꕥ.earliest_same = 0;
	} else {
		ꕥ.earliest_same++;
	}
	ꕥ.earliest_id = new_earliest_id;
	if(ꕥ.earliest_same > 30){
		ꕥ.stop_auto_scroll();
		viewport.scrollTo(0,0);
		ALERT_SND.play();
		return;
	}
	viewport.scrollTo(0,100);
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
		if(!class_list.contains("gzWarned") && ꕥ.dump.childNodes.length >500){
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

ꕥ.html_download = function(html,filename){
	if(!html)return;
	if(!filename)filename = 'download';
	blob = new Blob([html], { type: 'txt/html' });
	var a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = filename +".html";
	a.click();
}

ꕥ.save_file_list = function(){
	ꕥ.html_download('<html><head><meta charset="utf8"></head><body>'+ꕥ.file_list.innerHTML+'</body></html>','#'+ꕥ.current_sn+' file list');
}

ꕥ.make_filename = function(file){
	let filename_string = '#'+file.sn +'; '+file.file_id+'; ';
	if(file.date_created){
		filename_string = (file.date_created.replaceAll(' ','_').replaceAll(':','-'))+'; '+ filename_string;
	}
	if((filename_string.length + file.file_name.length) >255){
		let dot = file.file_name.lastIndexOf('.');
		if(dot < 0){
			dot = file.file_name.length;
		}
		let file_ext = file.file_name.substr(dot);
		if(file_ext.length<7){
			filename_string += file.file_name.substr(0,255 -(filename_string.length + file_ext.length));
			filename_string += file_ext;
		} else {
			filename_string += file.file_name.substr(0,255 - filename_string.length);
		}
	} else {
		filename_string += file.file_name;
	}
	return filename_string;
}

ꕥ.render_file_list = function(){
	let root = document.getElementById("root");
	if(!!root && root.classList.contains("gzFiles") && !!ꕥ.current_sn && !!ꕥ.icq.chats[ꕥ.current_sn] && !!ꕥ.icq.chats[ꕥ.current_sn].files){
		let files = ꕥ.icq.chats[ꕥ.current_sn].files;
		ꕥ.file_list.innerHTML = '';
		let now = Date.now();
		Object.keys(files).forEach(function(file_id){
			let file = files[file_id];
			file.file_id = file_id; //hack to remove possible bug
			let i = document.createElement('i');
			let dlink_age = 0;
			if(!!file.dlink_timestamp){
				dlink_age = now - file.dlink_timestamp;
			}
			dlink_age = dlink_age/1000/60/60;
			 
			i.textContent = Math.floor(dlink_age)+'ч:'+Math.floor((dlink_age%1)*60)+'м ';
			ꕥ.file_list.appendChild(i);
			
			let a = document.createElement('a');
			a.textContent = ꕥ.make_filename(file);
			a.href = file.dlink || '#';
			a.target = '_blank';
			a.setAttribute('downloaded', file.download_state || 0);
			ꕥ.file_list.appendChild(a);
			ꕥ.file_list.appendChild(document.createElement('br'));
		});
	}
}

ꕥ.get_total_chat_contacts = function(sn){
	chat = ꕥ.icq.chats[sn];
	if(chat && chat.persons){
		return Object.keys(chat.persons).length;
	} else {
		return 1;
	}
}
ꕥ.get_total_chat_messages = function(sn){
	chat = ꕥ.icq.chats[sn];
	if(chat && chat.messages){
		return Object.keys(chat.messages).length;
	} else {
		return 0;
	}
}
ꕥ.get_total_chat_files = function(sn){
	chat = ꕥ.icq.chats[sn];
	if(chat && chat.files){
		return Object.keys(chat.files).length;
	} else {
		return 0;
	}
}
ꕥ.get_total_all_contacts = function(){
	return Object.keys(ꕥ.icq.contacts).length;
}
ꕥ.get_total_all_messages = function(){
	var total = 0;
	Object.keys(ꕥ.icq.chats).forEach(function(sn){
		total += ꕥ.get_total_chat_messages(sn);
	});
	return total;
}

ꕥ.refresh_stats = function(){
	if(!!document && !!ꕥ.dump){
		ꕥ.btn_mhtml_m.textContent = ꕥ.dump.querySelectorAll('.im-message').length;
		ꕥ.btn_json_chat_m.textContent = ꕥ.get_total_chat_messages(ꕥ.current_sn);
		ꕥ.btn_json_chat_c.textContent = ꕥ.get_total_chat_contacts(ꕥ.current_sn);
		ꕥ.btn_json_all_m.textContent = ꕥ.get_total_all_messages();
		ꕥ.btn_json_all_c.textContent = ꕥ.get_total_all_contacts();
		ꕥ.btn_files.textContent = ꕥ.get_total_chat_files(ꕥ.current_sn);
		ꕥ.change_title(ꕥ.current_sn);
	}
}

ꕥ.json_download = function(json,filename){
	//generating file
	if(!json)return;
	ꕥ.store_icq();
	if(!filename)filename = 'ICQbackup2024';
	blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
	var a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = filename +".json";
	a.click();
}
ꕥ.prep_mhtml = function(){
	ꕥ.scrap_chat();
	ꕥ.store_icq();
	let root = document.getElementById("root");
	root.classList.add("gzSave");
}
ꕥ.close_save = function(){
	let root = document.getElementById("root");
	if(root){
		root.classList.remove("gzSave");
	}
}
ꕥ.toggle_files = function(){
	let root = document.getElementById("root");
	if(root.classList.contains("gzFiles")){
		root.classList.remove("gzFiles");
	} else {
		root.classList.add("gzFiles");
		ꕥ.render_file_list();
	}
}
ꕥ.save_json_chat = function(){
	ꕥ.owner = ꕥ.module_13.a.ACTIVE_MAIL;
	let branch = {contacts:{}};
	branch.chat = ꕥ.icq.chats[ꕥ.current_sn] || {};
	if(!branch.chat.persons){
		branch.contacts[ꕥ.current_sn] = ꕥ.icq.contacts[ꕥ.current_sn];
	} else {
		Object.keys(branch.chat.persons).forEach(function(sn){
			if(!!ꕥ.icq.contacts[sn]){
				branch.contacts[sn] = ꕥ.icq.contacts[sn];
			}
		});
	}
	let filename = 'ICQ #'+ꕥ.owner+' чат с '+document.title+' контактов['+ꕥ.get_total_chat_contacts(ꕥ.current_sn)+'] сообщений['+ꕥ.get_total_chat_messages(ꕥ.current_sn)+']';
	ꕥ.json_download(branch,filename);
}
ꕥ.save_json_all = function(){
	ꕥ.owner = ꕥ.module_13.a.ACTIVE_MAIL;
	let filename = 'ICQ #'+ꕥ.owner+' контактов['+ꕥ.get_total_all_contacts()+'] сообщений['+ꕥ.get_total_all_messages()+']';
	//console.debug(filename);
	ꕥ.json_download(ꕥ.icq,filename);
}



ꕥ.current_sn = 0;
ꕥ.get_first_msg_id = function(){
	//console.debug(ꕥ.current_sn,ꕥ.icq.chats[ꕥ.current_sn].messages);
	if(!!ꕥ.current_sn && !!ꕥ.icq.chats[ꕥ.current_sn] && !!ꕥ.icq.chats[ꕥ.current_sn].messages){
		return Object.keys(ꕥ.icq.chats[ꕥ.current_sn].messages).sort()[0];
	}
}
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
		let m = ꕥ.btn_mhtml_m.textContent;
		if(m){
			title += ', ['+m+'] сообщений';
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
	if(typeof obj == 'object'){
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

ꕥ.process_xhr = function(json,xhr){
	//console.debug(json); //only certain xhrs are getting caught here
}

ꕥ.process_make_xhr = function(data,xhr){
	//console.debug(xhr,xhr.status,data);
	if(xhr.status == 200){
		let string_file_info = "https://u.icq.net/api/v92/files/info/";
		if(xhr.responseURL.indexOf(string_file_info) == 0){
			data.file_id = xhr.responseURL.replace(string_file_info,'').replace(/\/.*/g,'');
			ꕥ.process_file_info(data);
		}
	}
}


ꕥ.process_file_info = function(data){
	let info = data.result.info;
	let extra = data.result.extra;
	if(!!info){
		if(!ꕥ.icq.chats[ꕥ.current_sn]){
			ꕥ.icq.chats[ꕥ.current_sn] = {}
		}
		let chat = ꕥ.icq.chats[ꕥ.current_sn];
		if(!chat.files){
			chat.files = {};
		}
		if(!chat.files[data.file_id]){
			chat.files[data.file_id] = {};
		}
		let file = chat.files[data.file_id];
		Object.keys(info).forEach(function(key){
			file[key] = info[key];
		});
		file.dlink_timestamp = Date.now();
		if(!!extra){
			Object.keys(extra).forEach(function(key){
				file[key] = extra[key];
			});
		}
		file.file_id = data.file_id;
		
		if(!ꕥ.icq_loading && ꕥ.download_automatically()){ //if download is on and not loading db
			ꕥ.download_file({file:file, chat_sn:ꕥ.current_sn, save_path:'#'+ꕥ.current_sn+'/'+ꕥ.make_filename(file)});
		}
	}
}

ꕥ.download_automatically = function(){
	return ꕥ.download_automatically_switch.checked;
}


ꕥ.download_file = function(object){
	if((object.file.download_state || 0) < 1){ // if failed or never started to dl
		object.file.download_state = 1;
		ꕥ.message('download',object,ꕥ.download_state_update);
	}
}

ꕥ.download_state_update = function(obj){
	//console.debug(obj.file.download_state,obj.file);
	let chat = ꕥ.icq.chats[obj.chat_sn];
	if(!!chat){
		if(!chat.files){
			chat.files ={};
		}
		if(!chat.files[obj.file.file_id]){
			chat.files[obj.file.file_id] = obj.file;
		} else {
			chat.files[obj.file.file_id].download_state = obj.file.download_state;
		}
	}
}

ꕥ.owner = 'outgoing';
ꕥ.process_msgs = function(json){
	if(ꕥ.msg_counter >=500){
		ꕥ.msg_counter = 0;
		ꕥ.store_icq();
	}
	//console.debug(json);
	ꕥ.owner = ꕥ.module_13.a.ACTIVE_MAIL;
	if(!!json && !!json.requestParams && !!json.requestParams.sn){
		
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
			if(!chat.files){
				chat.files = {};
			}
			for(let m=0;m<json.messages.length; m++){
				ꕥ.msg_counter++;
				let json_msg = json.messages[m];
				if(!chat.messages[json_msg.msgId]){
					chat.messages[json_msg.msgId] = {};
				}
				let chat_msg = chat.messages[json_msg.msgId];
				
				chat_msg.time = json_msg.time;
				chat_msg.from = json_msg.from;
				if(!!json_msg.chat){ //if chat
					chat_msg.from = json_msg.chat.sender;
				}
				
				if(!chat_msg.from){
					if(!!json_msg.outgoing){ //it's a me, Ownero
						chat_msg.from = ꕥ.owner;
					} else {
						chat_msg.from = sn;
					}
				}
				if(!!json_msg.filesharing){
					chat_msg.attachments = [];
					for(let f=0;f<json_msg.filesharing.length;f++){
						let fsh = json_msg.filesharing[f];
						if(!chat.files[fsh.id]){
							chat.files[fsh.id] = {};
						}
						let file = chat.files[fsh.id];
						file.file_id		= fsh.id;
						file.has_previews	= fsh.is_previewable;
						file.file_size		= fsh.size;
						file.file_name		= fsh.name;
						if(!file.md5 && !!fsh.content_id){
							file.md5		= fsh.content_id.replace(/[0-9]*_/g,'');
						}
						file.mime			= fsh.mime;
						file.sn				= fsh.uid;
						file.date_created	= fsh.date_create;
						file.status			= fsh.status;
						chat_msg.attachments.splice(fsh.order || 0, 0, fsh.id);
					}
					delete chat_msg.filesharing; //not needed for production version
					delete chat_msg.state; //not needed for production version
				}
				Object.keys(json_msg).forEach(function(k){
					if(k!='msgId' && k!='chat' && k!='filesharing' && k!='time' && k!='from' && k!='reqId' && k!='outgoing' && k!='updatePatchVersion'){
						chat_msg[k] = json_msg[k];
					}
				});

			}
		}
		ꕥ.refresh_stats();
	}
}

ꕥ.dump_the_dump = function(){
	if(!!ꕥ.dump){
		ꕥ.dump.innerHTML = '';
	}
}
ꕥ.dump_the_chat = function(callback){
	let chat = document.querySelector('.imMessagesBlock');
	chat.innerHTML = '';
}
ꕥ.removeWarned = function(){
	let node = document.getElementById('mainPagesContReact');
	if(node){
		node.classList.remove("gzWarned");
	}
}

ꕥ.switch_chat = function(data){
	ꕥ.current_sn = data.mail;
	ꕥ.change_title(ꕥ.current_sn);
	ꕥ.dump_the_dump();
	ꕥ.store_icq();
	ꕥ.refresh_stats();
	ꕥ.removeWarned();
	ꕥ.render_file_list();
}


ꕥ.css = `
@charset "utf-8";
.gzMenu,
.gzFilesList,
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

.gzFilesList{
	display:none; width:auto; max-width:none; overflow:auto;
	top:56px; left:280px; right:0; bottom:0px; z-index:3001;
	background-color:rgba(var(--theme-color-chat_environment));
}

.gzFiles .gzFilesList{
	display:block;
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
<div class="gzFilesList" id="gz_files"></div>
<div class="gzMenu gzLoading">
	<div class="gzPreview">
		<button id="gz_save_btn" onclick="ꕥ.prep_mhtml()" title="Запустите автосбор истории чтобы получить все сообщения"><m>-</m></button>
		<button id="gz_json_chat_btn" onclick="ꕥ.save_json_chat()" title="В сообщения входят события, поэтому число может не совпадать с html">*.json, этот чат <c>-</c> <m>-</m></button>
		<button id="gz_json_all_btn" onclick="ꕥ.save_json_all()" title="Всё, что собрано (кроме файлов), в одном файле.">*.json, всё <c>-</c> <m>-</m></button>
		<button id="gz_download_automatically" title='Скачивать файлы во время прокрутки истории. Отключите "Всегда указывать место для скачивания" и задайте папку. Расширение само создаст подпапки в ней для каждого чата.'><label><input id="gz_download_automatically_switch" type="checkbox" checked="checked"></label></button>
		<button id="gz_files_btn" onclick="ꕥ.toggle_files()"><f>-</f></button>
		<button id="gz_auto_scroll_btn" onclick="ꕥ.start_auto_scroll()" title="В конце будет подан звуковой сигнал.">Собрать историю чата (автопрокрутка)</button>
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
		<button id="gz_close_btn" onclick="ꕥ.close_save()">Назад</button>
	</div>
	<div class="gzThanks">
		<span title="Сохранено с помощью расширения ICQbackup2024">ICQbackup2024<span> <br> <a href="https://github.com/minch-dev" title="Ссылка на Гитхаб">minch-dev</a>
	</div>
	<div class="gzFiles">
		<button id="gz_save_file_list" onclick="ꕥ.save_file_list()" title="Для импорта в менеджер закачек и т.п.">Сохранить список ссылок как .html страницу</button>
	</div>
</div>
`;



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

//ꕥ.webpack_modules[1874]  FileAPI.checkGDPRData()
//ꕥ.webpack_modules[1874]  FileAPI.getDownloadGDPRDataLink()


//data.sender === app_AppState.a.ACTIVE_MAIL
//isSelf

//selfProfile

//var mixFavoriteInList = function(data) {
//https://u.icq.net/api/v92/wim/im/sendIM

//value: function updateDialogInfoData(data) {
	//this.infoData.isFavorite = this.infoData.selfProfile && this.infoData.activeChat;

//value: function onPageLoad(pg, dialog) {
	//this.isFavorite = this.mail === app_AppState.a.ACTIVE_MAIL;

//monkey patch and reinject the script and everything
ꕥ.fetch_text(location.href,function(html){
	html = html.replace(/\<link\ rel=(icon|apple-touch-icon)[^>]+\>/gm,'');
	html = html.replace('</head>','<link rel="shortcut icon" type="image/ico" href="data:image/x-icon;base64,AAABAAEAICAQAAAAAADoAgAAFgAAACgAAAAgAAAAQAAAAAEABAAAAAAAgAIAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAACAAACAAAAAgIAAgAAAAIAAgACAgAAAwMDAAICAgAAAAP8AAP8AAAD//wD/AAAA/wD/AP//AAD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3cAAAAAAAAAAAAAAAAACAAANwAAAAAAAAAAAAAAAAACIABwB4cAAAAAAAAAAAgAKqoghwAAgAAAAAAAAAAIAqqqoAACIAcAAAAAAAAAAwqqqqAAKqIIAAAAAAAAAAgCqqqgAKqiCAAAAAAAAAAIAKqqoAKqogiDOHAAAAAIiAAqqqACqqAAAAAIAAAHAAAAAqqgAqogACKiAHAAAAGZEAAqIAqiAAKqqiAwAAAJmZEAAiACIAAqqqqgAAAACZmZkAAAAAAiqqqqoAAABwCZmZkAu7MAqqqqqiAwAACAABGRC7u7ACIqqqIAcABwAAAAAAu7uzAAAAAACAAHAAIiAAALu7swAAAAAIAACAKqqqoiA7u7ACIiAAAwAAMCqqqqogADMAAqqqogAwAIAqqqqiAAAAAgACqqogBwCACqqqIAAiACogACqqoggAAAAiIAACogAqogACKiAHAAAwAAAAKqIAKqoAAAAAMAAAB4iDACqgAKqqIAAzOAAAAAAAAAKqoACqqqIAAAAAAAAAAHAqqiAAqqqqAAAAAAAAAABwKqogAKqqqgAAAAAAAAAAcAqiAAAqqqIAAAAAAAAAAAMCIAdwAqogCAAAAAAAAAAHAACACAAAAIAAAAAAAAAAAAdwAABzAAgAAAAAD//////+P///+A////AGP//gAB//4AAP/+AAD//gAA//4AAAf4AAAD4AAAAeAAAAHgAAAB4AAAAeAAAAHwAAABwAAAA4AAAAeAAAAHgAAAA4AAAAGAAAABwAAAAeAAAAPwAAAH/wAAf/4AAH/+AAB//gAAf/8AAH//AwD//8+B/w==">'+'</head>');
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
		let patch_8 = 'var __webpack_modules__=';
		let patch_9 = 'var _modules_app_AppState__WEBPACK_IMPORTED_MODULE_13__=';
		let patch_10 = 'if(data){this.destroy();this._initCache(data)}';
		let patch_11 = 'var RELOAD_HISTORY_ON_REFRESH=false;var STORAGED_HISTORY_LIMIT=3*HISTORY_PART_VOLUME;';
		let patch_12 = 'dlgToSave.history=[dlg.history[dlg.history.length-1].slice(-historyLimit)];';
		let patch_13 = 'return this.send(rapi.methods.getHistory,params,cb,scope)';
		let patch_14 = 'function(resultValue){var resultCode=resultValue.resultCode,data=resultValue.data;';
			//let patch_15 = 'if(this.dialogPage.isFavorite';		this.dialogPage.dialog.history[0][0]
		let patch_15 = 'this.isFavorite=this.mail===app_AppState.a.ACTIVE_MAIL;';
		let patch_16 = 'this.isFavorite=this.infoData.selfProfile&&this.infoData.activeChat;';
		let patch_17 = 'this.goDownButton=this.el.createChild({cls:"btnGoDown im-chat__history-go-down",children:{tag:"span"}}).on("click",(function(){this.jumpToEnd()}),this);';
		let patch_18 = 'this.goDownButton.remove();';
		let patch_19 = 'resolve({status:xhr.status,data,xhr})';
		
		
		ꕥ.add_style_txt(ꕥ.css);
		jscript = jscript
			.replace(patch_1,patch_1+'.replace("data:application/octet-stream;base64,","data:image;base64,")') //fix avatars
			.replace(patch_2,patch_2+'ꕥ.scrap_chat();') //clone messages before unload
			.replace(patch_3,patch_3+'ꕥ.scrap_chat();') //clone messages before unload
				//.replace(patch_4,'ꕥ.process_xhr(resultData);'+patch_4) //history and gallery xhrs
			.replace(patch_5,patch_5 + 'ꕥ.switch_chat(data);')	//clear dump
			.replace(patch_6,patch_6 + 'ꕥ.scrap_chat();')	//clone messages after load
			.replace(patch_7,patch_7 + 'ꕥ.process_contact_info(userInfo);')	//get user data
			.replace(patch_8,patch_8 + 'ꕥ.webpack_modules=')	//expose webpack module
			.replace(patch_9,patch_9 + 'ꕥ.module_13=')	//expose webpack module
			.replace(patch_10,'if(!!data && !!data.dialogs){for(let d=0;d<data.dialogs.length;d++){data.dialogs[d].historyLoaded=false;data.dialogs[d].history=[]}};'+patch_10)	//stop loading cached crap 0
			.replace(patch_12,'dlgToSave.history=[];')	//stop loading cached crap 1 
			.replace(patch_11,'var RELOAD_HISTORY_ON_REFRESH=true;var STORAGED_HISTORY_LIMIT=1;')	//stop loading cached crap 2
			.replace(patch_13,'let cbwas = cb; cb = function(code,reqId,fullCode,resultData){ꕥ.process_msgs(resultData);cbwas(code,reqId,fullCode);};'+patch_13)	//stop loading cached crap 3
			.replace(patch_14,patch_14+'ꕥ.process_persons(data);')	//additional user data
				//.replace(patch_15,'this.dialogPage.isFavorite=false;'+patch_15)	//stop sending this stupid message and show my favs!
			.replace(patch_15,'this.isFavorite=false;')	//stop sending this stupid message and show my favs!
			.replace(patch_16,'this.infoData.selfProfile=this.infoData.isFavorite=false;')	//stop sending this stupid message and show my favs!
			.replace(patch_17,patch_17+'this.goBackUp=this.el.createChild({cls:"btnGoBackUp im-chat__history-go-backup",children:{tag:"button"}}).on("click",(function(){ꕥ.dump_the_chat();ꕥ.dump_the_dump();this.scrollUpToMessage(ꕥ.get_first_msg_id());}),this);')	//goBackUp button
			.replace(patch_18,patch_18+'this.goBackUp.remove();')	//goBackUp button
			.replace(patch_19,'ꕥ.process_make_xhr(data,xhr);'+patch_19)	//file info xhr

			.replace('scriptUrl=document.currentScript.src;','scriptUrl="'+jsrc+'";') //"fix automatic publicPath error"
			.replace('document.title=tmpTitle','')	//stop ruining title
			.replace('const dialogStates_Chat=Chat;','const dialogStates_Chat=ꕥ.history=Chat;')	//expose function scrollUpToMessage(archId, implicitly, skipBlinking) {      btnGoDown im-chat__history-go-down		goDownButton
			.replace('count:data.count||-20,','count:data.count ? Math.sign(data.count)*100 : -100,')	//100!
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
				if ('rightPane' == e.target.id && class_list.contains("gzScanning")){
					ꕥ.stop_auto_scroll();
				}
			}, false);
			ꕥ.btn_mhtml = document.getElementById('gz_save_btn');
			ꕥ.btn_json_chat = document.getElementById('gz_json_chat_btn');
			ꕥ.btn_json_all = document.getElementById('gz_json_all_btn');
			ꕥ.btn_files = document.getElementById('gz_files_btn');
			ꕥ.btn_mhtml_m = ꕥ.btn_mhtml.querySelector('m');
			ꕥ.btn_json_chat_m = ꕥ.btn_json_chat.querySelector('m');
			ꕥ.btn_json_chat_c = ꕥ.btn_json_chat.querySelector('c');
			ꕥ.btn_json_all_m = ꕥ.btn_json_all.querySelector('m');
			ꕥ.btn_json_all_c = ꕥ.btn_json_all.querySelector('c');
			ꕥ.btn_files = ꕥ.btn_files.querySelector('f');
			ꕥ.dump = document.getElementById('gz_dump');
			ꕥ.file_list = document.getElementById('gz_files');
			ꕥ.download_automatically_switch = document.getElementById('gz_download_automatically_switch');
			if(!ꕥ.icq_loading){
				ꕥ.remove_loading();
			}
		}

		
	});
});

