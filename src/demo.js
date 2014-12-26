window.onload = function(){

	window.r = $page({
		'/': {
			handler: function(params, route){
				console.log("got it.");
			}
		},
		'/my/{:stuff}': {
			handler: function(params, route){
				alert(params.stuff);
			}
		}
	}, {
		'hijackLinks': true
	});

};
