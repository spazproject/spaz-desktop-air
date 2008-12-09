/*
 * Copyright 2007-2008. Adobe Systems Incorporated.
 * All rights reserved.
 */


function BlenderEffect(shaderURL){
	this.shader = null;
};

BlenderEffect.prototype.applyEffect = function(displayObject, shaderParameters){
	var shader = this.shader;
	if (!shader)
		return;
	if(shader.data.width){
	shader.data.width.value[0] = displayObject.width;
	shader.data.height.value[0] = displayObject.height;
	}
	for(var paramName in shaderParameters){
		shader.data[paramName].value[0] = shaderParameters[paramName];
	}
	
	var shaderFilter = new air.ShaderFilter(shader);
	// let the shader always be the first filter 
	shaderFilter.leftExtension = shaderFilter.topExtension = 
			shaderFilter.bottomExtension = shaderFilter.rightExtension = 30;
	
	
	var oldfilters = displayObject.filters;
	var found = false;
	var filters = [shaderFilter];
		for(var i=0; i<oldfilters.length; i++) { 
			if (typeof oldfilters[i].shader=='undefined') {
				filters.push(oldfilters[i]);		
		}		
	}
	displayObject.filters = filters;
};


BlenderEffect.prototype.removeEffect = function(displayObject){
	var filters = []; 
	for(var i=0; i<displayObject.filters.length; i++) { 
		if (typeof displayObject.filters[i].shader=='undefined'){
			filters.push(displayObject.filters[i]);
		}
	}
	displayObject.filters = filters;
}

BlenderEffect.prototype.loadShader = function(shaderURL){
	var self = this;
 
	var loader = new air.URLLoader();
	loader.dataFormat = air.URLLoaderDataFormat.BINARY;
	loader.addEventListener(air.Event.COMPLETE, function(){
		self.shader = new air.Shader(loader.data);
		if (self.onLoadComplete)
		{
			self.onLoadComplete();
		}
	});
	loader.load(new air.URLRequest(shaderURL));
}

BlenderEffect.shaderCache = {};
BlenderEffect.get = function(shaderURL, callback){
	var shader = BlenderEffect.shaderCache[shaderURL];
	
	if (shader){
		// load the shader from cache
		callback(shader);
	}else{
		// create the shader and it in the cache for later use
		shader = new BlenderEffect();
		shader.onLoadComplete = function(){
			callback(shader);
		}
		shader.loadShader(shaderURL);
	}
}

BlenderEffect.createShaderTransition = function (displayObject, shader, duration, transition) {
	var tween = new Tween(0, 1, duration, transition);
	
	tween.keepTheEffect = false;
	tween.hideOnFinish = false;
	tween.disableInteraction = false;

	tween.onStart = function () {
		if(this.disableInteraction){
			window.htmlLoader.stage.mouseChildren = false;
		}
	}
	
	tween.onEffect = function(value){
		// apply the blender effct
		var transition = this.reversed ? 1-value : value;
		var shaderParams = this.shaderParams || {};
		shaderParams['transition'] = transition; 
		shader.applyEffect(displayObject, shaderParams);
	}
	tween.onFinish = function(value){
		if(this.hideOnFinish){
			displayObject.visible = false;
		}

		if(!this.keepTheEffect){
			shader.removeEffect(displayObject);
		}
		
		if(this.disableInteraction){
			window.htmlLoader.stage.mouseChildren = true;
		}

	}
	return tween;
}
