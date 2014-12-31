/**
 * $page.js is a minimalistic but powerful
 * in-page router. It's primary goals are:
 * 	simplicity
 * 	readability
 * 	compatibility
 *
 * $page.js will always return objects no
 * matter what. This provides better 
 * compatibility between releases.
 * 
 * @param  {Object} page    An object with miniURLs mapped to objects.
 *                          Example page would be:
 *                          {
 *                          	'/': {
 *                          		$: function(){} // controller
 *                          	}
 *                          }
 *                          
 * @param  {Object} options An object containing various options key
 *                          see $page.defaultOptions for configurable
 *                          options
 * @return {Object}         A $page.js controller for triggering
 *                          various routes and actions.
 */
window.$page = function(page, options){
	'use strict';


	var currentRoute = "";
	var has404route = false;
	/*=============================================
	=            MiniURL specification            =
	=============================================*/
	/**
	 * $page.js uses MiniURLs for addressing routes
	 * with Parameters. An example miniURL might
	 * look like this: `/your/{:fragment}`
	 *
	 * This miniURL will match the following URLs:
	 * 	/your/url - {fragment: 'url'}
	 * 	/your/some - {fragment: 'some'}
	 *
	 * However, miniURL won't match the following:
	 * 	/your - URL not fulfilled
	 * 	/your/my/url - nothing matches /your/{:fragment}/url
	 *
	 * miniURL returns an object with the following
	 * pattern:
	 * 	{
	 * 		regex: /[\/]your\/(<?fragment>.+)/i
	 * 	}
	 * 	
	 * @param  {String} urlFragments [a miniURL String]
	 * @return {Object}              [an Object with a regex key]
	 */
	var miniURL	= function(urlFragments){
		var result = {};

		var parts = urlFragments.split("/");
		var modifiedParts = [];
		var regexMap = [];
		for (var i = 0, len = parts.length; i < len; i++){
			var part = parts[i];
			part = part.replace(/\{:(.+)\}/, "([^\/]+?)");
			modifiedParts.push(part);
			
			// map the regexp
			if (RegExp.$1.length) {
				regexMap.push(RegExp.$1);
			}

		}

		var regex = modifiedParts.join("/");

		// the last trailing slash should be optional
		var lastSegment = regex.substring(regex.length - 1, regex.length);
		if (lastSegment == "/"){ // omit last trailing slash
			regex = regex.substring(0, regex.length - 1);
		}

		regex = "^" + regex + "\/?$";
		result.regex = new RegExp(regex);
		result.map = regexMap;

		return result;
	};
	
	
	/*-----  End of MiniURL specification  ------*/
	
	

	/*=============================================
	=             Parse fragments                 =
	=============================================*/

	var urlFragments = Object.keys(page);
	var parsedFragments = [];
	var urlFragmentsLength = urlFragments.length;
	for (var i = 0; i < urlFragmentsLength; i++){
		var urlFragment = urlFragments[i];
		if (urlFragment === '$notFound'){
			has404route = true;
			continue;
		}

		var matcher = miniURL(urlFragment);

		var parsedFragment = {
			matcher: matcher,
			data: page[urlFragment],
			route: urlFragment
		};

		parsedFragments.push(parsedFragment);
	}

	/*-----  End of Parse fragments  ------*/
	


	/*=============================================
	=            Configuring templates            =
	=============================================*/
	
	/**
	*
	* $page.js supports multiple template engines
	* out of the box, we just don't include any
	* in the default build for size/performance reasons.
	*
	* If you want to use HandleBars you you have to set
	* the template engine accordingly in the options object
	*
	* {
	* 	templateEngine: Handlebars.compile
	* }
	*
	* Whenever $page.js matches a URL it uses the template source
	* and passes it to $page.templateEngine.
	*
	* This function has to return a function which accepts the URL parameters.
	*
	* 'TEMPLATE' -> templateEngine -> (param1: ..., param2: ...) -> output
	*
	* The result should be HTML in the end.
	**/
	
	// TODO: implement me. :)
	var templateRoot = "";
	var templateEngine = "";
	if (typeof options !== "undefined" && typeof options.templateEngine !== "undefined"){
		templateEngine = options.templateEngine;
		templateRoot = options.templateRoot || "#page-templates";
	}

	/*-----  End of Configuring templates  ------*/
	
	
	var pageHandler = function pageHandler(path, back){
		currentRoute = path;

		var routed = false;

		if (typeof back === "undefined"){ back = false; }

		for (var j = 0, len = parsedFragments.length; j < len; j++){
			var parsedFragment = parsedFragments[j];
			var matcher = parsedFragment.matcher;
			if (matcher.regex.test(path)){ // route match!

				// parsing params
				var params = {};
				for (var k = 0, mapLength = matcher.map.length; k < mapLength; k++){
					// this is a bit ugly at the moment.
					params[matcher.map[k]] = RegExp["$" + (k + 1)];
				}
				var handler;
				var isFunctionOnly = false;;
				console.log(parsedFragment);
				if (typeof parsedFragment.data === "function"){
					handler = parsedFragment.data;
					isFunctionOnly = true;
				} else { 
					handler = parsedFragment.data.handler; 
				}

				// call handler:
				if (typeof handler === "undefined"){
					console && console.error("No handler defined for route: " + parsedFragment.route);
					break;
				}
				routed = true;

				var next = function(params, $pageRouter){
					handler.bind(this)(params, $pageRouter, back);

					/*==========  Handle templates  ==========*/

					if (!isFunctionOnly && typeof parsedFragment.data.template !== "undefined"){
						var templateRootElem = document.getElementById(templateRoot);
						var templateSource = templateEngine(parsedFragment.data.template, params);
						templateRootElem.innerHTML = templateSource;
					}

					/*==========  End handle templates  ==========*/

					if (!isFunctionOnly && typeof parsedFragment.data.afterRoute !== "undefined"){
						parsedFragment.data.afterRoute.bind(this)();
					}
					
				};

				if (!isFunctionOnly && typeof parsedFragment.data.beforeRoute !== "undefined"){
					parsedFragment.data.beforeRoute.bind(this)(params, $pageRouter, next);
				} else {
					next(params, $pageRouter, back);
				}



				
			
				break;
			}
		}

		/*==========  404 route  ==========*/
		if (!routed && has404route){
			page[$pageRouter.get404Route()].handler.bind(this)({}, $pageRouter, back);
		}
	};

	var $pageRouter = {
		route: pageHandler,
		currentRoute: function(){
			return currentRoute;
		},
		get404Route: function(){
			if (has404route){
				return '$notFound';
			}
		},
		getRoutes: function(){
			return parsedFragments;
		}
	};

	/*========================================
	=            Running $page.js            =
	========================================*/
	
	var path = window.location.pathname;
	pageHandler(path);
	
	/*-----  End of Running $page.js  ------*/
	

	/*========================================
	=            Helper functions            =
	========================================*/
	
	var pageTo = function(to){
		window.history.pushState(null, null, to);
		pageHandler(to);
	};
	
	/*-----  End of Helper functions  ------*/
	
	
	
	var prevActive = null;
	
	/*==============================================
	=            Adding click listeners            =
	==============================================*/
	
	if (typeof options !== "undefined" && typeof options.hijackLinks !== "undefined" && options.hijackLinks === true){
		/**
		 * Hijack all links
		 */
		document.body.addEventListener('click', function(e){
			if (e.target.tagName.toLowerCase() === 'a'){
				var href = "";

				// FIXME: needs testing
				if (typeof e.target.dataset.getAttribute !== "undefined") {
					href = e.target.dataset.getAttribute("href");
				} else {
					href = e.target.dataset.href;
				}
				if (prevActive !== null){
					prevActive.classList.remove("active");
				}
				prevActive = e.target;
				e.target.classList.add("active");
				pageTo(href);

				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			
		}, true);

	}
	
	/*-----  End of Adding click listeners  ------*/
	
	
	
	
	
	/*=============================================
	=            Handle Push/Pop State            =
	=============================================*/
	
	var handlePopState = function(){
		pageHandler(window.location.pathname, true);
	};
	
	/*-----  End of Handle Push/Pop State  ------*/
	
	
	

	/*=======================================
	=            Event Listeners            =
	=======================================*/
	window.addEventListener("popstate", function() {
	    handlePopState();
	});

	
	
	/*-----  End of Event Listeners  ------*/

	return $pageRouter;
	
};