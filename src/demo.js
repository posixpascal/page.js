window.onload = function(){

	window.router = $page({
		'/': {
			handler: function(params, router){
				console.log("got it.");
			},
			template: function(params, router){
				var t = $template('main.html', params);
			},
		},
		'/my/{:stuff}': {
			handler: function(params, router){
				alert(params.stuff);
			}
		},
		'$notFound': {
			handler: function(params, router){

			}
		}
	}, {
		'hijackLinks': true,
	});

};
