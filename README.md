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


	pageRouter('/'); 
```