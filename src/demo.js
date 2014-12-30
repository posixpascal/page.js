/**
 * This function is just for demonstration purposes.
 * We define a global window.router using the $page() function.
 * 
 * The $page function accepts an object as it's first argument
 * the object defines every route you want to use in your app.
 * Use the URL construct as an object key, the value should be another
 * object containing the handler, the template and other information.
 *
 * You can, however, use a function as the object value, $page.js
 * will assume that it's the handler function and calls it accordingly.
 *
 * An example: 
 *
 * {
 * 	'/': function(params, router){ [...] },
 * 	'/test': {[...]}, // executed whenever the user goes to "/test"
 * }
 *
 * You can define placeholders using the special {:} construct.
 * If you map {:test} to an URL, $page.js will accept placeholders
 * and pass these to the handler function in the "params" object.
 * Given the following URL construct:
 * 		/hello/{:name}
 * 	When the user goes to '/hello/tom':
 * 		params.name will be tom.
 *
 * Special 'symbol-based' routes are prefixed with a dollar sign.
 * $notFound is called whenever a user accesses a route $page.js doesn't know.
 *
 * The beforeRoute key is special in that it halts the execution loop until the "next" function is called.
 * The beforeRoute can, for example, fetch resources using AJAX and call "next" in the success callback.
 *
 * This is just a small example on how to use $page.js
 */
window.onload = function(){

	window.router = $page({
		'/': {
			handler: function(params, router){

			},
			template: 'main.html',
			beforeRoute: function(params, router, next){
				console.log("About to route to / in 3 seconds");
				setTimeout(next, 3 * 1000, params, router);
			},
			afterRoute: function(){
				console.log("Routed to /");
			}
		
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
		var seconds = t.getSeconds() + "";
		if (seconds.length == 1){ seconds = "0" + seconds;}
		span.html(t.getHours() + ":" + t.getMinutes()  + ":" + seconds);
	}, 1000);

};
