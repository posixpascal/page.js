window.$template = function(template, params, options){
	window.$template.cache = window.$template.cache || {};
	if (typeof window.$template.cache[template] !== "undefined"){ return window.$template.cache[template]; }

	var templatePath = "";
	if (typeof options !== "undefined" && typeof options.templatePath !== "undefined"){
		templatePath = options.templatePath;
	}

	// TODO: implement a tinyXHR library as well.
	var $xhrSync = function(){}; 


	/*=================================================
	=            Find template in <script>            =
	=================================================*/
	var template = document.getElementById(template);
	if (template){
		templateSource = template.innerHTML;
	} else {
		templateSource = $xhrSync(templatePath + "/" + template);
	}
	
	window.$template.cache[template] = templateSource;
	/*-----  End of Find template in <script>  ------*/

	/*===========================================
	=            Compile template...            =
	===========================================*/
	
	var compiledTemplate;

	variables = templateSource.match(/\{:(.+)\}/ig);
	if (variables){
		for (var i = 0, len = variables.length; i < len; i++){
			var currentVar = variables[i].trim();
			var result; 
			if (currentVar.indexOf("params.") > -1){
				// insert regular param
				result = params[currentVar.replace(/\{:\w?params.(.+)\}/, '$1')];
			} else {
				// evaluate regular javascript expression
				result = (Function(currentVar.replace(/\{:(.+)\}/, '$1')))();
			}

			templateSource = templateSource.replace(currentVar, result);
		}
	}



	/*-----  End of Compile template...  ------*/
	
	return templateSource;
	
	

};