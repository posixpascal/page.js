window.onload = function(){

	window.router = $page({
		'/': {
			handler: function(params, router){

			},
			template: 'main.html',
		},
		'/my/{:stuff}': {
			handler: function(params, router){
				console.log(router.currentRoute());
			},
			template: 'my.html'
		},
		'$notFound': {
			handler: function(params, router){

			}
		}
	}, {
		'hijackLinks': true,
		'templateRoot': 'page-templates',
		'templateEngine': window.$template
	});

	window.router.route('/thisShouldBe404');

	var span = $(".time");
	setInterval(function(){
		var t = new Date();
		span.html(t.getDate() + "." + t.getMonth() + "." + t.getYear() + " / " + t.getHours() + ":" + t.getMinutes()  + ":" + t.getSeconds());
	}, 1000);

};
