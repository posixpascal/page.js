# $page.js - A super-tiny fast page-router for small HTML5 apps.

$page.js is a super-tiny JavaScript library to register page handler for your URLs
Checkout a few examples:

```javascript
	$page({
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

By default $page.js hijacks no links and you have to call $result('/url') to change pages.
If you want to hijack links:

```
	$page({
		...
	}, {
		hijackLinks: true
	});
```


$page.js returns a method which you can call to switch pages and triggering the $page router machanism.

```
	var pageRouter = $page({...});


	pageRouter('/'); // goes to "/" while also triggering the matched route.
```

Routes get also triggered when the user clicks on the back-button in the browser.
You get an additional parameter in the handler function eg:

```
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

# Why is $page.js special?

[x] $page.js doesn't pollute the global scope
[x] $page.js weighs less than 1.5kB *in total*
[x] $page.js passes url parameters to getters
[x] $page.js is optimized for speed
[x] $page.js is easy to drop into existing libraries like React
[x] in the end, $page.js is just a simple function

# How can I use it?
Check the given example in src/demo.js and index.html. You can use $page.js by including it before the body ends or in the head section of your page.
Include it using:

```
	<script src="dist/page.js"></script>
	<script>$page({})</script>
```

# Why?
Because I had 2 hours of sparetime and I thought, why not make a super-tiny URL-Router. :)
enjoy.