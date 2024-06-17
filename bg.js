//just execute whatever part of the extension i told you to execute
chrome.runtime.onMessageExternal.addListener(
	function(request, sender, callback) {
		if(typeof this[request.action] === 'function'){ //if called function exists
			this[request.action](request.object,callback);
		} else {
			callback(); //needed for buggy chrome to shut up
		}
		return true; //to return async
	}
);

function store(object,callback){
	chrome.storage.local.set(object,callback);
	//console.debug('!!!!!!!!!!!!!!!');
}

function retrieve(object,callback){
	chrome.storage.local.get(object,callback);
}

function download(object,callback){
	chrome.downloads.download({url:object.file.dlink, filename:object.save_path, saveAs:false, conflictAction:"overwrite"}, function(download_id) {
		if(download_id != undefined){
			chrome.downloads.onChanged.addListener(function(entry){
				if(entry.id == download_id){
					if(!!entry.error){ //entry.error/fail/cancel
						object.file.download_state = -1;
						callback(object);
					} else {
						//object.file.download_state = 1; //in progrss/entry.paused
						if(typeof entry.endTime !== 'undefined'){ //success
							object.file.download_state = 2;
							callback(object);
						}
					}
					//console.debug(entry.endTime,object.file.download_state,entry);
				}
			});
		} else {
			object.file.download_state = -1;//failed to add
			callback(object);
		}
	});
}