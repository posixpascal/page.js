# $page.js
## A super-tiny fast page-router for small HTML5 apps.

$page.js is a super-tiny JavaScript library to register page handler for your URLs
Checkout a few examples:

```javascript
	$pageRouter = $page({
		'/': {
			handler: function(){
				console.log("hey! .");
			}
		},

		'/{:do}/{:you}/{:like}/{:me}': {
			handler: function(params){
				console.log(params.do);
				console.log(params.you);
				console.log(params.like);
				console.log(params.me);
				console.log("--- see? it's easy!")
			}
		}
	});
```

By default $page.js hijacks no links and you have to call $pageRouter('/url') to change pages.
If you want to hijack links:

```javascript
	$page({
		...
	}, {
		hijackLinks: true
	});
```


$page.js returns a method which you can call to switch pages and triggering the $page router machanism.

```javascript
	var pageRouter = $page({...});


	pageRouter('/'); // goes to "/" while also triggering the matched route.
```

Routes get also triggered when the user clicks on the back-button in the browser.
You get an additional parameter in the handler function eg:

```javascript
	$page({
		'/': function(params, routeDefinition, userClickedBackButton){
			msg = "Welcome! :)";
			if (userClickedBackButton){
				msg = "Ayyy, welcome back";
			}
			alert(msg);
		}
	});

```

### Why is $page.js special?

- [x] $page.js doesn't pollute the global scope
- [x] $page.js weighs less than 1.8kB *in total*
- [x] $page.js passes url parameters to getters
- [x] $page.js is optimized for speed
- [x] $page.js is easy to drop into existing libraries like React

### How can I use it?
Check the given example in src/demo.js and index.html. You can use $page.js by including it before the body ends or in the head section of your page.
Include it using:

```javascript
	<script src="dist/page.js"></script>
	<script>$page({ /* your page definition */ });</script>
```

### After/Before Routes (new):
$page.js offers new eventHandlers before and after a route is triggered. You can attach a function to the individual route handler like this:

```javascript
<script>
    $page({
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
		
		}
    });
</script>
```

When the user navigates to "/", $pageJS will execute the beforeRoute and wait until the `next` callback is called.
If you don't call the next callback, your route won't get triggered.

Typically, you can wait for ajax requests to finish in the __beforeRoute__ block. If you want to cancel the route function, just return false in the beforeRoute function. If no beforeRoute key is set in the routeDefinition, pageJS will skip it.

The afterRoute gets called immediately after the template is parsed. 


### Templates
You can include __template.js__ to extend $page.js with a simply and fast template system. First, include template.js in your webpage as well as page.js (the order is not important). Next you have to configure $page.js like this:

```javascript
<script>
	$page({ /*... page definition ... */}, {
		'templateRoot': 'page-templates',
		'templateEngine': window.$template
	});
</script>
```

The templateRoot has to be a valid ID where the templates will be rendered. Substates/Subtemplates aren't supported by $templateJS (and propably never will be).
Next thing you want to do is register a simple template like this:

```javascript
	<script type="text/html" id="main.html">
		<!-- your HTML code -->
	</script>
```

Whenever a routeDefinition includes a 'template' key, $page.js will load the script template with the corresponding ID.
Eg: 
```javascript
{                            maps to     
	'template': 'main.html'      |           '<script id="main.html"></script>'
}
```


$page.js still weighs less then 2KB (including templating). 
