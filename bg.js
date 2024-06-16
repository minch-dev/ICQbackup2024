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
	console.debug('!!!!!!!!!!!!!!!');
}

function retrieve(object,callback){
	chrome.storage.local.get(object,callback);
}