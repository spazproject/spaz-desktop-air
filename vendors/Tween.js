/*
 * Copyright 2007-2008. Adobe Systems Incorporated.
 * All rights reserved.
 */

function Tween(beginValue, endValue, duration, effect){
	this.beginValue = beginValue;
	this.endValue = endValue;
	this.duration = duration;
	this.running = false;
	this.effect = effect || Tween.effects.elasticEase;
}

Tween.fps = 30;
Tween.effects = {
	linear : function elasticEase(t, b, c, d){
		return (t/d)*c + b;
	},
	
	elasticEase : function elasticEase(t, b, c, d){
		if (t==0) return b;  
		if ((t/=d)==1) return b+c;
		
		var p=d*.3;
		var s = p/4;
		var a = c;
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
	}
	
};

Tween.prototype.start = function(reversed){
	if (this.running){
		this.finished(false);
	}
	
	this.reversed = reversed;
		
	if (!this.onEffect)
		return;
		
	this.running = true;
	
	var self = this;
	var duration = this.duration;
	
	var beginValue = this.beginValue;
	var endValue = this.endValue;
	var duration = this.duration;
	var fps = Tween.fps;
	var transitionEffect = this.effect;
	var currentEffect  = 0;
	var startTime = new Date().getTime();
	
	if (this.onStart){
		this.onStart();
	}
	
	currentEffect = transitionEffect(0, beginValue, endValue-beginValue, duration);
	if(!this.onEffect(currentEffect, 0)){
	this.interval = setInterval(function(){
		var newTime = new Date().getTime();
		var deltaTime = newTime-startTime;
		currentEffect = transitionEffect(deltaTime, beginValue, endValue-beginValue, duration);
		if(nativeWindow.closed || self.onEffect(currentEffect, deltaTime/duration) || duration<=deltaTime || !self.running){
			 self.finished(false);
		}
	}, 1000/fps);
}
}

Tween.prototype.finished = function(interactive){
	clearInterval(this.interval);
	 this.interval = null; 
	 this.running = false; 
	 if(this.onFinish) {
	 	this.onFinish(interactive);
	 }
}

Tween.prototype.stop = function(){
	 if (this.running)
	 	this.finished(true);
}