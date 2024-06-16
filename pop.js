const ꕥ = {};
ꕥ.icq = {contacts:{},chats:{}};

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
ꕥ.get_total_chat_messages = function(sn){
	chat = ꕥ.icq.chats[sn];
	if(chat && chat.messages){
		return Object.keys(chat.messages).length;
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
ꕥ.save_json_all = function(){
	chrome.storage.local.get(function(icq){
		ꕥ.icq = icq;
		let filename = 'ICQ архив контактов['+ꕥ.get_total_all_contacts()+'] сообщений['+ꕥ.get_total_all_messages()+']';
		console.debug(filename);
		ꕥ.json_download(ꕥ.icq,filename);
	});
}

document.getElementById('gz_json_all_btn').addEventListener('click', ꕥ.save_json_all, false);