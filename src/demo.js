window.onload = function(){

	window.router = $page({
		'/': {
			handler: function(params, router){
				console.log("got it.");
				router.route('/my/test');
			},
			template: function(params, router){
				var t = $template('main.html', params);
			},
		},
		'/my/{:stuff}': {
			handler: function(params, router){
				console.log(router.currentRoute());
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
