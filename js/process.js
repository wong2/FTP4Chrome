define(function(){
	return {
		nextTick: function(callbak){
			setTimeout(callbak, 0);
		}
	};
})