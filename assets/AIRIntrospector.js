/* AIRIntrospector.js - Revision: 0.8 */

// Copyright (c) 2007. Adobe Systems Incorporated.
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
//   * Redistributions of source code must retain the above copyright notice,
//     this list of conditions and the following disclaimer.
//   * Redistributions in binary form must reproduce the above copyright notice,
//     this list of conditions and the following disclaimer in the documentation
//     and/or other materials provided with the distribution.
//   * Neither the name of Adobe Systems Incorporated nor the names of its
//     contributors may be used to endorse or promote products derived from this
//     software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
// ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
// LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
// CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
// SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
// CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
// ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.


var air;

if(typeof air=='undefined') air = {};
air.Introspector = {};

if(typeof window.runtime!='undefined') 
    air.Introspector.isAppSandbox = true;
else 
    air.Introspector.isAppSandbox = false;




air.Introspector.Console = {
	
 log: function(){
   	air.Introspector.logArguments(arguments,
	 		{htmlLoader:air.Introspector.isAppSandbox?window.htmlLoader:null});
 },

 warn : function(){
        air.Introspector.logArguments(arguments,
	 			{htmlLoader:air.Introspector.isAppSandbox?window.htmlLoader:null, type:'warn'});        
 },

 info : function(){
        air.Introspector.logArguments(arguments,
	 			{htmlLoader:air.Introspector.isAppSandbox?window.htmlLoader:null, type:'info'});        
 },
 
 error : function(){
        air.Introspector.logArguments(arguments,
	 			{htmlLoader:air.Introspector.isAppSandbox?window.htmlLoader:null, type:'error'});        
 }

};

air.Introspector.config = {
    showTimestamp: true,
    showSender: true,
    wrapColumns: 2000,
	flashTabLabels: true,
	closeDebuggerOnExit: true,
	debugRuntimeObjects: true,
    useAirDebugHtml: false,
	introspectorKey:117,
	debuggerKey:118 
};

if(!air.Introspector.isAppSandbox) air.Introspector.config.debugRuntimeObjects = false;


     

air.Introspector.extend = function(dst, src){
    for(var i in src){
        dst[i]=src[i];
    }
};

air.Introspector.__defineGetter__('inspect', function(){
    return air.Introspector._inspect;
});

air.Introspector.__defineSetter__('inspect', function(value){
    air.Introspector._inspect=value;
    if(!air.Introspector.isAppSandbox){
        setTimeout(function(){
            parentSandboxBridge.air_Inspector_setInspect(value);
        }, 0);
    }else{
		if(!value){
			air.Introspector.hideHighlight();
		}
	}
});
	
air.Introspector.extend(air.Introspector, {
	version: 0.8, 
	/**
	*	Makes it easier to acces runtime packages
	*/
	runtime: air.Introspector.isAppSandbox?{ 
		HTMLLoader : window.runtime.flash.html.HTMLLoader,
		Event : window.runtime.flash.events.Event,
		IOErrorEvent: window.runtime.flash.events.IOErrorEvent,
		NativeApplication: window.runtime.flash.desktop.NativeApplication,
		URLLoader : window.runtime.flash.net.URLLoader,
		URLRequest : window.runtime.flash.net.URLRequest,
		NativeWindowInitOptions : window.runtime.flash.display.NativeWindowInitOptions,
		Capabilities: window.runtime.flash.system.Capabilities,
		trace : window.runtime.trace,
	}:null,
	_inspect: false,
	remoteInspect: false,
    canClick: false,
	/**
	*	Different coloring styles for tag names, by default 'default' is used
	*/
    highlightBgColors: {
        'default': 0xFFCC00,
        //body: 0x00CC00,
        
    },
	/**
	*	Trims spaces from a string
	*/
    trimRegExp: /^[\s\r\n]*([\s\S]*?)[\s\r\n]*$/g,
    trim:function(str){
    	return str.replace(air.Introspector.trimRegExp, '$1');
    },
	/**
	*	Wraps a string by air.Introspector.config.wrapColumns columns
	*/
    blockWrap: function(str){
    	//used for spliting large lines in <pre>
    	var cols = air.Introspector.config.wrapColumns;
    	var lines = str.split(/\n/);
    	var buffer = [];
    	var l = lines.length;
    	var lineNumbers = [];
    	for(var i=0;i<l;i++){
    		lineNumbers.push(i+1);
    		var line = lines[i];
    		while(line.length>cols){
    			buffer.push(line.substr(0, cols));
    			line = line.substr(cols);
    			lineNumbers.push('');
    		}
    		buffer.push(line);
    	}
    	lineNumbers.push('EOF');
    	return [buffer.join('\n'), lineNumbers.join('\n')];
    },
	
	/**
	*	Returns a new flash TextField
	*/
    createTextField: function(parentSprite, fontSize, fontBold) {
		if(this.isAppSandbox){
       		var tf = new runtime.flash.text.TextField();
	        tf.embedFonts = false;
	        tf.autoSize = runtime.flash.text.TextFieldAutoSize.LEFT;
	        tf.antiAliasType = runtime.flash.text.AntiAliasType.ADVANCED;
	        tf.defaultTextFormat = air.Introspector.getTextFormat(fontSize, fontBold);
	        tf.selectable = false;
	        tf.mouseEnabled = true;
	        tf.x = 4;
	        tf.text = "";
	        if(parentSprite.numChildren > 0) {
	            var sibling = parentSprite.getChildAt(parentSprite.numChildren - 1);
	            tf.y = sibling.y + sibling.height + 15;
	        }
	        parentSprite.addChild(tf);
	        return tf;
		}else{
			//should not get here
			return null;
		}
    },
    /**
	*	Returns a new flash TextFormat
	*	see createTextField
	*/
    getTextFormat: function(fontSize, fontBold){
		if(this.isAppSandbox){
        	var format = new runtime.flash.text.TextFormat();
	        format.size = fontSize;
	        format.font = "Tahoma";
	        format.bold = fontBold;
	        format.color = 0x330066;
        	return format;
		}else{
			//should not get here
			return null;
		}
    },
    
	/**
	*	Initializes the sprite with values from the rectangle
	*/
	extendRect: function(sprite, rect){
		sprite.x = rect.x;
		sprite.y = rect.y;
		sprite.width = rect.width;
		sprite.height = rect.height;
		sprite.scaleX = rect.scaleX;
		sprite.scaleY = rect.scaleY;			
	},
	
	/**
	*	Shows a highlighting flash sprite using coordinates from rectangle
	*/
    showHighlight: function(rect){
		if(air.Introspector.isAppSandbox){
	        air.Introspector.extendRect(air.Introspector.highlightSprite, rect);
	        //dehilight everyone else
	        var ownedWindows = air.Introspector.getHtmlWindows();
	        for(var i=ownedWindows.length-1;i>=0;i--){
	            if(ownedWindows[i].nativeWindow!=nativeWindow){
	                try{
	                    ownedWindows[i].htmlLoader.window.air.Introspector.hideHighlight();
	                }catch(e){
	                    //no air.Introspector
	                }
	            }
	        }
		}else{
			//TODO: make it over the bridge
			setTimeout(function(){
				parentSandboxBridge.air_Inspector_showHighlight(rect);				
			}, 0);
			
			
		}
    },
	/**
	*	Make the higlight box go away
	*/
    hideHighlight: function(){
		if(air.Introspector.isAppSandbox){
        	air.Introspector.extendRect(air.Introspector.highlightSprite, {x:0, y:0, width:0, height:0, scaleX:0, scaleY:0});
	        air.Introspector.highlightText.visible = false;
		}else{
			setTimeout(function(){
				try{
					parentSandboxBridge.air_Inspector_hideHighlight();
				}catch(e){ 
						// no bridge yet
					}
			}, 0);
		}
    },


	remoteClick: function(){
		air.Introspector.debugWindow.finishInspect(false);
        air.Introspector.hideHighlight();
	},
	
	
    /**
	*	Creates a flash sprite used to higlight elements
	*	By using this method we are sure that no dom manipulation is done and  
	*	no style is changed in HTML. 
	*/
    createHighlight: function(){
		if(air.Introspector.isAppSandbox){
	        var sprite = new runtime.flash.display.Sprite();
	        sprite.mouseEnabled =  false;
	        sprite.width = 0;
	        sprite.height = 0;
	        sprite.buttonMode = true;
	        var prevent = function(element, event, isClick){
	            element.addEventListener(event, function(e){
	                if((air.Introspector.inspect||air.Introspector.remoteInspect) &&sprite.hitTestPoint(e.localX, e.localY)){
	                    e.preventDefault();
	                    e.stopPropagation();
	                    e.stopImmediatePropagation();
	                   	if(isClick&&air.Introspector.canClick){
							if(air.Introspector.remoteInspect){
								///todo:
								air.Introspector.inspectFrame.contentWindow.childSandboxBridge.air_Inspector_remoteClick();

							}else{
	                        	air.Introspector.debugWindow.finishInspect(false);
		                        air.Introspector.hideHighlight();
							}
	                    }
	                }
	            }, true, 2000000);
	        };
	        var check = function(element, event){
	            element.addEventListener(event, function(e){
	               if((air.Introspector.inspect||air.Introspector.remoteInspect)&&nativeWindow.active){
	                    setTimeout(function(){
	                        air.Introspector.canClick = true;
	                    }, 100);
	               }
	            }, true, 200000);
	        }
        
	        var labelMover = function(element, event){
	        	element.addEventListener(event, function(e){
		           if((air.Introspector.inspect||air.Introspector.remoteInspect)){
	                  air.Introspector.highlightText.x = e.stageX+15;
	                  air.Introspector.highlightText.y = e.stageY+15;
	               }else{
	                  air.Introspector.highlightText.visible = false;
	               }
	        	}, true, 200000);
	        }
	       prevent(htmlLoader.stage, runtime.flash.events.MouseEvent.CLICK, true);
	       prevent(htmlLoader.stage, runtime.flash.events.MouseEvent.MOUSE_DOWN);
	       prevent(htmlLoader.stage, runtime.flash.events.MouseEvent.MOUSE_UP);
	       prevent(htmlLoader.stage, runtime.flash.events.MouseEvent.DOUBLE_CLICK);
	       check(htmlLoader.stage, runtime.flash.events.MouseEvent.MOUSE_MOVE);
	       check(nativeWindow, runtime.flash.events.Event.ACTIVATE);
	       labelMover(htmlLoader.stage, runtime.flash.events.MouseEvent.MOUSE_MOVE);
	       window.htmlLoader.stage.addChild(sprite); 
	       air.Introspector.highlightSprite = sprite;

	       air.Introspector.highlightText = new runtime.flash.display.Sprite();
	       window.htmlLoader.stage.addChild(air.Introspector.highlightText); 

	       air.Introspector.highlightText.graphics.beginFill(0xeeeeee, 0.8);
	       air.Introspector.highlightText.graphics.lineStyle(1, 0xeeeeee, 0.9, false);
	       air.Introspector.highlightText.graphics.drawRect(0, 0, 250, 40);
	       air.Introspector.highlightText.visible = false;
	       air.Introspector.highlightLine1 = air.Introspector.createTextField(air.Introspector.highlightText, 16, true);
	       air.Introspector.highlightLine2 = air.Introspector.createTextField(air.Introspector.highlightText, 10, false);
       }else{
			//should not be here
	   }
    },
    
	drawRect: function (rect, tagName){
	    	rect.x += htmlLoader.x;
		    rect.y += htmlLoader.y;
			rect.scaleX = 1;
		    rect.scaleY = 1;
		    air.Introspector.showHighlight(rect);
		    air.Introspector.highlightSprite.graphics.clear();
		    var bgColor = air.Introspector.highlightBgColors[tagName.toLowerCase()];
		    if(typeof bgColor=='undefined')
		         bgColor = air.Introspector.highlightBgColors['default'];
		    air.Introspector.highlightSprite.graphics.beginFill(bgColor, 0.2);
		    air.Introspector.highlightSprite.graphics.lineStyle(3, bgColor, 0.9, false);
		    air.Introspector.highlightSprite.graphics.drawRect(0, 0, rect.width, rect.height);
	},
	
    highlightElement: function(e){
		var rect = air.Introspector.getBorderBox(e);
	   	if(rect==false)
			return;
	
		if(air.Introspector.isAppSandbox){			
			air.Introspector.drawRect(rect, e.tagName);
		}else{
			setTimeout(function(){
				try{
					if(!isNaN(rect.width)&&!isNaN(rect.x))
						parentSandboxBridge.air_Inspector_drawRect(rect, e.tagName);				
				}catch(e){
					air.Introspector.Console.error(e);
				}
			}, 0);
		}
    },
    
	/**
	*	Registers events on every window that includes AIRDebug.js.
	*
	*	By default F11 enables the inspect tool
	*			   F12 pops up the debug tool
	*	
	*/
	addKeyboardEvents: function(sprite){
		sprite.addEventListener(runtime.flash.events.KeyboardEvent.KEY_DOWN, function(e){
            if(e.keyCode==air.Introspector.config.introspectorKey){ //F11 key pressed
				if(air.Introspector.lastElement.nodeName=='IFRAME'||air.Introspector.lastElement.nodeName=='FRAME'){
					try{
						var contentWindow = air.Introspector.lastElement.contentWindow;
						if(typeof contentWindow.childSandboxBridge!='undefined'&&
							typeof contentWindow.childSandboxBridge.air_Inspector_isDebugOpen!='undefined'&&
							typeof contentWindow.childSandboxBridge.air_Inspector_toggleInspect!='undefined')
						{
							if(contentWindow.childSandboxBridge.air_Inspector_isDebugOpen()){
								contentWindow.childSandboxBridge.air_Inspector_toggleInspect();
								e.preventDefault();
								e.stopPropagation();
								return;	
							}
						}
					}catch(e){
						//it looks like no debugger in that iframe. go ahead with app sandbox debugger
					}
				}
                air.Introspector.init(false);
                air.Introspector.debugWindow.toggleInspect();
                e.preventDefault();
				e.stopPropagation();
            }else if(e.keyCode==air.Introspector.config.debuggerKey){ //F12 key pressed
                air.Introspector.toggleWindow();
                e.preventDefault();
				e.stopPropagation();
            }else if(e.keyCode==27&&air.Introspector.inspect){
                air.Introspector.debugWindow.finishInspect();
                air.Introspector.hideHighlight();
                e.preventDefault();
						e.stopPropagation();
            }else if(e.ctrlKey==true&&e.altKey==false){
				var tab = null;
				switch(e.keyCode){
					case runtime.flash.ui.Keyboard.NUMBER_1:
						tab = 0;
					break;
					case runtime.flash.ui.Keyboard.NUMBER_2:
						tab = 1;
					break;
					case runtime.flash.ui.Keyboard.NUMBER_3:
						tab = 2;
					break;
					case runtime.flash.ui.Keyboard.NUMBER_4:
						tab = 3;
					break;
					case runtime.flash.ui.Keyboard.NUMBER_5:
						tab = 4;
					break;
					case runtime.flash.ui.Keyboard.NUMBER_6:
						tab = 5;
					break;
				}
				if(tab!=null){
						air.Introspector.init();
						air.Introspector.debugWindow.setTab(tab);
						e.preventDefault();
						e.stopPropagation();
				}
			}
        }, true, 1000000);
	},
	
	showHighlightLabels: function(id, nodeName, outerHTML){
			if(typeof id!='undefined'&&id.length!=0){
                air.Introspector.highlightLine1.text = nodeName+' - '+id;
            }else{
                air.Introspector.highlightLine1.text = nodeName;  
            }
            if(air.Introspector.canClick){
                air.Introspector.highlightLine2.text = outerHTML.substr(0, 40).replace(/\n/g, '\\n')+'...';
            }else{
                air.Introspector.highlightLine2.text = 'Click to activate window';
                window.clearTimeout(air.Introspector.clickToActivateTimeout);
                air.Introspector.clickToActivateTimeout = setTimeout(function(){
                    air.Introspector.highlightLine2.text = outerHTML.substr(0, 40).replace(/\n/g, '\\n')+'...';
                }, 400)
            }

        	air.Introspector.highlightText.visible = true;
	},
	
	/**
	*	Registers current window in debugger
	*
	*	Captures every XHR object created and any uncaught exception 
	*	and sends it to the debugger
	*	
	*/
    register: function(){
    	
    	if (window.XMLHttpRequest && window.XMLHttpRequest.prototype){
                    window.XMLHttpRequest.prototype.debugopen = window.XMLHttpRequest.prototype.open;
					window.XMLHttpRequest.prototype.debugsend = window.XMLHttpRequest.prototype.send;
                    window.XMLHttpRequest.prototype.open = function(method, url, asyncFlag, username, password){
						if(typeof this.doNotDebug=='undefined'){
	                   	    var debugWindow = air.Introspector.findDebugWindow();
			                if(debugWindow!=null){
								debugWindow.logNet(this, method, url, asyncFlag);
			                }
						}
                        return this.debugopen(method, url, asyncFlag, username, password);
                    };
					window.XMLHttpRequest.prototype.send = function(obj){
						if(typeof this.doNotDebug=='undefined'){
	                	    var self = this;
							var debugWindow = air.Introspector.findDebugWindow();
				            if(debugWindow!=null){
						        	var a = this.onreadystatechange;
		                            this.onreadystatechange = function(){
		                            	 if (typeof a == 'function')a.call(self);
		                            	 	debugWindow.logNet(self, 'unknown', '', false);
				                    };
								if(typeof self.doNotDebug=='undefined')
		                           	 debugWindow.logNetSend(this, obj);
			                }
	                        var ret = this.debugsend(obj);
							if(debugWindow!=null){
									debugWindow.logNetSend(this, obj);
							}
							return ret;
						}else{
	                        return this.debugsend(obj);
						}
						
					}
        }

		if(air.Introspector.isAppSandbox){       
			 	window.htmlLoader.addEventListener(
						runtime.flash.events.HTMLUncaughtScriptExceptionEvent.UNCAUGHT_SCRIPT_EXCEPTION , 
						function(e){
							air.Introspector.logError(e.exceptionValue, {htmlLoader:window.htmlLoader});
							//	e.preventDefault();
			        	});
		
				air.Introspector.addKeyboardEvents(window.htmlLoader.stage);
		
		
	        	window.nativeWindow.addEventListener(air.Introspector.runtime.Event.CLOSE, function(){
		            var debugWindow = air.Introspector.findDebugWindow();
		            if(debugWindow!=null){
		                debugWindow.closedWindow(window.htmlLoader);
		            }
		        });
        
		        window.htmlLoader.addEventListener(air.Introspector.runtime.Event.COMPLETE, function(){
						try{
			           	 //announce the debugWindow to refresh DOM and assets
				            var debugWindow = air.Introspector.findDebugWindow();
				            if(debugWindow!=null){
				            	if(debugWindow.isLoaded){
				                    debugWindow.completeWindow(window.htmlLoader);
				            	}
				            }
				
							var iframes = document.getElementsByTagName('iframe');
							for(var i=iframes.length-1;i>=0;i--){
								air.Introspector.registerFrame.call(iframes[i]);
							}

							var frames = document.getElementsByTagName('frame');
							for(var i=frames.length-1;i>=0;i--){
								air.Introspector.registerFrame.call(frames[i]);				
							}

						}catch(e){
							runtime.trace(e);
				            runtime.trace(e.line);
							air.Introspector.Console.log(e);
						}
				});
				
				nativeWindow.addEventListener(air.Introspector.runtime.Event.DEACTIVATE, function(){ air.Introspector.hideHighlight(); air.Introspector.canClick =false; });
	 		    air.Introspector.createHighlight();
	        	
			}else{
				
				if(typeof childSandboxBridge=='undefined')
					childSandboxBridge={};

				childSandboxBridge.air_Inspector_remoteClick = function (){
						try{
							air.Introspector.remoteClick();
						}catch(e){ alert(e+' '+e.line); }
				}
				
				childSandboxBridge.air_Inspector_isDebugOpen = function(){
					return typeof air.Introspector.debugWindow!='undefined';
				},

				childSandboxBridge.air_Inspector_toggleInspect = function (){
					//setTimeout(function(){
						air.Introspector.init(false);
		                air.Introspector.debugWindow.toggleInspect();
					//}, 0);
				}
				
			}
			
			
			air.Introspector.waitForBody(document, function(){
		        	try{
			
						if(!air.Introspector.isAppSandbox){
							
							var consoleButton = document.createElement('input');
							consoleButton.onclick = function(){
								air.Introspector.init(true);
							}
							consoleButton.style.zIndex = 1000000;
							consoleButton.style.position = 'fixed';
							consoleButton.style.right = '10px';
							consoleButton.style.top = '10px';
							consoleButton.type = 'button';
							consoleButton.value = 'Open Introspector';
							document.body.appendChild(consoleButton);								
							
							
						}
			
						//TODO: make this on the load handler
						document.addEventListener('DOMSubtreeModified', function(e){
				            var debugWindow = air.Introspector.findDebugWindow();
				            if(debugWindow!=null){
				            	if(debugWindow.isLoaded){
									debugWindow.dom3Event(e);
				            	}
				            }
						});
						document.addEventListener('DOMCharacterDataModified', function(e){
				            var debugWindow = air.Introspector.findDebugWindow();
				            if(debugWindow!=null){
				            	if(debugWindow.isLoaded){
										debugWindow.dom3Event(e);
				            	}
				            }
						});
								
		 	           document.body.addEventListener('mouseover', function(e){
			                if(air.Introspector.inspect){
								setTimeout(function(){
									if(air.Introspector.isAppSandbox){
											if(!nativeWindow.active)
												nativeWindow.activate();
									}
				                    if(e.srcElement){
				                        air.Introspector.highlightElement(e.srcElement);
										try{
											if(air.Introspector.isAppSandbox){
												air.Introspector.showHighlightLabels(e.srcElement.id, e.srcElement.nodeName, e.srcElement.outerHTML);
											}else{
												parentSandboxBridge.air_Inspector_showHighlightLabels(e.srcElement.id, e.srcElement.nodeName, e.srcElement.outerHTML);
											}
										}catch(e){ /*air.error(e);*/ }
				                        //e.stopPropagation();
				                        //e.preventDefault();

				                        air.Introspector.init();
				                        air.Introspector.debugWindow.setInspectElement(e.srcElement);
				                       // return false;
				                    }else{
				                        air.Introspector.hideHighlight();
				                    }
						
						
								}, 0);
				             }else if(air.Introspector.isAppSandbox){
										air.Introspector.lastElement = e.srcElement;
									}
								 
			            }, true);

					document.body.addEventListener('mouseout', function(e){
							//air.Introspector.hideHighlight();
		            });

				}catch(e){
					if(air.Introspector.isAppSandbox){ 
						runtime.trace(e);
		            	runtime.trace(e.line);
					}
					air.Introspector.Console.log(e);
	            }
	     });

	
    },
	
	registerFrame: function(){
		var frame = this;
		//if(typeof frame.contentWindow.parentSandboxBridge=='undefined')
			frame.contentWindow.parentSandboxBridge = {};

		frame.contentWindow.parentSandboxBridge.air_Inspector_hideHighlight = function(){
				air.Introspector.hideHighlight();
		};
			
		frame.contentWindow.parentSandboxBridge.air_Inspector_showHighlight = function(rect){
				air.Introspector.showHighlight(rect);
		};
			
		frame.contentWindow.parentSandboxBridge.air_Inspector_drawRect = function(rect, tagName){
				var frameRect = air.Introspector.getBorderBox(frame);
				var blw = air.Introspector.getIntProp(frame, "border-left-width");
                var btw = air.Introspector.getIntProp(frame, "border-top-width");
				if(frameRect==null) return;
				rect.x+=frameRect.x+2*blw;
				rect.y+=frameRect.y+2*btw;
				air.Introspector.drawRect(rect, tagName);
		};

		frame.contentWindow.parentSandboxBridge.air_Inspector_setInspect = function(enabled){
				air.Introspector.inspectFrame = enabled?frame:null;
				air.Introspector.remoteInspect = enabled;
		};
		frame.contentWindow.parentSandboxBridge.air_Inspector_getWindowTitle = function(){
			return document.title;
		};
		frame.contentWindow.parentSandboxBridge.air_Inspector_checkNativeWindow = function(title){
			var htmlWindows = air.Introspector.runtime.NativeApplication.nativeApplication.openedWindows;
			for(var i=htmlWindows.length-1;i>=0;i--){
				if(htmlWindows[i].title==title){
					return true;
				}
			}
			return false;
		};
		
		frame.contentWindow.parentSandboxBridge.air_Inspector_showHighlightLabels = function(id, nodeName, outerHTML){
			air.Introspector.showHighlightLabels(id, nodeName, outerHTML);
		};
		
		frame.contentWindow.parentSandboxBridge.air_Inspector_getFrameId = function(){

			return frame.id;
		}
	},

	waitForBody: function(document, callback){
		if(document.body){
			callback();
		}else{
			setTimeout(air.Introspector.waitForBody, 10, document, callback);
		}
	},
    
	/**
	*	Shows/Hides the debug tool
	*/
    toggleWindow:function(){
        air.Introspector.init(true, false);
        air.Introspector.debugWindow.nativeWindow.visible ^= true;
    },
	
	/**
	*	Makes sure the debug tool is enabled
	*/
    init: function(showLoader, toggle){
		if(!air.Introspector.canInit())
			return;
	
		if(typeof showLoader=='undefined') showLoader = false;
		if(typeof toggle=='undefined') toggle = true;
	
		if(air.Introspector.isAppSandbox){
			if(typeof air.Introspector.debugWindow=='undefined' || air.Introspector.debugWindow.nativeWindow.closed){
				delete air.Introspector.debugWindow;
	           var debugWindow = air.Introspector.findDebugWindow();
	           if(debugWindow!=null && !debugWindow.nativeWindow.closed){
	               air.Introspector.debugWindow = debugWindow;
				if(toggle){
					air.Introspector.debugWindow.nativeWindow.visible = true;			   
					if(!showLoader){
						nativeWindow.activate();
					}
				}
	           }else{
				   air.Introspector.debugWindow = new air.Introspector.DebugWindow ({activateDebug: showLoader});
	           }
	        }else{
				if(toggle){
					if(showLoader){
						air.Introspector.debugWindow.nativeWindow.activate(); 
					}
				}
			}
		}else{
			
			if(typeof air.Introspector.debugWindow=='undefined'||
				(air.Introspector.debugWindow.isWindowCreated&&air.Introspector.debugWindow.isLoaded && air.Introspector.debugWindow.window 
						&&!parentSandboxBridge.air_Inspector_checkNativeWindow(air.Introspector.parentWindowTitle + ': '+air.Introspector.debugWindow.window.document.title))){
				delete air.Introspector.debugWindow;
				air.Introspector.debugWindow = new air.Introspector.DebugWindow ({activateDebug: showLoader, activeWindow: window});
			}else if(!air.Introspector.debugWindow.isWindowCreated){
				air.Introspector.debugWindow.tryCreateWindow();
			}
		}
    },
    
	/**
	*	Try to find a debugWindow on any other window
	*/
    findDebugWindow: function(){
		if(air.Introspector.isAppSandbox){
			try{
	    		if(air.Introspector.debugWindow&&air.Introspector.debugWindow.nativeWindow.closed==false)
		    	   return air.Introspector.debugWindow;
			}catch(e){
			}
			try{
		        var htmlWindows = air.Introspector.getHtmlWindows();
		        for(var i=htmlWindows.length-1;i>=0;i--){
		            try{
		                if(typeof htmlWindows[i].htmlLoader.window.air!='undefined'
		                   && typeof htmlWindows[i].htmlLoader.window.air.Introspector!='undefined'
		                       && typeof htmlWindows[i].htmlLoader.window.air.Introspector.debugWindow!='undefined'
								&& htmlWindows[i].htmlLoader.window.air.Introspector.debugWindow.nativeWindow.closed==false )
		                    {
		                        return htmlWindows[i].htmlLoader.window.air.Introspector.debugWindow;
		                    }
		            }catch(e){
		                //this window is not initialized yet
		                //just get next window
		            }
		        }
			}catch(e){}
		}else{
			return air.Introspector.debugWindow;
		}
        return null;
    },

    formats : { 'png':1, 'gif':1, 'zip':1, 'air':1, 'jpg':1, 'jpeg':1,
                 'txt':0, 'html':0, 'js':0, 'xml':0, 'opml':0, 'css':0, 'htm':0 },
    
	canInit: function(){
/*		if(!air.Introspector.isAppSandbox&&typeof parentSandboxBridge=='undefined'){
			alert('You need to include AIRIntrospector.js in application sandbox too!');
			return false;
		}*/
		return true;
	},

	logArguments: function(args, config){
		if(!air.Introspector.canInit()) return;
       	air.Introspector.init(config.type=='error');
        air.Introspector.debugWindow.logArguments(args, config);
    },
    
    logError: function(error, config){
        air.Introspector.init(false);
        air.Introspector.debugWindow.logError(error, config);
    },
    
	showCssElement: function(element){
		var debugWindow = air.Introspector.findDebugWindow();
		if(debugWindow){
			debugWindow.showCssElement(element);
		}
	},

	/**
	*	Finds the first HTMLLoader in flash display object list
	*/
    findLoader: function (stage){
        for(var i=stage.numChildren-1;i>=0;i--){
            var child = stage.getChildAt(i);
            if(child.toString()=='[object HTMLLoader]'){
                return child;
            }
        }
        return null;
    }, 
    
	/**
	*	Returns an array of all HTML windows
	*/
    getHtmlWindows: function(){
		if(air.Introspector.isAppSandbox){
 	       var windowNodes = [];
	        var windows = air.Introspector.runtime.NativeApplication.nativeApplication.openedWindows;
	        for(var i=windows.length-1;i>=0;i--){
	            var loader = air.Introspector.findLoader(windows[i].stage);
	            if(loader!=null){
	                windowNodes.push({
	                    nativeWindow: windows[i],
	                    stage: windows[i].stage,
	                    htmlLoader : loader
	                });
	            }
	        }
	        return windowNodes;
		}else{
			//should not be here
			return [];
		}
   },
   
	/**
	*	int 2 string with two digits
	*/
   twoDigits: function(val){
        if(val<10) return '0'+val;
        return val+'';
   },
	/**
	*	Escapes html in order to display it in html
	*/
   escapeHtml: function(html){      
        return (html+'').replace(/&/g, '&amp;').replace(/"/g, "&quot;").replace(/</g, '&lt;').replace(/>/g, '&gt;');
   },

   tree: { },
   
   /**
	*	Try to find the precise position of the dom element node
	*	This is extracted from spry framework and removed support for other browsers.
	*/
   
   camelize : function(stringToCamelize)
            {
                if (stringToCamelize.indexOf('-') == -1){
                    return stringToCamelize;    
                }
                var oStringList = stringToCamelize.split('-');
                var isFirstEntry = true;
                var camelizedString = '';
            
                for(var i=0; i < oStringList.length; i++)
                {
                    if(oStringList[i].length>0)
                    {
                        if(isFirstEntry)
                        {
                            camelizedString = oStringList[i];
                            isFirstEntry = false;
                        }
                        else
                        {
                            var s = oStringList[i];
                            camelizedString += s.charAt(0).toUpperCase() + s.substring(1);
                        }
                    }
                }
            
                return camelizedString;
            },
   getStyleProp : function(element, prop)
            {
                var value;
                try
                {
                    if (element.style)
                        value = element.style[air.Introspector.camelize(prop)];
            
                    if (!value)
                    {
                        if (document.defaultView && document.defaultView.getComputedStyle)
                        {
                            var css = document.defaultView.getComputedStyle(element, null);
                            value = css ? css.getPropertyValue(prop) : null;
                        }
                        else if (element.currentStyle) 
                        {
                                value = element.currentStyle[air.Introspector.camelize(prop)];
                        }
                    }
                }
                catch (e) {}
            
                return value == 'auto' ? null : value;
            },
   getIntProp : function(element, prop){
                var a = parseInt(air.Introspector.getStyleProp(element, prop),10);
                if (isNaN(a))
                    return 0;
                return a;
            },
   getBorderBox : function (el, doc) {
                doc = doc || document;
                if (typeof(el) == 'string') {
                    el = doc.getElementById(el);
                }
            
                if (!el) {
                    return false;
                }
            
                if (el.parentNode === null || air.Introspector.getStyleProp(el, 'display') == 'none') {
                    //element must be visible to have a box
                    return false;
                }
            
                var ret = {x:0, y:0, width:0, height:0};
                var parent = null;
                var box;
            
                ret.x = el.offsetLeft;
                ret.y = el.offsetTop;
                ret.width = el.offsetWidth;
                ret.height = el.offsetHeight;
				parent = el.offsetParent;
                if (parent != el) {
                    while (parent) {
                        ret.x += parent.offsetLeft;
                        ret.y += parent.offsetTop;
                        parent = parent.offsetParent;
                    }
                }

                var blw = air.Introspector.getIntProp(el, "border-left-width");
                var btw = air.Introspector.getIntProp(el, "border-top-width");
                ret.x -= blw;
                ret.y -= btw;
                // opera & (safari absolute) incorrectly account for body offsetTop
                if (air.Introspector.getStyleProp(el, 'position') == 'absolute')
                    ret.y -= doc.body.offsetTop;
                    
                if (el.parentNode)
                    parent = el.parentNode;
                else
                    parent = null;
                
				if (parent!=null&&parent.nodeName){
                    var cas = parent.nodeName.toUpperCase();
                    while (parent && cas != 'BODY' && cas != 'HTML') {
                        cas = parent.nodeName.toUpperCase();
                        ret.x -= parent.scrollLeft;
                        ret.y -= parent.scrollTop;
                        if (parent.parentNode)
                            parent = parent.parentNode;
                        else
                            parent = null;
                    }
                }

				ret.y -= el.ownerDocument.body.scrollTop;
				ret.x -= el.ownerDocument.body.scrollLeft;				

                // adjust the margin
                var gi = air.Introspector.getIntProp;
                var btw = gi(el, "margin-top");
                var blw = gi(el, "margin-left");
                var bbw = gi(el, "margin-bottom");
                var brw = gi(el, "margin-right");
                ret.x -= blw;
                ret.y -= btw;
                ret.height += btw + bbw;
                ret.width += blw + brw;

			//	air.Introspector.Console.log(ret);
                return ret;
            }
});


air.Introspector.tree.node = function(nodeLabel, config){
    this.nodeLabel = nodeLabel;
    this.openable = true;
    this.nodeLabel2 = '';
    this.items = [];
    this.editable = false;
    
    if(typeof config!='undefined')
       air.Introspector.extend(this, config);
    this.unselectOnBlur = true;
    this.created = false;
    this.opened = false;
    this.shouldOpenFlag = false;
    this.shouldSelectFlag = false;
    
};

air.Introspector.tree.node.openedTagMac = '<div>&gt;</div>';//'&rarr;';
air.Introspector.tree.node.closedTagMac = '<div>&or;</div>';//'&darr;';

air.Introspector.tree.node.openedTagWin = '<div>+</div>';//'&rarr;';
air.Introspector.tree.node.closedTagWin = '<div>-</div>';//'&darr;';


air.Introspector.tree.node.putDisposeInPrototype = function(e){
	e.prototype.dispose = air.Introspector.tree.node.prototype.dispose;
	e.prototype.clearItems = air.Introspector.tree.node.prototype.clearItems;
	e.prototype.clearListeners = air.Introspector.tree.node.prototype.clearListeners;	
	e.prototype.registerListener = air.Introspector.tree.node.prototype.registerListener;
	e.prototype.registerEvents = air.Introspector.tree.node.prototype.registerEvents;
	e.prototype.select = air.Introspector.tree.node.prototype.select;
	e.prototype.unselect = air.Introspector.tree.node.prototype.unselect;
}

air.Introspector.tree.node.prototype={
    onshow: function(){
        //dummy function overriden by config
    },
    
    onclick: function(){
        //dummy function overriden by config
    },
    
    onhide: function(){
        //dummy function overriden by config
    },

	onselect: function(){
		
	},    

    toggle: function(){
        if(this.opened){
            this.hide();
        }else{
            this.show();
        }
    },
    
    shouldOpen: function(){
        this.opened = true;
        this.shouldOpenFlag=true;
    },
    
    shouldSelect: function(value){
        if(typeof value=='undefined') value=true;
        this.shouldSelectFlag = value;
    },
    
	select: function(throwEvent){
        this.shouldSelectFlag = true;
		if(this.nodeLabelDiv){
        	this.nodeLabelDiv.className='treeLabel'+ (this.shouldSelectFlag?' selectedTreeLabel':'');	
		}
		if(this.element){
			this.element.focus();
		}
		if((typeof throwEvent=='undefined'||throwEvent)&&this.onselect)
			this.onselect(this);
	},

	unselect: function(){
        this.shouldSelectFlag = false;
		if(this.nodeLabelDiv)	
        	this.nodeLabelDiv.className='treeLabel';
	},

	clearItems: function(){
		if(this.items){
			for(var i=this.items.length-1;i>=0;i--){
				try{
					this.items[i].dispose();
				}catch(e){ air.Introspector.Console.log(e);}
				this.items[i]=null;
			}
			this.items.length=0;
		}
	},
	clearListeners: function(){
		if(this.listeners){
			for(var i=this.listeners.length-1;i>=0;i--){
				var listener = this.listeners[i];
				listener.element.removeEventListener(listener.ev, listener.fn, listener.capture);
				listener.fn = null;
				this.listeners[i]=null;
			}
		}
		delete this.listeners;
	},
	dispose: function(){
		this.clearItems();
		this.clearListeners();
		var self = this;
		for(var i in self){
			self[i] = null;
		}
	},
	
	registerListener:function(element, ev, fn, capture){
		if(!this.listeners){
			this.listeners = [];
		}

		this.listeners.push({element:element, ev:ev, fn: fn, capture:capture});		
		element.addEventListener(ev, fn, capture);		
	},

	showElements: function(){
		this.opened = true;
        this.onshow(this);
		this.refreshNodeAnchor();
        this.refreshChildren();	
	},
    show: function(){
        if(!this.openable)
          return;
		this.showElements();        
        
        if(air.Introspector.tree.node.traceElement){
        	air.Introspector.tree.node.traceElement.className = air.Introspector.tree.node.traceElement.className.replace(/ selected2Tree/g, '');
        }
        this.element.className += ' selected2Tree';
        air.Introspector.tree.node.traceElement = this.element;
        var self = this;
        setTimeout(function(){
			if(self.element)
        		self.element.className = self.element.className.replace(/ selected2Tree/g, '');
        },1500);
        air.Introspector.tree.node.traceElement = this.element;
        
        //this.nodeChildren.scrollIntoViewIfNeeded();
        this.element.scrollIntoViewIfNeeded();
        
        
    },
    refresh: function(){
		this.clearListeners();
		if(this.element){
			var oldElement = this.element;
			this.createDiv(oldElement.ownerDocument);
			oldElement.parentNode.replaceChild(this.element, oldElement);
		}
	},
    refreshChildren: function(){
        if(this.created){
            if(this.shouldOpenFlag){
                this.onshow(this);
                this.shouldOpenFlag = false;
            }
            
            var document = this.element.ownerDocument;
            /*if(this.nodeChildren!=null){
                this.element.removeChild(this.nodeChildren);
                this.nodeChildren = null;
            }*/
            var nodeChildren = this.nodeChildren;// document.createElement('div');
            nodeChildren.innerHTML = '';
            this.nodeChildren.className = 'treeChildren';
            for(var i=0;i<this.items.length;i++){
                 var childElement = this.items[i].createDiv(document, true);
				 this.items[i].registerEvents(this, i);
                 nodeChildren.appendChild(childElement);
            }
            //this.element.appendChild(nodeChildren);
            //this.nodeChildren = nodeChildren;
			if(this.nodeEndLabelDiv)
	            this.nodeEndLabelDiv.className = 'nodeEndLabelDivVisible';
        }
    },

	registerEvents: function(parentNode, index){
		this.parentNode = parentNode;
		this.parentIndex = index;
		var self = this;
		if(this.unselectOnBlur)
		{
			this.registerListener(this.element, 'blur', function(){
				self.unselect();
			});
		}
		var findFirstElement = function(node){
			if(node==null) return null;
			if(!node.items) return node;
			if(!node.opened) return node;			
			if(node.items.length==0) return node;
			return node.items[0];
			//return findFirstElement(node.items[0]);	
		};
		var findLastElement = function(node){
			if(node==null) return null;
			if(!node.items) return node;
			if(!node.opened) return node;			
			if(node.items.length==0) return node;
			return findLastElement(node.items[node.items.length-1]);			
		};

		var findNextParent = function(node){
			if(node==null||node.parentNode==null||node.parentNode.parentNode==null) return null;
			if(node.parentNode.parentNode&&node.parentNode.parentNode.items.length>node.parentNode.parentIndex+1)
				return node.parentNode.parentNode.items[node.parentNode.parentIndex+1];
			return findNextParent(node.parentNode);
		}
		
		this.registerListener(this.element, 'keydown', function(ev){
			var stopPropagation = true;
			switch(ev.keyIdentifier){
				case 'Left':
					if(self.opened){
						if(self.hide)
							self.hide();
					}
				break;
				case 'Right':
					if(!self.opened){
						if(self.show)
							self.show();
					}
				break;
				case 'Up':
					if(self.parentNode){
						self.unselect();
						if(self.parentIndex==0){
							self.parentNode.select();
						}else{
							var element = findLastElement(self.parentNode.items[self.parentIndex-1]);
							if(element){
								element.select();
							}
							else
								self.parentNode.items[self.parentIndex-1].select();
						}
					}
				break;
				case 'Down':
					if(self.parentNode){
						var element = findFirstElement(self);
						if(element!=null&&element!=self){
							self.unselect();
							element.select();
						}else if(self.parentIndex+1>=self.parentNode.items.length){
							var element = findNextParent(self);
							if(element){
								self.unselect();
								element.select();
							}
						}else{
							self.unselect();
							self.parentNode.items[self.parentIndex+1].select();
						}
					}else{
						if(self.items.length>0){
							self.unselect();
							self.items[0].select();
						}
					}
				break;
				case 'Enter':
					setTimeout(function(){
						if(self.editable){
							self.toggleEdit();
						}
					}, 0);
				break;
				default:
					stopPropagation = false;
			}
			if(stopPropagation){
//				runtime.trace(ev.keyIdentifier);
				ev.stopPropagation();
			}
		});
	},
    
    refreshLabel : function(){
       if(this.created){
           this.nodeLabelDiv.innerHTML = air.Introspector.escapeHtml(this.nodeLabel);
           this.nodeLabel2Div.innerHTML = air.Introspector.escapeHtml(this.nodeLabel2);
       }
    },
    
    hide: function(){
        if(!this.openable)
          return;
        this.opened = false;
        this.onhide(this);
		this.refreshNodeAnchor();
        /*if(this.nodeChildren!=null){
            this.element.removeChild(this.nodeChildren);
            this.nodeChildren = null;
        }*/
        
        if(air.Introspector.tree.node.traceElement){
            air.Introspector.tree.node.traceElement.className = air.Introspector.tree.node.traceElement.className.replace(/ selected2Tree/g, '');
            air.Introspector.tree.node.traceElement = null;
        }
        this.element.className = this.element.className.replace(/ selected2Tree/g, '');
        this.nodeChildren.innerHTML = '';
        this.nodeChildren.className = '';
        
        if(this.nodeEndLabelDiv)
            this.nodeEndLabelDiv.className = 'nodeEndLabelDiv';
    },
    
    showHover: function(visible){
        if(visible){
           this.element.className+=' hover';    
        }else{
           this.element.className = this.element.className.replace(/ hover/g, '');
        }
    },
    toggleEdit: function(toggle){
        if(!this.editVisible&&typeof toggle=='undefined'){
            this.element.className += ' editing';
            this.nodeEdit.value = this.getEditValue();
	        this.editVisible = true;
            this.nodeEdit.focus();	
        }else if(this.editVisible){
            this.element.className = this.element.className.replace(' editing', '');

            if(toggle){
                 this.setEditValue(this.nodeEdit.value);
            }else{
	             this.editVisible = false;
			}

			var self = this;
			
			setTimeout(function(){
				self.select();
            	self.editVisible = false;
			}, 0);

        }
    },
    
	refreshNodeAnchor: function(){
		if(!this.nodeAnchor) return;
		if(!this.openable){
			this.nodeAnchor.innerHTML= '';
			this.nodeAnchor.className = 'treeNodeEmpty';
		}else if(!air.Introspector.isAppSandbox){
				this.nodeAnchor.innerHTML = this.opened?air.Introspector.tree.node.closedTagMac:air.Introspector.tree.node.openedTagMac;
				this.nodeAnchor.className='treeAnchorMac';	
		}else if(air.Introspector.runtime.Capabilities.os.substr(0,3).toLowerCase() == 'mac'){
			this.nodeAnchor.innerHTML = this.opened?air.Introspector.tree.node.closedTagMac:air.Introspector.tree.node.openedTagMac;
			this.nodeAnchor.className='treeAnchorMac';
		}else{
			this.nodeAnchor.innerHTML = this.opened?air.Introspector.tree.node.closedTagWin:air.Introspector.tree.node.openedTagWin;
			this.nodeAnchor.className='treeAnchorWin';
		}
		
	},
	
    createDiv: function(document, isChild){
        var self = this;
        var element = document.createElement('a');
		element.href= "javascript:void(0)";
	
        element.className='treeNode';
        this.element = element;
        
        var nodeLabelDiv = document.createElement('div');
        nodeLabelDiv.innerHTML = air.Introspector.escapeHtml(this.nodeLabel);
        nodeLabelDiv.className='treeLabel'+ (this.shouldSelectFlag?' selectedTreeLabel':'');
        if(this.openable){
           this.registerListener(nodeLabelDiv, 'click', function(e){ self.toggle();self.onclick(); 	self.select(); } );
        }else{
           this.registerListener(nodeLabelDiv, 'click', function(e){ self.onclick(); 	self.select(); } );
        }
        this.registerListener(nodeLabelDiv, 'mouseover', function(e){ self.showHover(true) } );
        this.registerListener(nodeLabelDiv, 'mouseout', function(e){ self.showHover(false) } );
        
        element.appendChild(nodeLabelDiv);
        this.nodeLabelDiv = nodeLabelDiv;
        
        var nodeLabel2 = document.createElement('div');
        nodeLabel2.innerHTML = air.Introspector.escapeHtml(this.nodeLabel2);
        nodeLabel2.className='treeLabel2';
        if(this.openable){
            this.registerListener(nodeLabel2, 'click', function(e){ self.toggle() } );
        }else if(this.editable){
            this.editVisible = false;
            this.registerListener(nodeLabel2, 'click', function(e){ self.toggleEdit() } );
            var nodeEdit = document.createElement('input');
            nodeEdit.value = '';
            nodeEdit.className = 'treeEdit';
            element.appendChild(nodeEdit);
            
            this.registerListener(nodeEdit, 'blur', function(e){  self.toggleEdit(true); } );
            this.registerListener(nodeEdit, 'keypress', function(e){ if(e.keyCode == 13) { self.toggleEdit(true); return false;}  else if(e.keyCode == 27){ self.toggleEdit(false); return false;}} );
            this.nodeEdit = nodeEdit;
        }
        this.registerListener(nodeLabel2, 'mouseover', function(e){ self.showHover(true) } );
        this.registerListener(nodeLabel2, 'mouseout', function(e){ self.showHover(false) } );
        
        element.appendChild(nodeLabel2);
        this.nodeLabel2Div = nodeLabel2;
        
        var nodeAnchor = document.createElement('div');
        this.nodeAnchor = nodeAnchor;
		this.refreshNodeAnchor();
        element.appendChild(nodeAnchor);
        this.registerListener(nodeAnchor, 'click', function(e){ self.toggle() } );
        //nodeAnchor.style.visibility = this.openable?'visible':'hidden';

        this.created = true;
        
        
        var nodeChildren =  document.createElement('div');
        
        element.appendChild(nodeChildren);
        this.nodeChildren = nodeChildren;
        
        if(this.opened){
           this.refreshChildren();
        }
        
		setTimeout(function(){
			if(self.shouldSelectFlag)
				self.element.focus();
	
		}, 0);
	
		if(!isChild){
			this.registerEvents(null, 0);
		}
        return element;
    }
};


air.Introspector.tree.textNode = function(value){
    this.nodeValue = value;
};

air.Introspector.tree.textNode.prototype = {
    createDiv: function(document){
	    var element = document.createElement('a');
		element.href= "javascript:void(0)";
	    element.className='treeText';
	    
	    var elementText = document.createElement('div');
	    elementText.className='treePreText';
	    var elementLines = document.createElement('div');
	    elementLines.className='treePreLine';
	    var splitText = air.Introspector.blockWrap(this.nodeValue);
	    elementText.innerHTML = '<pre>'+air.Introspector.escapeHtml(splitText[0])+'\n\n </pre>';
	    
	    elementLines.innerHTML = '<pre>'+splitText[1]+'</pre>';
	    
	    element.appendChild(elementLines);
	    element.appendChild(elementText);
	    
	    this.element = element;
	    this.elementText = elementText;
        this.elementLines = elementLines;
	    return element;
    }
};

air.Introspector.tree.node.putDisposeInPrototype(air.Introspector.tree.textNode);

air.Introspector.tree.textDownloadNode = function(file){
    this.file = file;
};

air.Introspector.tree.textDownloadNode.prototype = {
    createDiv: function(document){
        var element = document.createElement('a');
		element.href= "javascript:void(0)";
        element.className='treeText';
        
        var elementText = document.createElement('div');
        elementText.className='treePreText';
        var elementLines = document.createElement('div');
        elementLines.className='treePreLine';
        
        elementText.innerHTML ='Loading...';
        
        
        element.appendChild(elementLines);
        element.appendChild(elementText);
        if(air.Introspector.isAppSandbox){
        	var scriptLoader = new air.Introspector.runtime.URLLoader();
	        scriptLoader.addEventListener(air.Introspector.runtime.Event.COMPLETE, function(e){
	        	    var value = air.Introspector.blockWrap(scriptLoader.data);
		        	elementText.innerHTML = '<pre>'+air.Introspector.escapeHtml(value[0])+'\n\n</pre>';
			        elementLines.innerHTML = '<pre>'+value[1]+'</pre>';
					scriptLoader = null;
		        });
			scriptLoader.addEventListener(air.Introspector.runtime.IOErrorEvent.IO_ERROR, function(e){
				var value = air.Introspector.blockWrap(e+'');
	        	elementText.innerHTML = '<pre>'+air.Introspector.escapeHtml(value[0])+'\n\n</pre>';
		        elementLines.innerHTML = '<pre>'+value[1]+'</pre>';	
				air.Introspector.logError(e);
			});
			scriptLoader.load(new air.Introspector.runtime.URLRequest(this.file));
		}else{
			var self = this;
			var xhr = new XMLHttpRequest();
			xhr.doNotDebug = true;
			xhr.onreadystatechange = function(){
				if(this.readyState == 4){
				 	if(this.status == 200) {
						var value = air.Introspector.blockWrap(xhr.responseText);
			        	elementText.innerHTML = '<pre>'+air.Introspector.escapeHtml(value[0])+'\n\n</pre>';
				        elementLines.innerHTML = '<pre>'+value[1]+'</pre>';
					}else{
						var value = air.Introspector.blockWrap('Error reading file "'+self.file+'"');
			        	elementText.innerHTML = '<pre>'+air.Introspector.escapeHtml(value[0])+'\n\n</pre>';
				        elementLines.innerHTML = '<pre>'+value[1]+'</pre>';
					}
					xhr = null;
				}
			};
			xhr.open('GET', this.file, true);
			xhr.send();
		}
        this.element = element;
        this.elementText = elementText;
        this.elementLines = elementLines;
        return element;
    }
};
air.Introspector.tree.node.putDisposeInPrototype(air.Introspector.tree.textDownloadNode);

air.Introspector.tree.imageDownloadNode = function(file){
    this.file = file;
};

air.Introspector.tree.imageDownloadNode.prototype = {
    createDiv: function(document){
        var element = document.createElement('a');
		element.href= "javascript:void(0)";
        element.className='treeImage';
        var imgElement = document.createElement('img');
        imgElement.src = this.file;
        element.appendChild(imgElement);
        this.element = element;
        this.imgElement = imgElement;
        return element;
    }
};
air.Introspector.tree.node.putDisposeInPrototype(air.Introspector.tree.imageDownloadNode);

air.Introspector.tree.domNode = function(domNode, config){
   this.domNode = domNode;
   air.Introspector.tree.node.call(this, '', config);
   this.openable = true;
   this.unselectOnBlur = false;
};

air.Introspector.tree.domNode.prototype = {
	createAttribute: function(document, att){
		var element = document.createElement('span');
		
		element.appendChild(document.createTextNode(' '));
		
		 var tagName = document.createElement('span');
         tagName.className = 'tagDomNodeAttribute';
         tagName.innerHTML = att.nodeName;
         element.appendChild(tagName);
		 element.appendChild(document.createTextNode('="'));
		
		var editor = new air.Introspector.tree.inPlaceEditor(function(){ return att.nodeValue.replace(/\n/g, '\\n') }, 
		function(value){att.nodeValue = value.replace(/\\n/g, '\n')});
		this.registerEditor(editor);
		element.appendChild(editor.createDiv(document));
		element.appendChild(document.createTextNode('"'));
		return element;
	},
	registerEditor: function(editor){
		if(!this.editors)
			this.editors = [];
		this.editors.push(editor);
	},
	clearEditors: function(){
		if(this.editors){
			for(var i=this.editors.length-1;i>=0;i--){
				this.editors[i].dispose();
			}
		}
	},
	dispose: function(){
		this.clearEditors();
		air.Introspector.tree.node.prototype.dispose.call(this);
	},
	showDomHover:function(visible){
		//air.Introspector.init();
		if(visible){
			air.Introspector.debugWindow.highlight(this.domNode);
		}else{
			air.Introspector.debugWindow.highlight();
		}
	},
	onselect: function(){
	   air.Introspector.showCssElement(this.domNode);	
	},
    createDiv: function(document, isChild){
         var self = this;
        var element = document.createElement('a');
		element.href= "javascript:void(0)";
        element.className='treeNode domTreeNode';
        this.element = element;
        
        var nodeLabelDiv = document.createElement('div');
        var nodeEndLabelDiv = null;
        //should add parameters here
        //nodeLabelDiv.innerHTML = air.Introspector.escapeHtml(this.domNode.nodeName);
        var shouldAddEndTag = false;
        
        switch(this.domNode.nodeType){
        	case Node.DOCUMENT_NODE:
        	case Node.ELEMENT_NODE:
		        nodeLabelDiv.appendChild(document.createTextNode('<'));
		        var tagName = document.createElement('span');
		        tagName.className = 'tagDomNodeName';
				var nodeName = this.domNode.nodeName;
				if(this.domNode.nodeType==Node.DOCUMENT_NODE)
		 		    nodeName = 'Root';
	 		    tagName.innerHTML = nodeName;
		        nodeLabelDiv.appendChild(tagName);
		        var atts  = this.domNode.attributes;
		        if(atts&&atts.length>0){
		        	nodeLabelDiv.appendChild(document.createTextNode(' '));
		             for(var i=0;i<atts.length;i++){
		                nodeLabelDiv.appendChild(this.createAttribute(document, atts[i]));
		             }
		        }
		        if(this.domNode.hasChildNodes()){
		        	shouldAddEndTag = this.domNode.firstChild.nextSibling!=null || this.domNode.firstChild.nodeType!=Node.TEXT_NODE;
		        	if(!shouldAddEndTag){
		        		nodeLabelDiv.appendChild(document.createTextNode('>'));
		        		var editor = new air.Introspector.tree.inPlaceEditor(function(){ return self.domNode.firstChild.nodeValue.replace(/\n/g, '\\n') }, 
                            function(value){self.domNode.firstChild.nodeValue = value.replace(/\\n/g, '\n')});
							this.registerEditor(editor);
                        nodeLabelDiv.appendChild(editor.createDiv(document));
                        
                        var endTagName = document.createElement('span');
                        endTagName.className = 'tagDomNodeName';
                        endTagName.innerHTML = nodeName;
                        nodeLabelDiv.appendChild(document.createTextNode('</'));
                        nodeLabelDiv.appendChild(endTagName);
		        		nodeLabelDiv.appendChild(document.createTextNode('>'));
		
		
		        	}else{
		        		 nodeLabelDiv.appendChild(document.createTextNode('>'));
		        	}
		        }else{
		        	   nodeLabelDiv.appendChild(document.createTextNode('/>'));
		        }
	            this.openable = shouldAddEndTag;
	            if(shouldAddEndTag){
	                    nodeEndLabelDiv = document.createElement('div');
                	    nodeEndLabelDiv.className = this.opened?'nodeEndLabelDivVisible':'nodeEndLabelDiv';
	            	    var endTagName = document.createElement('span');
                        endTagName.className = 'tagDomNodeName';
                        endTagName.innerHTML = nodeName;
                        
                        nodeEndLabelDiv.appendChild(document.createTextNode('</'));
                        nodeEndLabelDiv.appendChild(endTagName);
                        nodeEndLabelDiv.appendChild(document.createTextNode('>'));
                       
	            	
                   // nodeLabelDiv.addEventListener('click', function(e){ self.toggle(); e.stopPropagation(); } );
                    var nodeAnchor = document.createElement('div');
			        element.appendChild(nodeAnchor);

					
			        this.registerListener(nodeAnchor, 'mouseover', function(e){ self.showDomHover(true);  self.showHover(true); e.stopPropagation();} );
                    this.registerListener(nodeAnchor, 'mouseout', function(e){ self.showDomHover(false);  self.showHover(false); e.stopPropagation(); } );
        			this.nodeAnchor = nodeAnchor;
					this.refreshNodeAnchor();
					
			        this.registerListener(nodeEndLabelDiv, 'mouseover', function(e){ self.showDomHover(true);  self.showHover(true); e.stopPropagation();} );
                    this.registerListener(nodeEndLabelDiv, 'mouseout', function(e){ self.showDomHover(false);  self.showHover(false); e.stopPropagation(); } );

                    this.registerListener(nodeAnchor, 'click', function(e){ self.select(); self.toggle(); e.stopPropagation(); } );
					if(this.domNode.nodeType==Node.DOCUMENT_NODE)
						this.shouldOpen();
                }else{
                	this.opened = false;
                }
            break;
            case Node.TEXT_NODE:
               var editor = new air.Introspector.tree.inPlaceEditor(function(){ return self.domNode.nodeValue.replace(/\n/g, '\\n') }, 
                            function(value){self.domNode.nodeValue = value.replace(/\\n/g, '\n')});
                            
               nodeLabelDiv.appendChild(editor.createDiv(document));
               this.openable = false;
               this.opened = false;
        	break;
			default:
				nodeLabelDiv.appendChild(document.createTextNode('<'));
		        var tagName = document.createElement('span');
		        tagName.className = 'tagDomNodeName';
	 		    tagName.innerHTML = this.domNode.nodeName;
		        nodeLabelDiv.appendChild(tagName);
				nodeLabelDiv.appendChild(document.createTextNode('>'));
			break;
        }
        
         /*var child = this.domNode.firstChild;
         while(child)
         {
                node.items.push(this.createDomTreeNode(child)); //, this.createGetter(obj, i), this.createSetter(obj, i)));
                child = child.nextSibling;
         }*/   
        
        nodeLabelDiv.className='treeLabel' + (this.shouldSelectFlag?' selectedTreeLabel':'');
        
       this.registerListener( nodeLabelDiv, 'mouseover', function(e){ self.showDomHover(true);  self.showHover(true); e.stopPropagation(); }, true );
       this.registerListener(nodeLabelDiv, 'mouseout', function(e){ self.showDomHover(false);  self.showHover(false); e.stopPropagation(); }, true );

        element.appendChild(nodeLabelDiv);
        this.nodeLabelDiv = nodeLabelDiv;

       this.registerListener(nodeLabelDiv, 'click', function(e){
			self.select();
			   //self.toggle();
				self.show();
               air.Introspector.debugWindow.showDomElementPath(self.domNode);
		});
        
        this.registerListener(element, 'dblclick', function(e){
			   	e.stopPropagation();  
				self.toggle();
				self.select();
               //air.Introspector.debugWindow.gotoConsoleTab();
//               air.Introspector.debugWindow.showDomElementPath(self.domNode);
                } );
        
        
        //nodeAnchor.style.visibility = this.openable?'visible':'hidden';

        this.created = true;
        
        
        var nodeChildren =  document.createElement('div');
        element.appendChild(nodeChildren);
        this.nodeChildren = nodeChildren;
        
        if(nodeEndLabelDiv){
			this.registerListener(nodeEndLabelDiv, 'click', function(e){
//					self.toggle();
					self.select();
	               air.Introspector.debugWindow.showDomElementPath(self.domNode);
			});
	 		element.appendChild(nodeEndLabelDiv);
		}
        this.nodeEndLabelDiv = nodeEndLabelDiv;
        
        if(this.opened){
          this.refreshChildren();
        }
       
 		if(!isChild){
			this.registerEvents(null, 0);
		}
		
        return element;
    }
};

air.Introspector.tree.domNode.prototype.__proto__ = air.Introspector.tree.node.prototype;

air.Introspector.tree.inPlaceEditor = function(getter, setter, className){
    this.getter = getter;
    this.setter = setter; 
    if(typeof className!='undefined'){
        this.className = ' '+className;
    }else{
        this.className = '';
    }
};

air.Introspector.tree.inPlaceEditor.prototype = {
	noZeroLength: function(e){
		try{
		  var str = e+'';
		  if(air.Introspector.trim(e).length==0){
		  	return '[Empty string - click to edit]';
		  }
		  return str;
		}catch(e){
			return e+'';
		}
	},
	onclick: function(value){
		var self = this;
		if(this.state==0){//not editing
		  var editor = document.createElement('input');
		  editor.type = 'text';
		
		  try{
	         editor.value = this.getter();
	      }catch(e){
	         editor.value = e;  
	      }
	
          editor.style.width = this.element.clientWidth+'px';
		  this.editor = editor;
		  this.element.innerHTML = '';
		  this.element.appendChild(editor);
		  
		  this.registerListener(editor,'dblclick', function(e){
                        e.stopPropagation(); 
          }, true );
		  this.registerListener(editor, 'click', function(e){ e.stopPropagation(); }, true );
		  this.registerListener(editor, 'keypress', function(e){ if(e.keyCode == 13) { self.onclick(); return false;}  else if(e.keyCode == 27){ self.onclick(false); return false;}} );
		  this.registerListener(editor, 'blur', function(){ if(self.state==1) self.onclick(); } );
		  editor.focus();
		}else{ //editing mode
			//set the value to setter
			if(typeof value=='undefined'){
			  try{
	            this.setter(this.editor.value);		  
			  }catch(e){
			  }
			}
		  setTimeout(function(){
		      try{
	            self.element.innerHTML = self.noZeroLength(air.Introspector.escapeHtml(self.getter()));
		      }catch(e){
		        //self.element.innerHTML = air.Introspector.escapeHtml(e);  
		      } 
	      }, 100);
		}
		this.state ^= 1;
	},
    createDiv: function(document){
		var element = document.createElement('div');
        element.className='inPlaceEditor'+this.className;

    	var self = this;
    	this.state = 0; //not editing

        
        try{
            element.innerHTML = this.noZeroLength(air.Introspector.escapeHtml(this.getter()));
        }catch(e){
            element.innerHTML = air.Introspector.escapeHtml(e);	
        }
        
        this.registerListener(element, 'click', function(e){ if(self.state==0) self.onclick(); e.stopPropagation(); } , true );
        
      //  element.addEventListener('dblclick', function(e){
      //                  e.stopPropagation(); 
      //          }, true );
        
        
        this.element = element;
        return element;
    }
};
air.Introspector.tree.node.putDisposeInPrototype(air.Introspector.tree.inPlaceEditor);

air.Introspector.split = function(element, leftElement, rightElement, firstWidth, minWidth){
	this.element = element;
	this.leftElement = leftElement;
	this.rightElement = rightElement;
	var self = this;
	this.dragging = false;
	
	this.element.style.right = (firstWidth)+'px';
	this.leftElement.style.right = (firstWidth+this.element.clientWidth)+'px';
	this.rightElement.style.width = (firstWidth)+'px';	
	this.firstWidth = firstWidth;
	this.minWidth = minWidth;
	if(air.Introspector.isAppSandbox){
		this.element.ownerDocument.defaultView.nativeWindow.stage.addEventListener(runtime.flash.events.MouseEvent.MOUSE_MOVE, function(ev){
			self.mousemove(ev);
		}, true);
	}else{
		this.element.ownerDocument.addEventListener("mousemove", function(ev){self.mousemove(ev);}, true);
	}
	this.element.ownerDocument.addEventListener("mouseup", function(ev){ self.mouseup(ev); }, true);
	this.element.addEventListener("mousedown", function(ev){self.mousedown(ev)}, true);		
};

air.Introspector.split.prototype = {
	mousemove:function(ev){
		if(this.dragging){
			if(air.Introspector.isAppSandbox){
				var delta = this.firstX-ev.localX;
			}else{
				var delta = this.firstX-ev.clientX;
			}
				
			var currentWidth = this.firstWidth + delta;

			if(currentWidth<this.minWidth){
				currentWidth=this.minWidth;
			}
			
			this.currentWidth = currentWidth;
			this.element.style.right = (currentWidth)+'px';
			this.leftElement.style.right = (currentWidth+this.element.clientWidth)+'px';
			this.rightElement.style.width = (currentWidth)+'px';	
			if(air.Introspector.isAppSandbox){
				ev.stopImmediatePropagation();
			}
			ev.stopPropagation();	
			ev.preventDefault();
		}
	},
	mousedown: function(ev){
		this.dragging = true;
		this.firstX = ev.clientX;
		this.currentWidth = this.firstWidth;
		ev.stopPropagation();		
		ev.preventDefault();
	},
	mouseup: function(ev){
		if(this.dragging){

			this.dragging = false;
			this.firstWidth = this.currentWidth;
			ev.stopPropagation();
			ev.preventDefault();
		}
	}
}

air.Introspector.DebugWindow = function(config){
    var self = this;
    this.logLines = [];
    this.domList = [];
    this.isLoaded =  false;

	if(air.Introspector.isAppSandbox){
    	this.activeWindow = air.Introspector.runtime.NativeApplication.nativeApplication.activeWindow;
	}else{
		//will get it from config later
		this.activeWindow = null;
	}

    this.isInspecting = false;
    this.evalHistory = [];
    this.evalHistoryPos = -1;
    this.selectedTab = 'console';
    this.scrollDisabled = false;
    this.requestLog = [];
    this.activeTab = 0;
    this.tabs = ['console', 'html2', 'dom','assets','source','net'];
	this.cssTabs = ['css2Dom', 'css2Style', 'css2Box'];
	this.activeCssTab = 0;
	this.activateDebug = false;
	this.isWindowCreated = false;
    //var initOptions = new air.Introspector.runtime.NativeWindowInitOptions();
    //initOptions.transparent = true;
    //initOptions.systemChrome = "none";
    if(typeof config!='undefined'){
		air.Introspector.extend(this, config);
	}
	
	if(air.Introspector.isAppSandbox){
	    this.htmlLoader = air.Introspector.runtime.HTMLLoader.createRootWindow(false/*, initOptions*/);
	    this.htmlLoader.addEventListener(air.Introspector.runtime.Event.COMPLETE, function(){try{ self.init(); } catch (e){ air.Introspector.runtime.trace(e); air.Introspector.runtime.trace(e.line); }});
	    this.htmlLoader.addEventListener(air.Introspector.runtime.Event.HTML_DOM_INITIALIZE, function(){
	    	try{ 
				self.htmlLoader.window.air = { debug: { debugWindow: self, isAppSandbox: true  } }; 
				self.htmlLoader.window.debugWindow = self; 
				self.window = self.htmlLoader.window; 
			}catch(e){ 
				air.Introspector.runtime.trace(e); 
				air.Introspector.runtime.trace(e.line); 
			}
		});
	    this.nativeWindow = this.htmlLoader.stage.nativeWindow;
		this.nativeWindow.width = 640;
		this.nativeWindow.height = 480;
	    this.htmlLoader.addEventListener(runtime.flash.events.HTMLUncaughtScriptExceptionEvent.UNCAUGHT_SCRIPT_EXCEPTION, function(e){
	         air.Introspector.logError(e.exceptionValue, {htmlLoader: self.htmlLoader});
	         e.preventDefault();
	    });
	    if(typeof air.Introspector.config.useAirDebugHtml=='undefined'||air.Introspector.config.useAirDebugHtml==false){
	        this.htmlLoader.loadString(this.contentString);
	    }else{
	        this.htmlLoader.load(new air.Introspector.runtime.URLRequest('app:/DebugUI.html'));
	    }
	}else{
		this.iframeId = '';
		this.tryCreateWindow();	
	}
}




air.Introspector.DebugWindow.prototype = 
{
	tryCreateWindow: function(){
		try{
			var self = this;

			if(typeof this.activeWindow.parentSandboxBridge=='undefined')
				return;

			air.Introspector.parentWindowTitle = this.activeWindow.parentSandboxBridge.air_Inspector_getWindowTitle();

			if(typeof this.activeWindow.parentSandboxBridge!='undefined'&&typeof this.activeWindow.parentSandboxBridge.air_Inspector_getFrameId!='undefined')
				this.iframeId  = this.activeWindow.parentSandboxBridge.air_Inspector_getFrameId();

			if(typeof air.Introspector.config.useAirDebugHtml=='undefined'||air.Introspector.config.useAirDebugHtml==false){
				this.window = window.open('about:blank', 'debugger', 'width=640,height=480,resizable=1');
				this.window.document.write(this.contentString);
				this.window.opener = this.activeWindow;	
				this.window.document.close();
			}else{
				this.window = window.open('DebugUI.html', 'debugger', 'width=640,height=480,resizable=1');
			}

			if(typeof this.window!='undefined'){
				this.isWindowCreated = true;

			}
		}catch(e){
			//parentsandboxbridge not loaded
		}
	},
	
    init: function(window){
		if(typeof window!='undefined'){
			this.window = window;
			this.htmlLoader = { window: this.window };
			this.window.document.title = 'Remote Sandbox - frame id="'+ this.iframeId+'"';
		}
		
		
		this.consoleDiv = this.htmlLoader.window.document.getElementById('console');
        this.windowsDiv = this.htmlLoader.window.document.getElementById('windowList');
        this.tabLabels = this.htmlLoader.window.document.getElementById('tabLabels');

//        this.consoleTabLabel = this.htmlLoader.window.document.getElementById('consoleTabLabel');
//        this.html2TabLabel = this.htmlLoader.window.document.getElementById('html2TabLabel');
  
        this.evalConsoleText = this.htmlLoader.window.document.getElementById('evalConsoleText');
        this.tabPages = this.htmlLoader.window.document.getElementById('tabPages');

        this.cssTabLabels = this.htmlLoader.window.document.getElementById('css2TabLabels');
        this.cssTabPages = this.htmlLoader.window.document.getElementById('css2TabPages');


        this.domDiv = this.htmlLoader.window.document.getElementById('domTab');
        //this.htmlDiv = this.htmlLoader.window.document.getElementById('htmlTab');
        this.netTabDiv = this.htmlLoader.window.document.getElementById('netTab');
        this.html2TabDiv = this.htmlLoader.window.document.getElementById('html2Tab');
		this.html2Div = this.htmlLoader.window.document.getElementById('html2Div');
		this.html2Split = this.htmlLoader.window.document.getElementById('html2Split');
		this.css2Div = this.htmlLoader.window.document.getElementById('css2Div');
		this.css2SplitObj = new air.Introspector.split(this.html2Split, this.html2Div, this.css2Div , 300, 150);
        this.assetsTabDiv = this.htmlLoader.window.document.getElementById('assetsTab');
        this.sourcesTabDiv = this.htmlLoader.window.document.getElementById('sourceTab');
        this.inspectToolLabel = this.htmlLoader.window.document.getElementById('inspectToolLabel');
       
		this.css2DomTab = this.htmlLoader.window.document.getElementById('css2DomTab');
		this.css2StyleTab = this.htmlLoader.window.document.getElementById('css2StyleTab');
		
		this.refreshActiveWindowButton = this.htmlLoader.window.document.getElementById('refreshActiveWindow');
//		this.css2BoxTab = this.htmlLoader.window.document.getElementById('css2BoxTab');		

 		if(this.isInspecting){
            this.inspectToolLabel.className+=' selected';
        }else{
            this.finishInspect();
        }

        var self = this;
        this.consoleDiv.addEventListener('scroll', function(){self.scrollDisabled = self.consoleDiv.scrollTop != self.consoleDiv.scrollHeight-self.consoleDiv.clientHeight;});
        
		this.activateTab();
		this.activateCssTab();

        
        this.isLoaded = true;
        if(this.logLines.length>0){
            this.refreshConsole();
        }
        
        if(this.requestLog.length>0){
            this.refreshNetConsole();
        }
        

 		this.refreshWindows();
        
		if(air.Introspector.isAppSandbox){
	        this.nativeWindow.visible = true;
	        if(this.activeWindow&&this.activateDebug==false)
	        {
	            try{
	               this.activeWindow.activate();
	//               this.activeDebugWindow.orderToFront();
	            }catch(e){
	            }
	        }
	        this.nativeWindow.width = 640;
	        this.nativeWindow.height = 480;
		   air.Introspector.addKeyboardEvents(this.htmlLoader.stage);
        }

       this.refreshDomPanel();

    },

	
	
    refreshWindows: function(){
        if(air.Introspector.isAppSandbox){
	        this.ownedWindows = air.Introspector.getHtmlWindows();
	        this.windowsDiv.options.length = 0;
			var windowsCount = 0;
			var activeWindowFound = false;
			var firstWindow = null;
	        for(var i=this.ownedWindows.length-1;i>=0;i--){
	            if(this.ownedWindows[i].nativeWindow==this.nativeWindow) continue;
				try{
					if((this.ownedWindows[i].htmlLoader.window.alert+'').indexOf("[native code]")<0) continue;
				}catch(e){ continue; }
					windowsCount ++;
				firstWindow = this.ownedWindows[i].nativeWindow;
				if(this.ownedWindows[i].nativeWindow==this.activeWindow)
					activeWindowFound = true;
	           var selected = this.ownedWindows[i].nativeWindow==this.activeWindow;
	           var option = new Option(this.ownedWindows[i].nativeWindow.title, i, selected, selected);
	           this.windowsDiv.options.add(option);
	        }
			if(windowsCount==0){
				if(air.Introspector.runtime.NativeApplication.nativeApplication.autoExit
						&&air.Introspector.config.closeDebuggerOnExit)
//					air.Introspector.runtime.NativeApplication.nativeApplication.exit();
					return;
			}
			if(!activeWindowFound){
				this.activeWindow = firstWindow;
				this.windowsDiv.options[0].selected = true;
				this.activeHtmlLoader = null;
			}
	        this.refreshDomPanel();
	        this.createAssetsTree();
	        this.createSourcesTree();
		}else{
			this.windowsDiv.style.display='none';
			this.refreshActiveWindowButton.value='Refresh';
			 this.refreshDomPanel();
		     this.createAssetsTree();
		     this.createSourcesTree();
		}
    },

	
    
    refreshDomPanel: function(){
        this.makeDomDiv();
        this.makeHtmlDiv();
    },
    
    makeDomDiv: function(){
        this.domDiv.innerHTML = '';
		if(this.domDivNode){
			this.domDivNode.dispose();
			this.domDivNode = null;
		}
        try{
            var htmlLoader = this.getActiveHtmlLoader();
			
			var node = this.createJsTreeNode('window', htmlLoader.window);
            var treeDiv = node.createDiv(this.htmlLoader.window.document);
			this.domDivNode = node;
            this.domDiv.appendChild(treeDiv);
        }catch(e){
        }
    },
    
    makeHtmlDiv:function(){
		if(!this.isLoaded) return;
        try{
          var htmlLoader = this.getActiveHtmlLoader();
          if(htmlLoader!=null){
	          /*this.htmlDiv.innerHTML = '';
	          var domTreeDiv = this.createDomTreeNode(htmlLoader.window.document).createDiv(this.htmlLoader.window.document);
	          this.htmlDiv.appendChild(domTreeDiv);*/
	          this.html2Div.innerHTML = '';
				if(this.html2Node){
					this.html2Node.dispose();
					this.html2Node = null;
				}

	          if(htmlLoader.window.document&&htmlLoader.window.document.firstChild){
				    var node = this.createDom2TreeNode(htmlLoader.window.document);
	                var domTreeDiv = node.createDiv(this.htmlLoader.window.document);
					this.html2Node = node;
	          		this.html2Div.appendChild(domTreeDiv);					
	          }

          }
        }catch(e){
        	air.Introspector.Console.log(e);
        }
    },
    
    completeWindow: function(htmlLoader){
        //clear dom related to this htmlLoader
        var self = this;
        var activeHtmlLoader = this.getActiveHtmlLoader();
        if(activeHtmlLoader==htmlLoader){
            this.createAssetsTree();
            this.createSourcesTree();
        }else{
            this.refreshWindows();
        }
    },
    
    
    loadUrl: function(url, callback){
    	var loader = new air.Introspector.runtime.URLLoader();
        loader.addEventListener(air.Introspector.runtime.Event.COMPLETE, function(e)
        {
        	callback(loader.data);
        });
        loader.load(new air.Introspector.runtime.URLRequest(activeHtmlLoader.location));
    },
    
    createLinksTree: function(document){
    	return function(){
    		var alreadyAdded = {};
	    	this.items = [];
	    	for(var i=0;i<document.links.length;i++){
	    		if(alreadyAdded[document.links[i].href]) continue;
	    		if(document.links[i].name&&document.links[i].name.length!=0){
	    		     var node = new air.Introspector.tree.node(document.links[i].name, { nodeLabel2: document.links[i].href, openable:false});
	    		}else{
	    			 var node = new air.Introspector.tree.node(document.links[i].href, { nodeLabel2: '', openable:false});
	    		}
	    		this.items.push(node);
	    		alreadyAdded[document.links[i].href]=true;
	    	}
    	};
    },
    
    createImagesTree: function(document){
        return function(){
        	var alreadyAdded = {};
            this.items = [];
            for(var i=0;i<document.images.length;i++){
            	if(alreadyAdded[document.images[i].src]) continue;
                var node = new air.Introspector.tree.node(document.images[i].src, {
                    src : document.images[i].src,
                    onshow:function(){
                        if(this.items.length==0){
                               this.items = [ new air.Introspector.tree.imageDownloadNode(this.src) ];
                        }       
                    }, onhide: function(){
                    	//this.items.length = 0;
						this.clearItems();
                    }
                });
                this.items.push(node);
                alreadyAdded[document.images[i].src] = true;
            }
        };
    },


    createCssTree: function(document){
        return function(){
            this.items = [];
            for(var i=0;i<document.styleSheets.length;i++){
        		var node;
                if(document.styleSheets[i].href){
                	node = new air.Introspector.tree.node (document.styleSheets[i].href, {
                        src : document.styleSheets[i].href,
                        onshow:function(){
                            if(this.items.length==0)
                                  this.items = [ new air.Introspector.tree.textDownloadNode(this.src) ];       
                        }
                    });
                }else{
                	 node = new air.Introspector.tree.node ('<style>', {
                        text: document.styleSheets[i].ownerNode.innerHTML,
                        onshow:function(){
                            if(this.items.length==0)
                                this.items = [ new air.Introspector.tree.textNode(this.text) ];        
                        }
                    }); 
                }
                this.items.push(node);
            }
        };
    },
    

    createProjectTree: function(){
		if(air.Introspector.isAppSandbox){
	    	var formats = air.Introspector.formats;
	    	var extendTree = function(parentNode, file){
	            this.items = [];
	            var files = file.getDirectoryListing();
	            for(var i=0;i<files.length;i++){
	                var node;
	                if(files[i].isDirectory){
	                     node = new air.Introspector.tree.node (files[i].name  , {
	                        src : files[i],
	                        onshow:function(){
	                            extendTree(this, this.src);
	                        },
	                        onhide:function(){
	                        	//this.items.length=0;
								this.clearItems();
	                        }
	                    });
	                }else{
	                	    node = new air.Introspector.tree.node (files[i].name , {
		                        src : 'file:///'+files[i].nativePath,
								format: formats[files[i].extension], 
		                        onshow:function(){
		                            if(this.items.length==0){
		                            	if(this.format==0){
		                                  this.items = [ new air.Introspector.tree.textDownloadNode(this.src) ];
		                            	}else if(this.format==1){
		                            	   this.items = [ new air.Introspector.tree.imageDownloadNode(this.src) ];
		                            	}
		                            }       
		                        }
		                    });
	                }
	                parentNode.items.push(node);
	            }
	        };
        
	        node = new air.Introspector.tree.node ('Application files'  , {
	                        src : runtime.flash.filesystem.File.applicationDirectory,
	                        onshow:function(){
	                            extendTree(this, this.src);
	                        },
	                        onhide:function(){
	                            //this.items.length=0;
								this.clearItems();
	                        }
	                    });
	        return node;
		}else{
			return null;
		}
    },
        

    createScriptsTree: function(document){
        return  function(){
            this.items = [];
            for(var i=0;i<document.scripts.length;i++){
				var node;
            	if(document.scripts[i].src){
            		node = new air.Introspector.tree.node (document.scripts[i].src, {
            			src : document.scripts[i].src,
            			onshow:function(){
		    				if(this.items.length==0){
								if(this.src.length>=3&&this.src.substr(this.src.length-3).toLowerCase()=='swf'){
									this.items = [ new air.Introspector.tree.textNode("SWF file") ];        
								}else{
									this.items = [ new air.Introspector.tree.textDownloadNode(this.src) ];		
								}
							}
            			}
            		});
            	}else{
                    node = new air.Introspector.tree.node ('<script>', {
                    	text: document.scripts[i].innerText,
                    	onshow:function(){
                    		if(this.items.length==0)
                                this.items = [ new air.Introspector.tree.textNode(this.text) ];        
                        }
                    });	
            	}
                this.items.push(node);       
            }
        };
        
    },    
    
    createAssetsTree: function(){
        this.assetsTabDiv.innerHTML = '';
		if(this.assetsTabDivNode){
			this.assetsTabDivNode.dispose();
			this.assetsTabDivNode = null;
		}
        var activeHtmlLoader = this.getActiveHtmlLoader();
        if(activeHtmlLoader!=null){
	        var document = activeHtmlLoader.window.document;
			if(!document)return;
	        var self = this;
	        var node = new air.Introspector.tree.node("Assets",{
	            onshow: function(){
	                  this.items = [
	                      new air.Introspector.tree.node("Links",{openable:document.links.length!=0,  onshow:  self.createLinksTree(document) } ),
	                      new air.Introspector.tree.node("Images",{openable:document.images.length!=0, onshow: self.createImagesTree(document) } ),
	                      new air.Introspector.tree.node("CSS ("+document.styleSheets.length+')',{openable:document.styleSheets.length!=0, onshow:  self.createCssTree(document) } ),
	                      new air.Introspector.tree.node("JS ("+document.scripts.length+')',{openable:document.scripts.length!=0, onshow:  self.createScriptsTree(document) } ),
	                  ];
	            },
	            onhide: function(){
	            	//this.items.length = 0;
					this.clearItems();
	            }
	        });
	        node.shouldOpen();
			this.assetsTabDivNode = node;
	        this.assetsTabDiv.appendChild(node.createDiv(this.htmlLoader.window.document));
        }

    },
    
    createSourcesTree: function(){
        this.sourcesTabDiv.innerHTML = '';

		if(this.sourceTabDivNodes){
			for(var i=this.sourceTabDivNodes.length-1;i>=0;i--){
				if(this.sourceTabDivNodes[i]){
					this.sourceTabDivNodes[i].dispose();
					this.sourceTabDivNodes[i] = null;
				}
			}
			this.sourceTabDivNodes = null;
		}
		
		this.sourceTabDivNodes = [];
        var activeHtmlLoader = this.getActiveHtmlLoader();
        if(activeHtmlLoader!=null){
            var document = activeHtmlLoader.window.document;
            var self = this;
            var node = new air.Introspector.tree.node("Actual source",{
            	src: activeHtmlLoader.window.location, 
                onshow: function(){
                    this.items = [ new air.Introspector.tree.textDownloadNode(this.src) ]; 
                },
                onhide: function(){
                    //this.items.length = 0;
					this.clearItems();
                }
            });
			this.sourceTabDivNodes.push(node);
            this.sourcesTabDiv.appendChild(node.createDiv(this.htmlLoader.window.document));
            
            var node = new air.Introspector.tree.node("Parsed source",{
            	//text: ,
                onshow: function(){
                  this.items = [ new air.Introspector.tree.textNode(document.firstChild.outerHTML) ];    
                },
                onhide: function(){
                    //this.items.length = 0;
					this.clearItems();
                }
            });
			this.sourceTabDivNodes.push(node);
            this.sourcesTabDiv.appendChild(node.createDiv(this.htmlLoader.window.document));

			if(air.Introspector.isAppSandbox){
  	            var node = this.createProjectTree();
				this.sourceTabDivNodes.push(node);
	            this.sourcesTabDiv.appendChild(node.createDiv(this.htmlLoader.window.document));
			}
        }
    },
    
    closedWindow: function(htmlLoader){
		var self = this;
		setTimeout(function(){
        	self.refreshWindows();
		}, 100);
    },

	dom3Event: function(ev){
		var node = ev.srcElement;
		if(node.nodeType!=Node.DOCUMENT_NODE&&node.nodeType!=Node.ELEMENT_NODE){
			node = node.parentNode;
			if(!node) return;
		}
		
			var i = this.findDomListElement(node);
			if(i!=-1&&this.domList[i].node2)
			{
				var node2 = this.domList[i].node2;
				if(this.domList[i].node2.opened){
					node2.clearItems();
					node2.onshow(node2);
				}
				node2.refresh();
				ev.stopPropagation();
				
				this.openVisibleDomTags();
			}

		
	},
    
    findDomListElement: function(element){
        var list = this.domList;
        for(var i=list.length-1;i>=0;i--){
            if(list[i].element==element)
              return i;
        }
        return -1;
    },
    
    removeDomListElement: function(element){
        var index =  this.findDomListElement(element);
        if(index==-1)
           return;
        this.domList.splice(index, 1);
        
        var child = element.firstChild;
        while(child)
        {
           this.removeDomListElement(child);
           child = child.nextSibling;
        }    
    },
    
    isNumberObject: function(obj){
        try{
            //can we catch isNaN only for NaN
            return (obj+0==obj&&!isNaN(obj));
        }catch(e){
        }
        return false;
    },
    isStringObject: function(obj){
        try{
            return (typeof(obj.match) != "undefined" && obj.match.toString().indexOf("[native code]")>0);
        }catch(e){
        }
        return false;
    },
    isArgumentsObject: function(obj){
        try{
            return obj.toString()=='[object Arguments]';
        }catch(e){
        }
        return false;
    },
    isXMLObject: function(obj){
    	try{
    		if(obj.xmlVersion&&obj.firstChild!=null)
            	return obj.xmlVersion!='';
        }catch(e){
        }
        return false;
    },
    isArrayObject: function(obj){
        try{
            return (typeof(obj.push) != "undefined" && obj.push.toString().indexOf("[native code]")>0);
        }catch(e){
        }
        return false;
    },
    isItemNative: function(obj){
        try{
            return (typeof(obj.item) != "undefined" && obj.item.toString().indexOf("[native code]")>0);
        }catch(e){
        }
        return false;
    },

    
     extendDom2TreeNode: function(node, obj){
	
        try{
            var self = this;
            node.items.length = 0;
            if(typeof obj=='undefined'||obj==null)
               return;
             var child = obj.firstChild;
             while(child)
             {
//             	if(child.nodeType==Node.ELEMENT_NODE||child.nodeType==Node.TEXT_NODE){
             		if(child.nodeType==Node.TEXT_NODE){
             			var value = air.Introspector.trim(child.nodeValue);
             			if(value.length==0)
             			{   
             				child = child.nextSibling;
             			    continue;
             			}
             		}
                    node.items.push(this.createDom2TreeNode(child)); 
//             	}else{
//					air.Introspector.Console.log(child);
//				}
                child = child.nextSibling;
             }
        }catch(e){
            this.logError(e);
        }
    },
    
    createDom2TreeNode : function(child){
        var self = this;
        
        var config = {
              editable:false,
              openable:false,
                onshow: function(sender){
                    var domListIndex = self.findDomListElement(child);
                    if(domListIndex!=-1){
                         self.domList[domListIndex].opened = true;
                    }
                    self.extendDom2TreeNode(sender, child);
                }, 
                onhide: function(sender){
                    self.removeDomListElement(child); //also remove children
                    //this.items.length = 0;
					this.clearItems();
                }
            };
        var node = new air.Introspector.tree.domNode(child, config);
       
        var domListIndex = this.findDomListElement(child);
        if(domListIndex!=-1){
            this.domList[domListIndex].node2 = node;
            if(this.domList[domListIndex].opened)
                node.shouldOpen();
            if(this.domList[domListIndex].selected)
                node.shouldSelect();
        }else{
            this.domList.push({
                element:child, 
                node2: node,
                node: null,
                opened: false,
                selected: false
            });
        }
        
        return node;
    },
        
    createDomElementPath: function(element, first){
		var ret = false;
        if(typeof first=='undefined') first = false;
        var domListIndex = this.findDomListElement(element);
        if(domListIndex==-1){
            this.domList.push({
                element:element, 
//                node: null, 
                node2 :null,
                opened: true, 
                selected: first
            });
			ret=true;
        }else if(!first){
			if(this.domList[domListIndex].node2){
				if(!this.domList[domListIndex].node2.opened && this.domList[domListIndex].node2.showElements)
					this.domList[domListIndex].node2.showElements();
			}else{
				ret = true;
			}
            this.domList[domListIndex].opened = true;
        }else{
            this.domList[domListIndex].selected = true;
			if(this.domList[domListIndex].node2&&this.domList[domListIndex].node2.select){
				this.domList[domListIndex].node2.select(false);
			}else{
				ret = true;
			}
        }
        
        var parentNode = element.parentNode;
        if(parentNode){
            ret|=this.createDomElementPath(parentNode);
        }
		return ret;
    },
    
    showDomElementPath: function(element){
        var list = this.domList;
        for(var i=list.length-1;i>=0;i--){
            list[i].selected = false;
			if(list[i].node2&&list[i].node2.unselect){
				list[i].node2.unselect();
			}
        }
        var shouldRecreate = this.createDomElementPath(element, true);
        
        var htmlLoader = this.getActiveHtmlLoader();
        if(htmlLoader!=null&&htmlLoader.window.document==element.ownerDocument){
			if(shouldRecreate){
            	this.makeHtmlDiv(); 	
			}
        }else{
        	this.setActiveWindowByDocument(element.ownerDocument);
        }
        
       
		this.scrollSelectedDomItemIntoView();
    },
	
	putInList: function(element){
		var domListIndex = this.findDomListElement(element);
        if(domListIndex!=-1){
			this.domList[domListIndex].opened = true;
		}
	},
	
	openVisibleDomTags: function(){
//		this.scrollSelectedDomItemIntoView();
//		return;
		var list = this.domList;
		var clone = [];
		 for(var i=list.length-1;i>=0;i--)
			clone.push(list[i].element);
		 for(var i=clone.length-1;i>=0;i--){
			var element = clone[i];
			var parentNode = element.parentNode;
			if(parentNode){
	            this.putInList(parentNode);
			}
		}
	},

    scrollSelectedDomItemIntoView: function(){
		 var list = this.domList;
		 for(var i=list.length-1;i>=0;i--){
	            if(list[i].selected){
	            	if(list[i].node2){
						if(list[i].node2.nodeLabelDiv)
							list[i].node2.nodeLabelDiv.scrollIntoViewIfNeeded();
						else if(list[i].node2.element)
	            			list[i].node2.element.scrollIntoViewIfNeeded();
	            		//air.Introspector.Console.log(list[i].node2);
	            		//air.Introspector.Console.log(this.html2Div);
						break;
	            	}
	            }
	        }
	},
	
    extendTreeNode: function(node, obj){
        try{
            var self = this;
            node.items.length = 0;
            if(typeof obj=='undefined'||obj==null)
               return;
            if(this.isXMLObject(obj)){
            	this.extendDom2TreeNode(node, obj);
            	return;
            }  
            var isItemNative = this.isItemNative(obj);
            var parseArray = this.isArrayObject(obj)||this.isArgumentsObject(obj)||isItemNative;
            var parseHash =  !parseArray || isItemNative;
            if (parseArray){
				var l = obj.length;
            	for(var i=0;i<l;i++){
                    var value;
                    try{
                        value = obj[i];
                    }catch(e){
                        value = e;
                    }
                    node.items.push(this.createJsTreeNode(i, value, this.createGetter(obj, i), this.createSetter(obj, i)));             
                }
            } 
            if(parseHash) {
                for(var i in obj){
                    var value;
                    try{
                        value = obj[i];
                    }catch(e){
                        value = e;
                    }
                    node.items.push(this.createJsTreeNode(i, value, this.createGetter(obj, i), this.createSetter(obj, i)));
                }
            }

			if(air.Introspector.config.debugRuntimeObjects){
				try{
					var typeDescription = runtime.flash.utils.describeType(obj);
					if(!this.domParser) this.domParser = new DOMParser();
					var typeXml = this.domParser.parseFromString(typeDescription, "text/xml");
					var child = typeXml.firstChild.firstChild;
					while(child){
						if(child.nodeName=='accessor'||child.nodeName=='constant'||child.nodeName=='method'||child.nodeName=='variable'){
							var name = child.getAttribute('name');
							if(name!=null && name!='prototype'){
			                    try{
									node.items.push(this.createJsTreeNode(name, obj[name], this.createGetter(obj, name), this.createSetter(obj, name)));		
			                    }catch(e){
									node.items.push(this.createJsTreeNode(name, '', this.createGetter(obj, name), this.createSetter(obj, name), e));
			                    }
							}
						}
						child = child.nextSibling;
					}
				}catch(e){
					//just hide the error
				}
            }
            node.items.sort(function(node1, node2){
            	var isNode1Number = parseInt(node1.nodeLabel)==node1.nodeLabel;
            	var isNode2Number = parseInt(node2.nodeLabel)==node2.nodeLabel;
            	if(isNode1Number&&isNode2Number){
            		return parseInt(node1.nodeLabel)-parseInt(node2.nodeLabel);
            	}
            	if(isNode1Number){
            		return -1;
            	}
            	if(isNode2Number){
            		return 1;
            	}
            	if(node1.nodeLabel.toLowerCase()==node2.nodeLabel.toLowerCase())
                   return 0;
                if(node1.nodeLabel.toLowerCase()<node2.nodeLabel.toLowerCase())
                   return -1;
                return 1;
            });
        }catch(e){
            this.logError(e);
        }
    },
    
    createGetter: function(obj, i){
        return function(){ 
           try{
               return obj[i];
           }catch(e){}
        }
    },
    
    createSetter: function(obj, i){
        return function(value){ 
           try{
               obj[i] = value;
           }catch(e){}
        }
    },
    
	createCssTreeNode: function (stringValue, element){
		var self = this;
		var config = {
              editable:false,
                onshow: function(sender){
                    self.extendCssTreeNode(sender, element);
                }, 
                onhide: function(sender){
                    //this.items.length = 0;
					this.clearItems();
                }
            };
		 return new air.Introspector.tree.node(stringValue,config);
	},

 
	extendCssTreeNode: function(node, element){
		try{
			var self = this;
			if(!element.ownerDocument || !element.ownerDocument.defaultView) return;
			var obj = element.ownerDocument.defaultView.getComputedStyle(element);
			if(obj){
				var l = obj.length;
				for(var i=0;i<l;i++){
	                var value;
	                try{
	                    value = obj[obj[i]];
	                }catch(e){
	                    value = e;
	                }
	                node.items.push(this.createJsTreeNode(obj[i], value));
	            }
			}
		}catch(e){
			this.logError(e);
		}
	},
	
    createJsTreeNode : function(stringValue, value, getter, setter, error){
        var self = this;
        
        var config = {
              editable:false,
                onshow: function(sender){
                    self.extendTreeNode(sender, value);
                }, 
                onhide: function(sender){
					this.clearItems();
//                    this.items.length = 0;
                },
                onclick: function(sender){
                	if(typeof getter!='undefined'){
                	   self.clicked = getter();
                	}
                },
                getEditValue: function(){
                    if(typeof getter!='undefined')
                    {
                        switch(this.valueType){
                            case 0:
                               return getter();
                            case 1:
                               return getter().replace(/\n/g, "\\n");
                        }
                    }
                },
                setEditValue: function(value)
                {
                    if(typeof setter!='undefined'){
                        switch(this.valueType){
                            case 0:
                            var lowerCaseValue = value.toLowerCase();
                            if(lowerCaseValue=='true')
                              setter(true);
                            else if(lowerCaseValue=='false')
                              setter(false);
                            else
                              setter(parseFloat(value));
                            break;
                            case 1:
                             setter(value.replace(/\\n/g, "\n"));
                            break;
                     }
                     setTimeout(function(self){
                        if(typeof getter!='undefined'){
                                var value = getter();
                                if(typeof value!='undefined'&&value!=null){
                                  switch(self.valueType){
                                    case 0:
                                     self.nodeLabel2 = value;
                                     break;
                                    case 1:
                                     var newValue = value.replace(/\n/g, "\\n");
                                     if(newValue.length == 0) newValue = '[empty string - click to edit]';
                                         else newValue = '"'+newValue +'"';
                                     self.nodeLabel2 = newValue;
                                     break;
                                  }
                                  self.refreshLabel();
                                }
                           }
                       },0,this);
                    }
                }
            };
            
        var openable = false;
        var value2 = '';
        
        if(typeof value=='undefined'){
           openable = false;
        }else if(value==null){
            openable = false;
        }else{
            openable = false;
            for(var i in value){
                openable=true;
                break;
            }
			if(air.Introspector.config.debugRuntimeObjects){
				try{
					var typeDescription = runtime.flash.utils.describeType(value);
					if(!this.domParser) this.domParser = new DOMParser();
					var typeXml = this.domParser.parseFromString(typeDescription, "text/xml");
					var child = typeXml.firstChild.firstChild;
					while(child){
						if(child.nodeName=='accessor'||child.nodeName=='method'||child.nodeName=='constant'||child.nodeName=='variable'){
							openable = true;
							break;
						}
						child=child.nextSibling;
					}
				}catch(e){
					//hide the error
				}
			}
			if(typeof error!='undefined'){

			}else if(this.isNumberObject(value)){
                value2 = value;
                if(typeof setter!='undefined'){
                    config.editable = true;
                    config.valueType = 0;
                }
                openable = false;
            }else if(this.isStringObject(value)){
                 value2 = value.replace(/\n/g, "\\n");
                 if(value2.length == 0) value2 = '[empty string - click to edit]';
                     else value2 = '"'+value2 +'"';
                                     
                if(typeof setter!='undefined'){
                    config.editable = true;
                    config.valueType = 1; 
                }
                openable = false;
            }else if(this.isArgumentsObject(value)){
                value2 = '[Arguments '+value.length+']';
                openable = true;
            }else if(this.isArrayObject(value)){
                value2 = '[Array '+value.length+']';
                openable = true;
            }else{
                try{
                   value2 = value+'';
                }catch(e){
                   value2 = e+'';
                }
            }
        }
        
        config.nodeLabel2 = value2;
        config.openable = openable; 
           
        if(this.isStringObject(stringValue)&&stringValue.length==0){
        	stringValue = value2;
        	config.nodeLabel2 = '';
        }
        return new air.Introspector.tree.node(stringValue,config);
    },

    
    logArguments: function(args, config){
        if(typeof config=='undefined') config = {};
        config.buffer='';
        if(args.length==1)
           this.logObject(args[0], config);
        else
           this.logObject(args, config);
    },
    
    logNet: function(xhr, method, url, asyncFlag){
    	var requestLog = this.requestLog;
    	for(var i=requestLog.length-1;i>=0;i--){
            if(requestLog[i].xhr == xhr){
                this.refreshRequestObject(requestLog[i]);
                return;	
            } 		
    	}
    	var request = {
    		xhr: xhr, 
    		method: method, 
    		url: url,
			async: asyncFlag,
    		element: null
    	};
    	if(this.isLoaded){
    	   this.viewRequestObject(request);
    	}
    	requestLog.push(request);
		this.bounceTab(5);
    },

	logNetSend: function(xhr, obj){
    	var requestLog = this.requestLog;
    	for(var i=requestLog.length-1;i>=0;i--){
            if(requestLog[i].xhr == xhr){
				requestLog[i].obj = obj;
                this.refreshRequestObject(requestLog[i]);
				return;	
            } 		
    	}
    	var request = {
    		xhr: xhr, 
			obj: obj,
    		method: 'unknown',
    		url: '', 
    		element: null
    	};
    	if(this.isLoaded){
    	   this.viewRequestObject(request);
    	}
    	requestLog.push(request);
		this.bounceTab(5);
	},
    
    refreshRequestObject: function(request){
    	var self =this;
    	var src = '';
		if(!request.node)
			return;
    		request.node.items = [];
    	request.node.items.push( new air.Introspector.tree.node('readyState' , { openable: false, nodeLabel2:request.xhr.readyState } ));
    	try{
    		request.node.items.push( new air.Introspector.tree.node('status' , { openable: false, nodeLabel2:request.xhr.status } ));
    	}catch(e){
    	}

    	try{
			if(typeof request.async=='undefined')
				request.async = true;
    		request.node.items.push( new air.Introspector.tree.node('async' , { openable: false, nodeLabel2:request.async } ));
    	}catch(e){
    	}

    	try{
            request.node.items.push( new air.Introspector.tree.node('statusText' , { openable: false, nodeLabel2:request.xhr.statusText } ));
    	}catch(e){}

			try{
				if(typeof request.obj!='undefined'&&request.obj!=null){
					if(this.isXMLObject(request.obj)){
			            request.node.items.push( new air.Introspector.tree.node('sent' , { openable: true, 
			                src: request.obj.firstChild,
			                onshow: function(){
			                    if(this.items.length==0){
			                        this.items = [self.createDom2TreeNode(this.src)];
			                    }
			            } } ));
					}else{
			    		request.node.items.push( new air.Introspector.tree.node('sent' , { openable: true, 
			    			src: request.obj+'',
			    			onshow: function(){
				    			if(this.items.length==0){
				    				this.items = [new air.Introspector.tree.textNode(this.src)];
				    			}
			    		} } ));
					}
				}
			}catch(e){
			}

    	try{
    		request.node.items.push( new air.Introspector.tree.node('responseText' , { openable: true, 
    			src: request.xhr.responseText,
    			onshow: function(){
	    			if(this.items.length==0){
	    				this.items = [new air.Introspector.tree.textNode(this.src)];
	    			}
    		} } ));
    	}catch(e){
    	}
    	
	
    	
    	try{
			request.node.items.push( new air.Introspector.tree.node('responseXml' , { openable: true, 
                src: request.xhr.responseXML,
                onshow: function(){
                    if(this.items.length==0){
						self.extendDom2TreeNode(this, this.src);
//                        this.items = [self.createDom2TreeNode(this.src)];
                    }
	            },
				onhide: function(){
					//this.items.length = 0;
					this.clearItems();
				}
 			} ));
        }catch(e){
        }
    	
		try{
			var headers = request.xhr.getAllResponseHeaders();
			request.node.items.push( new air.Introspector.tree.node('responseHeaders' , { openable: true, 
    			src: headers,
    			onshow: function(){
	    			if(this.items.length==0){
	    				this.items = [new air.Introspector.tree.textNode(headers)];
	    			}
    		} } ));
		}catch(e){
	
		}
		
	
			
    	if(request.node.opened){
    		request.node.refreshChildren();
    	}
    	request.element.scrollIntoViewIfNeeded();
    },
    
    viewRequestObject: function(request){
    	try{
    		var self = this;
	    	var requestElement = this.htmlLoader.window.document.createElement("div");
	    	requestElement.className = "requestElement";
	    	var node = new air.Introspector.tree.node (request.method.toUpperCase()+' '+request.url, {
	    		onshow: function(){
	               if(this.items.length==0){
	               	  self.refreshRequestObject(request);
	               }    		     
	    	    }, 
	    		onhide: function(){
	    			//this.items.length = 0;
					this.clearItems();
	    		}
	    	});
	//    	node.shouldOpen();
	    	request.node = node;
	    	request.element = requestElement;
            this.netTabDiv.appendChild(requestElement);	    	
	    	requestElement.appendChild(node.createDiv(this.htmlLoader.window.document));

    	}catch(e){
    		this.logError(e);
    	}
    },
    
    refreshNetConsole: function(){
    	var requestLog = this.requestLog;
        for(var i=0;i<requestLog.length;i++){
            this.viewRequestObject(requestLog[i]);
        }
        
    },
    
    logObject: function(obj, config){
        if(typeof config=='undefined') config = {};
        if(this.isLoaded){
        	if(typeof obj != 'undefined'){
        		var node = this.createJsTreeNode('', obj);
        		var addElement = true;
        		if(node.openable&&config.buffer==''){
        			try{
                        if(obj[0])
                            config.buffer = obj[0]+'';
	                }catch(e){
	                }
        		}
        		if(config.buffer==''){
        			try{
        	           config.buffer = obj+'';
        	           addElement = node.openable;
        			}catch(e){
        				config.buffer = e;
        			}
        		}
        		if(addElement)
        		  config.element = node.createDiv(this.htmlLoader.window.document);	
        		
        	}
            this.logBuffer(config.buffer, config);
			this.bounceTab(0);
        }else{
           air.Introspector.extend(config, {obj: obj, isObject:true, doNotLog:true});
           this.logLines.push(config);
        }
    },
    
    showLogItem: function(logItem){
        if(this.isLoaded){
            var listItem = this.consoleDiv.ownerDocument.createElement('li');
            var listItemText = this.consoleDiv.ownerDocument.createElement('div');
            listItemText.innerHTML = logItem.specialBuffer + air.Introspector.escapeHtml(logItem.buffer);
            listItemText.className = '	consoleItemText';
            listItem.appendChild(listItemText);
            this.consoleDiv.appendChild(listItem);
            if(typeof logItem.element!='undefined'){
                listItem.appendChild(logItem.element);
            }
            if(typeof logItem.type!='undefined'){
                listItem.className += ' '+logItem.type;
                var listItemType = this.consoleDiv.ownerDocument.createElement('div');
                listItemType.className = 'typeBox';
                switch(logItem.type){
                    case 'warn':
                       listItemType.innerHTML = '!';
                      break;
                    case 'info':
                       listItemType.innerHTML = 'i';
                      break;
                    case 'error':
                       listItemType.innerHTML = 'x';
                      break;
                }
                listItem.appendChild(listItemType);
            }
            this.scrollConsole();
        }
    },
    logBuffer: function(buffer, config){
        if(typeof config=='undefined') config = {};
        if(typeof buffer=='undefined') buffer = '';
        var specialBuffer = '';
        if(air.Introspector.config.showTimestamp){
           var date = new Date();
           specialBuffer='<span class="consoleTimestamp">['+air.Introspector.twoDigits(date.getHours())+':'+air.Introspector.twoDigits(date.getMinutes())+':'+air.Introspector.twoDigits(date.getSeconds())+']</span> '+specialBuffer;
        }
        if(air.Introspector.config.showSender&&config.htmlLoader){
            try{
              specialBuffer='<span class="consoleFrom">['+config.htmlLoader.window.location+']</span>'+specialBuffer;
            }catch(e){
              //no htmlLoader provided - use current window
              buffer='[Debugger]'+buffer;
            }   
        }
        var logItem = {buffer: buffer, specialBuffer:specialBuffer};
        delete config.buffer;
        air.Introspector.extend(logItem, config);
        this.showLogItem(logItem);
        if(typeof config.doNotLog=='undefined'){
            this.logLines.push(logItem);
        }
    },
    scrollConsole:function(){
    	if(!this.scrollDisabled)
        {
        	var self = this;
            setTimeout(function(){ self.consoleDiv.scrollTop = self.consoleDiv.scrollHeight; self.scrollDisabled = false; }, 0);
        }
    },
    refreshConsole: function(){
        this.consoleDiv.childNodes.length = 0;
        for(var i=0;i<this.logLines.length;i++){
            if(typeof this.logLines[i].isObject!='undefined'){
                //this is an object log
                this.logObject(this.logLines[i].obj, this.logLines[i] );
            }else{
                this.showLogItem(this.logLines[i]);
            }
        }
        this.scrollConsole();
    },
    
    setActiveWindowById: function(id){
		if(air.Introspector.isAppSandbox){
 	        this.activeWindow = this.ownedWindows[id].nativeWindow;
	        this.activeHtmlLoader = null;
	        if(this.activeWindow!=null){
	            try{
	               this.logBuffer(this.activeWindow.title+' selected');
	            }catch(e){
	            }
	        }
	        this.refreshDomPanel();
	        this.createAssetsTree();
	        this.createSourcesTree();
		}
    },
    
    setActiveWindowByDocument: function(document){
		if(air.Introspector.isAppSandbox){
	        for(var i=this.windowsDiv.options.length-1;i>=0;i--){
	        	try{
	        		var option = this.windowsDiv.options[i];
		        	var windowId = parseFloat(option.value);
		        	if(this.ownedWindows[windowId].htmlLoader.window.document==document){
		        	   option.selected = true;
		        	   this.setActiveWindowById(windowId);
		        	   return;
		        	}
	        	}catch(e){
	        	}
	        }
		}
    },
    
    aireval : function(src, realWindow, result, error){
        var self = this;
		var myAir = {
                Introspector: { 
                   loadedEval: src, 
                   mainWindow: realWindow,
                   loaded: function(returnValue){
                       if(typeof result=='function'){
                           result.call(self, returnValue);
                       }
                   },
                   error : function(returnValue){
                       if(typeof error=='function'){
                           error.call(self, returnValue);
                       }
                   },  
                }
           };

		if(air.Introspector.isAppSandbox){
               var htmlLoader = new  air.Introspector.runtime.HTMLLoader();
               htmlLoader.addEventListener(air.Introspector.runtime.Event.HTML_DOM_INITIALIZE, function(){
               	   htmlLoader.window.clicked = self.clicked;
				   htmlLoader.window.toXML = function(xml){
						var domParser = new DOMParser();
						return domParser.parseFromString(xml, "text/xml");
				   };
                   htmlLoader.window.air = myAir;
               });
               htmlLoader.loadString("<script>var result; var aireval = eval; var evalSource = air.Introspector.loadedEval; try {with(air.Introspector.mainWindow){ result=aireval(evalSource); };air.Introspector.loaded(result); }catch(e){air.Introspector.error(e)}</"+"script>");
		}else{
			//we just don't need all that stuff - real eval is there (we actually run this peace of code in the same sandbox)
			var resultvalue; 
			var aireval2 = realWindow.eval; 
			var evalSource = myAir.Introspector.loadedEval; 
			try {
				with(realWindow){ 
					resultvalue=aireval2(evalSource); 
				};
				myAir.Introspector.loaded(resultvalue); 
			}catch(e){  
				myAir.Introspector.error(e); 
			}
		}
    },
    
    getActiveHtmlLoader: function(){
		if(air.Introspector.isAppSandbox){
	        if(this.activeHtmlLoader==null&&this.activeWindow!=null){
	            this.activeHtmlLoader = air.Introspector.findLoader(this.activeWindow.stage);
	        }
	        return this.activeHtmlLoader;
		}else{
			return {window: this.activeWindow };
		}
    },

    historyUserInput: function(step){
        if(typeof step!='undefined'){
            if(this.evalHistoryPos==this.evalHistory.length){
                this.evalHistorySaved = this.evalConsoleText.value;
            }
            var newEvalHistoryPos = this.evalHistoryPos + step;
            if(newEvalHistoryPos>=0){
                if(newEvalHistoryPos<this.evalHistory.length){
                  this.evalConsoleText.value = this.evalHistory[newEvalHistoryPos];
                }else if(newEvalHistoryPos==this.evalHistory.length){
                  this.evalConsoleText.value = this.evalHistorySaved;
                }else{
                    return;
                }
                this.evalHistoryPos = newEvalHistoryPos;
                this.evalConsoleText.selectionStart = this.evalConsoleText.value.length;
            }
        }else if(this.evalHistoryPos<this.evalHistory.length&&this.evalConsoleText.value!=this.evalHistory[this.evalHistoryPos]){
            this.evalHistoryPos=this.evalHistory.length;
            this.evalHistorySaved = this.evalConsoleText.value;
        }
    },

    evalUserInput: function(){
        var htmlLoader = this.getActiveHtmlLoader();
        if(htmlLoader==null){
            this.logBuffer(null, 'No active window.');
            return;
        }
        try{
            var userEval = this.evalConsoleText.value;
            
            if(air.Introspector.trim(userEval).length==0)
                return;
            
			this.scrollDisabled = false;

            this.evalHistory.push(userEval);
            this.evalHistoryPos = this.evalHistory.length; 
            
            this.aireval(userEval, htmlLoader.window, function(result){
                //if(typeof result!='undefined'){
	                    this.logObject(result, {htmlLoader:htmlLoader, buffer: '>>>'+userEval });
                //}
            }, function(error){
                this.logError(error, {htmlLoader:htmlLoader, buffer: '>>>'+userEval });
            });
            
            this.evalConsoleText.value = '';
        }catch(e){
            this.logError(e, {htmlLoader:htmlLoader, buffer: '>>>eval console' });
        }
    },
    
    logError: function(error, config){
        if(typeof config=='undefined')
           config = {};
        air.Introspector.extend(config, {type:'error'});
        this.logObject(error, config);
    },

    setTab: function(tab){
		this.activeTab = tab;
        if(this.isLoaded){
			this.activateTab();
		}
		
    },
	activateTab: function(){
        this.clearTabs();
		var tabName = this.tabs[this.activeTab];

		this.htmlLoader.window.document.getElementById(tabName+'Label').className = 'selected';
        this.htmlLoader.window.document.getElementById(tabName+'Tab').className = 'selected';

		if(this.activeTab==0){
			this.evalConsoleText.focus();
		}
	},
    setTool: function(toolName){
        switch(toolName){
            case 'inspect':
              this.toggleInspect();
            break;
        }
    },
    clearTabs: function(){
        var child = this.tabLabels.firstChild;
        while(child!=null){
            if(child.nodeType==1)  child.className = child.className.replace(/selected/, '');
            child=child.nextSibling;
        }
        var child = this.tabPages.firstChild;
        while(child!=null){
            if(child.nodeType==1) child.className = child.className.replace(/selected/, '');
            child=child.nextSibling;
        }
    },

    setCssTab: function(tab){
		this.activeCssTab = tab;
        if(this.isLoaded){
			this.activateCssTab();
		}
		
    },
	activateCssTab: function(){
//		if(!this.isLoaded) return;
		try{
	        this.clearCssTabs();
			var tabName = this.cssTabs[this.activeCssTab];

			this.htmlLoader.window.document.getElementById(tabName+'Label').className = 'selected';
	        this.htmlLoader.window.document.getElementById(tabName+'Tab').className = 'selected';
		}catch(e){}
	},

 	clearCssTabs: function(){
        var child = this.cssTabLabels.firstChild;
        while(child!=null){
            if(child.nodeType==1)  child.className = child.className.replace(/selected/, '');
            child=child.nextSibling;
        }
        var child = this.cssTabPages.firstChild;
        while(child!=null){
            if(child.nodeType==1) child.className = child.className.replace(/selected/, '');
            child=child.nextSibling;
        }
    },

    setInspect: function(value){
        this.isInspecting = value;
        if(this.inspectToolLabel){
            if(value){
                if((this.inspectToolLabel.className+'').indexOf('selected')==-1){
                  this.inspectToolLabel.className += ' selected';
                }
            }else{
                this.inspectToolLabel.className = this.inspectToolLabel.className.replace(' selected', '');
            }
        }
		if(value){
			this.switchToHtmlTab();
		}
	
		
		if(air.Introspector.isAppSandbox){
	        var ownedWindows = air.Introspector.getHtmlWindows();
	        for(var i=ownedWindows.length-1;i>=0;i--){
	            try{
	              ownedWindows[i].htmlLoader.window.air.Introspector.inspect=value;
	              ownedWindows[i].htmlLoader.window.air.Introspector.canClick=false;
	            }catch(e){
	            }
	        }
		}else{
			try{
				this.activeWindow.air.Introspector.inspect = value;
				this.activeWindow.air.Introspector.canClick=false;
			}catch(e){}
		}
    },
    toggleInspect: function(){
        this.isInspecting ^= true;
        if(this.isInspecting){
           this.startInspect();
        }else{
           this.finishInspect();
        }
    },
    startInspect: function()
    {
        this.setInspect(true);
        this.inspectElement = null;
    },
    
    finishInspect: function(canceled){
        this.setInspect(false);
        if(typeof canceled=='undefined')
           canceled = true;
        if(!canceled&&typeof this.inspectElement!='undefined'&&this.inspectElement){
           this.showCssElement(this.inspectElement);	
           this.showDomElementPath(this.inspectElement);
        }else{
			if(this.selectedElement){
				this.showDomElementPath(this.selectedElement);
           		this.showCssElement(this.selectedElement);					
			}
		}
        delete inspectElement;
    }, 
    
	showCssElement: function(element){
		if(!element || !element.ownerDocument || !element.ownerDocument.defaultView) return;
			this.selectedElement = element;
		var self = this;
		if(this.showCssElementTimer){
			clearTimeout(this.showCssElementTimer);
			this.showCssElementTimer = null;
		}
		this.clearCssElement();
		this.showCssElementTimer = setTimeout(function(){
			self.showCssElementTimer = null;
			self.showCssElementTimeout(element);
		}, 300);
	},
	clearCssElement:function(){
		if(!this.isLoaded) return;
		this.css2DomTab.innerHTML = '';
		this.css2StyleTab.innerHTML = '';
		
		if(this.cssElementJsNode){
			this.cssElementJsNode.dispose();
			this.cssElementJsNode = null;
		}
	},
	showCssElementTimeout: function(element){
		if(!this.isLoaded) return;		
		var value = '';
/*		try{
			value = 'DOM (' + element+')';
		}catch(e){}*/
		var jsNode = this.createJsTreeNode(value, element);
		jsNode.shouldOpen();
        this.css2DomTab.appendChild(jsNode.createDiv(this.htmlLoader.window.document));
		this.cssElementJsNode = jsNode;

		if(this.cssElementCssNode){
			this.cssElementCssNode.dispose();
			this.cssElementCssNode = null;
		}

		var cssNode = this.createCssTreeNode('CSS', element);
		cssNode.shouldOpen();
        this.css2StyleTab.appendChild(cssNode.createDiv(this.htmlLoader.window.document));
		this.cssElementCssNode =  cssNode;	
	},

	switchToHtmlTab: function () {
		this.setTab(1);
	},

    setInspectElement: function(element){
        this.inspectElement = element;
        this.showDomElementPath(this.inspectElement);
    },
    highlight: function(domNode){
    	var htmlLoader = this.getActiveHtmlLoader();
        if(htmlLoader!=null){
        	try{
        		if(typeof domNode!='undefined'){
        	       htmlLoader.window.air.Introspector.highlightElement(domNode);
				
        		}
        	    else
        	       htmlLoader.window.air.Introspector.hideHighlight();
        	}catch(e){
        		//no air debug highlighter..
        	}
        }
    	
    },
    
    gotoConsoleTab: function(){
    	this.setTab(0);
    },
    
	timerBounce: function(tag){
		var bounceTimer = 1300;
		var hideBounce = function(){
			if(tag.className.indexOf('bounce')==-1) return;
			tag.className = tag.className.replace(/bounceOn/g, "bounceOff");
			tag.innerHTML +=''; //force render
			setTimeout(showBounce, bounceTimer);
		};
		var showBounce = function(){
			if(tag.className.indexOf('bounce')==-1) return;
			tag.className = tag.className.replace(/bounceOff/g, "bounceOn");
			tag.innerHTML +='';	//force render		
			setTimeout(hideBounce, bounceTimer);			
		};
		setTimeout(hideBounce, bounceTimer);
	},
	
	bounceTab: function(tab){
		if(!air.Introspector.config.flashTabLabels)
			return;
		
		if(this.isLoaded&&this.activeTab!=tab){
			try{
				var tabName = this.tabs[tab];
				var tag =  this.htmlLoader.window.document.getElementById(tabName+'Label');
				if(tag.className.indexOf('bounce')==-1){
					tag.className += ' bounceOn';
					this.timerBounce(tag);
				}
			}catch(e){
				//wrong tab...
			}
		}
	},
	
	
	
	
    contentString: '<!DOCTYPE html PUBLIC \"-\/\/W3C\/\/DTD XHTML 1.0 Transitional\/\/EN\" \"http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd\">\n<html xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\">\n<head>\n<meta http-equiv=\"Content-Type\" content=\"text\/html; charset=UTF-8\" \/>\n<title>ADOBE AIR JS\/HTML Application Introspector<\/title>\n<style>\n\tbody{\n\t\toverflow:hidden;\n\t}\na:focus{outline:none;}\n\n\t#tabPages{\n\tposition:absolute;\n\tleft:0px;\n\ttop:80px;\n\tright:0px;\n\tbottom:0px;\n\tborder-top:1px solid #999999;\n\t}\n\t\n\t#preventClickingTabLabels{\n\t\t  position:absolute;\n\t\t  left:0px;\n\t\t  top:60px;\n\t\t  height:10px;\n\t\t  right:0px;\n\t\t  background:#666666;\n\t}\n\t\n\t#tabPages>div{\n\t\tposition:absolute;\n\t\tleft:0px;\n\t\ttop:0px;\n\t\tbottom:0px;\n\t\tright:0px;\n\t\tvisibility:hidden;\n\t\toverflow:auto;\n\t}\n\t\n\t#tabPages>div.selected{\n\t\tvisibility:visible;\n\t}\n\t\n\t#windowSelector{\n\tposition:absolute;\n\ttop:0px;\n\tright:0px;\n\ttext-align:right;\n\tbackground:#4F4F4F;\n\tleft:300px;\n\tpadding: 10px;\n\tvertical-align: middle;\n\theight: 30px;\n\t\n\t}\n\t\n\t#domTab{\n\t\toverflow:auto;\n\t}\n\t\n\t#console {\n\t\tposition:absolute;\n\t\tleft:0px;\n\t\ttop:0px;\n\t\tbottom:30px;\n\t\tright:0px;\n\t\tmargin:0px;\n\t\tpadding:0px;\n\t\tlist-style-image:none;\n\t\tlist-style-type:none;\n\t\toverflow:auto;\n\t}\n\t\n\t\n\t#console > li{\n\t\tborder-bottom:1px solid #CCCCCC;\n\t\tposition:relative;\n\t}\n\n\t\n\t.typeBox{\n\t\tposition:absolute;\n\t\tleft:0px;\n\t\ttop:0px;\n\t\twidth:10px;\n\t\tmargin-left:0px !important;\n\t\theight:13px;\n\t\ttext-align:center;\n\t\tpadding:3px;\n\t\tpadding-top:0px;\n\t\tfont-family:Verdana;\n\t\tborder:1px solid #000000;\n\t\t-webkit-border-top-left-radius:9px;\n\t\t-webkit-border-top-right-radius:9px;\t\t\n\t\t-webkit-border-bottom-left-radius:9px;\t\t\n\t\t-webkit-border-bottom-right-radius:9px;\t\t\n\t}\n\t\n\t#console > li > *{\n\t\tmargin-left:10px;\n\t}\n\t\n\t.consoleFrom, .consoleTimestamp{\n\t\tcolor:#999999;\n\t}\n\t.consoleItemText{\n\t\tcolor:#003366;\n\t     \/*font-weight:bold;*\/\n\t\tmargin-left:2px ! important;\n\t\tpadding:3px;\n\t\t-khtml-user-select:auto;\n\t}\n\t\n\t.error .consoleItemText{\n        background:#FFFFE0;\n        color:#FF3030;\n    }\n    \n    .warn .consoleItemText{\n        background:#00FFFF;\n        color: #000000;\n    }\n\n\t.warn .typeBox{\n\t\tborder:1px solid #8db047;\n\t\tcolor:#000000;\n\t\tbackground:#ffff00;\n\t}\n\t.error .typeBox{\n\t\tborder:1px solid #c00504;\n\t\tcolor:#ffffff;\n\t\tfont-weight:bold;\n\t\tbackground:#fe0000;\n\t}\n\t.info .typeBox{\n\t\tborder:1px solid #113c9f;\n\t\tcolor:#ffffff;\n\t\tfont-style:italic;\n\t\tbackground:#0053fe;\n\t}\n\t.warn .consoleItemText, .info .consoleItemText, .error .consoleItemText{\n\t\tmargin-left:20px ! important;\n\t}\n\t\n\t#evalConsole{\n\t\tposition:absolute;\n\t\tleft:0px;\n\t\tbottom:0px;\n\t\theight:30px;\n\t\tright:0px;\n\t\tborder-top:1px solid #999999;\n\t}\n\t#evalConsoleText{\n\t\tposition:absolute;\n\t\tleft:30px;bottom:0px;\n\t\ttop:0px;right:0px;\n\t\tborder:none;\n\t}\n\t#evalConsoleLabel{\n\t\tposition:absolute;\n\t\tleft:0px;bottom:0px;\n\t\ttop:0px;\n\t\tpadding-top:5px;\n\t\tborder:none;\n\t}\n\t#tabLabels{\n\t\toverflow:hidden;\n\tmargin:0px;\n\tlist-style-image:none;\n\tlist-style-type:none;\n\tposition:absolute;\n\ttop:50px;\n\tleft:100px;\n\tright:0px;\n\theight:30px;\n\tpadding-left:5px;\n\tborder-top-width: 0px;\n\tborder-top-style: solid;\n\tborder-top-color: #999999;\n\tbackground-color: #BBBBBB;\n\tborder-left-width: 2px;\n\tborder-left-style: solid;\n\tborder-left-color: #4F4F4F;\n\tpadding-top: 0px;\n\tpadding-right: 0px;\n\tpadding-bottom: 0px;\n\t}\n\t#tabLabels>li, #tabLabels>li.bounceOff{\n\tdisplay:block;\n\tpadding:5px;\n\tcursor:pointer;\n\tfloat:left;\n\theight:12px;\n\t-webkit-border-top-left-radius:5px;\n\t-webkit-border-top-right-radius:5px;\n\tfont-family: Arial, Helvetica, sans-serif;\n\tfont-size: 11px;\n\tfont-style: normal;\n\tfont-weight: 600;\n\tcolor: #5A6F7F;\n\tline-height: normal;\n\tmargin-top: 5px;\n\tmargin-right: 2px;\n\tmargin-bottom: 2px;\n\tmargin-left: 2px;\n\ttext-transform: uppercase;\n\t}\n\t\n\t\n\t#tabLabels>li.bounceOn{\n\t\tbackground:#BDB0FF;\n\t\tborder-bottom:none;\n\t\txcolor:#ffffff;\n\t}\n\t\n\t#tabLabels>li.selected{\n\t\tbackground:#DADADA;\n\t\tcolor:#0066CC;\n\t}\n\t\n\t#tabLabels>li:hover{\n\tbackground-color: #DADADA;\n\tcolor: #0066CC;\n\t}\n\t\n\t\n\t#toolToggle{\n\tmargin:0px;\n\tlist-style-image:none;\n\tlist-style-type:none;\n\tposition:absolute;\n\ttop:50px;\n\tleft:-2px;\n\tright:0px;\n\theight:30px;\n\tpadding-left:5px;\n\tborder-top-width: 0px;\n\tborder-top-style: solid;\n\tborder-top-color: #999999;\n\tbackground-color: #BBBBBB;\n\tborder-left-width: 2px;\n\tborder-left-style: solid;\n\tborder-left-color: #4F4F4F;\n\tpadding-top: 0px;\n\tpadding-right: 0px;\n\tpadding-bottom: 0px;\n\twidth: 95px;\n\t}\n\t\n\t#toolToggle>li, #tabLabels>li.bounceOff{\n\tdisplay:block;\n\tpadding:5px;\n\tcursor:pointer;\n\tfloat:left;\n\theight:12px;\n\t-webkit-border-top-left-radius:5px;\n\t-webkit-border-top-right-radius:5px;\n\tfont-family: Arial, Helvetica, sans-serif;\n\tfont-size: 11px;\n\tfont-style: normal;\n\tfont-weight: bold;\n\tcolor: #4F4F4F;\n\tline-height: normal;\n\tmargin-top: 5px;\n\tmargin-right: 2px;\n\tmargin-bottom: 2px;\n\tmargin-left: 2px;\n\ttext-transform: uppercase;\n\t}\n\t\n\t#toolToggle>li.selected{\n\t\tbackground:#DADADA;\n\t\tcolor:#333333;\n\t}\n\t\n\t#toolToggle>li:hover{\n\tbackground-color: #DADADA;\n\tcolor: #333333;\n\t}\n\t\n\t.selected2Tree > .treeLabel{\n\t\tfont-weight:bold;\n\t}\n\t.selected2Tree {\n\t\tborder:1px solid #eeeeee;\n\t\tmargin:-1px;\n\t}\n\t\n\t\n\t#toolsLabels{\n\tmargin:0px;\n\tlist-style-image:none;\n\tlist-style-type:none;\n\tposition:absolute;\n\ttop:0px;\n\tleft:0px;\n\tpadding-left:10px;\n\twidth:300px;\n\theight:40px;\n\tbackground:#4F4F4F;\n\tpadding-top: 10px;\n\tpadding-right: 10px;\n\tpadding-bottom: 5px;\n\tcolor:#FFFFFF;\n\tfont-size:14px;\n\tfont-family:Verdana, Arial, Helvetica, sans-serif;\n\tfont-weight:bold;\n\ttext-shadow:2px 2px 2px black;\n\t}\n\t#toolsLabels span{\n\t\t\tposition:relative;\n\t\t\ttop:-3px;\n\t\t\tleft:1px;\n\t\t\tfont-size:10px;\n\t\t\tfont-weight:normal;\n\t\t}\n\t\n\t#toolsLabels>li{\n\tpadding:5px;\n\tmargin:3px;\n\tmargin-right:0px;\n\tfloat:left;\n\theight:12px;\n\tbackground-color: #3C3C3C;\n\t}\n\t\n\t#toolsLabels>li.selected{\n\t\tbackground:#666666;\n\t\tcolor:#FFFFFF;\n\t}\n\t\n\t#toolsLabels>li:hover{\n\t\ttext-decoration:underline;\n\t}\n\t\n\t\n\t.treeNode{\n\t\tdisplay:block;\n\t\tposition:relative;\n\t\tpadding-top:20px;\n\t\ttext-decoration:none;\n\t\tcolor:#000000;\n\t}\n\t\n\t.selectedTreeLabel{\n\t\tfont-weight:bold;\n\t\tbackground:#eeeeee;\n\t}\n\t\n\t.hover > .treeLabel, .hover  >.treeLabel2{\n\t\tbackground:#FFFFCC;\n\t}\n\t\n\t.treeLabel{\n\t\tposition:absolute;\n\t\ttop:0px;\n\t\tleft:20px;\n\t\twidth:200px;\n\t\tcursor:pointer;\n\t\twhite-space:nowrap;\n\t\t\n\t}\n\t\n\t.treeLabel2, .treeEdit{\n\t\tposition:absolute;\n\t\ttop:0px;\n\t\tleft:220px;\n\t\tpadding-left:2px;\n\t\tcursor:pointer;\n\t\twhite-space:nowrap;\n\t}\t\n\t\n\t.editing > .treeEdit{\n\t\tdisplay:block !important;\n\t\twidth:400px;\n\t\tleft:220px;\n\t\tright:0px;\n\t}\n\t\n\t.treeNode > .treeEdit{\n\t\tdisplay:none;\n\t}\n\t\n\t.tagDomNodeName{\n\t\tcolor:#ee00ee;\n\t}\n\t\n\t.domTreeNode .treeLabel{\n\t\twidth:auto;\n\t}\n\t\n\t.tagDomNodeAttribute{\n        color:#0000ee;\n    }\n\t\n\t.editing > .treeLabel2{\n\t\tdisplay:none !important;\n\t}\n\t.treeNode > .treeLabel2{\n\t\tdisplay:block;\n\t}\n\t\t\n\t.treeAnchorMac{\n\t\tposition:absolute;\n\t\ttop:0px;\n\t\tleft:0px;\n\t\tmargin:1px;\n\t\twidth:12px;\n\t\theight:12px;\n\t\tcursor:pointer;\n\t\tfont-size:13px;\n\t\toverflow:hidden;\n\t\tcolor:#ffffff;\n\t\tbackground:#cccccc;\n\t\t-webkit-border-radius:6px;\n\t}\n\t.treeAnchorMac div{\n\t\tmargin-top: -3px;\n\t\twidth:25px;\n\t\tmargin-left: -6px;\n\t\tmargin-right: -2px;\n\t\ttext-align:center;\n\t}\n\t.treeNodeEmpty{\n\t\tdisplay:none;\n\t}\n\t.treeAnchorWin{\n\t\tposition:absolute;\n\t\ttop:0px;\n\t\tleft:0px;\n\t\tmargin:1px;\n\/*\t\tborder:1px solid #999999;\n\t\tborder-left:1px solid #eeeeee;\n\t\tborder-top:1px solid #eeeeee;*\/\n\t\twidth:12px;\n\t\theight:12px;\n\t\tcursor:pointer;\n\t\tfont-size:15px;\n\t\toverflow:hidden;\n\t\tcolor:#ffffff;\n\t\tbackground:#cccccc;\n\t\t-webkit-border-radius:6px;\n\t}\n\t.treeAnchorWin div{\n\t\tmargin-top: -4px;\n\t\twidth:25px;\n\t\tmargin-left: -6px;\n\t\tmargin-right: -3px;\n\t\ttext-align:center;\n\t}\n\t\n\t.treeChildren{\n\t\tmargin-left:20px;\n\t}\n\t\n\t.nodeEndLabelDiv{\n\t   display:none;\t\n\t}\n\t\n\t.nodeEndLabelDivVisible{\n       margin-left:20px;\n\t   display:block;\n\t   padding-bottom:5px;    \n    }\n\t\n\t.treeText{\n\t\tposition:relative;\n\t\tmargin:0px;\n\t\ttext-decoration:none;\n\t\tcolor:#000000;\n\t\tpadding:0px;\n\t\t\n\t}\n\t\n\t.treePreLine{\n\t\tposition:absolute;\n\t\ttop:0px;\n\t\ttext-align:right;\n\t\twidth:45px;\n\t\tpadding-right:3px;\n\t\tpadding:0px;\n\t\tbackground:#eeeeee;\n\t\txborder-right:1px solid #cccccc;\n\t}\n\t\n\t.treePreText{\n\t\tmargin-left:49px;\n\t\tpadding-left:4px;\n\t\t-khtml-user-select:auto;\n        border: 1px solid #ffffff;\n\t}\n\t\n\t.inPlaceEditor{\n                cursor:pointer;\n                display:inline;\n                position:relative;\n     }\n\t\n\t\/* TREE CLASSES\n\t*\/\n\t#html2Tab{\n\t\toverflow:hidden !important;\n\t}\n\t#html2Div{\n\t\tposition:absolute;\n\t\tleft:0px;\n\t\ttop:0px;\n\t\tbottom:0px;\n\t\toverflow:auto;\n\t}\n\t#html2Split{\n\t\tposition:absolute;\n\t\twidth:5px;\n\t\ttop:0px;\n\t\tbottom:0px;\n\t\tbackground:#cccccc;\n\t\tcursor:pointer;\n\t}\n\t#css2Div{\n\t\tposition:absolute;\n\t\ttop:0px;\n\t\tbottom:0px;\n\t\tright:0px;\n\t}\n\t#css2TabLabels{\n\t\tmargin:0px;\n\t\tpadding:0px;\n\t\tbackground:#cccccc;\n\t\tlist-style-image:none;\n\t\tlist-style-type:none;\n\t\tposition:absolute;\n\t\tborder-bottom:5px solid #666666;\n\t\ttop:0px;\n\t\tleft:0px;\n\t\tright:0px;\n\t\theight:20px;\n\t\tpadding-left:0px;\n\t}\n\t#css2TabLabels>li{\n\t\tdisplay:block;\n\t\tpadding:3px;\n\t\tpadding-bottom:0px;\n\t\tmargin:2px;\n\t\tmargin-left:0px;\n\t\tmargin-bottom:0px;\n\t\tfloat:left;\n\t\theight:15px;\n\t\tbackground:#ffffff;\n\t\t-webkit-border-top-left-radius:5px;\n\t\t-webkit-border-top-right-radius:5px;\t\t\n\t\t\tcursor:pointer;\n\t}\n\t\n\t#css2TabLabels>li.selected{\n\t\tbackground:#666666;\n\t\tcolor:#FFFFFF;\n\t}\n\t\n\t\n\t#css2TabPages{\n\t\tposition:absolute;\n\t\tleft:0px;\n\t\ttop:24px;\n\t\tright:0px;\n\t\tbottom:0px;\n\t\tborder-top:1px solid #999999;\n\t}\n\n\t#css2TabPages>div{\n\t\tposition:absolute;\n\t\tleft:0px;\n\t\ttop:0px;\n\t\tbottom:0px;\n\t\tright:0px;\n\t\tvisibility:hidden;\n\t\toverflow:auto;\n\t}\n\t\n\t#tabPages>div.selected  #css2TabPages>div.selected{\n\t\tvisibility:visible;\n\t}\n\t\n\t#windowList{\n\t\twidth:100px;\n\t\t\n\t}\n<\/style>\n<script>\n\tfunction doLoad(){\n\t\tsetTimeout(function(){\n\t\t\tif(typeof runtime==\'undefined\'&&opener){\n\t\t\t\tvar air = opener.air;\n\t\t\t\tdebugWindow = air.Introspector.debugWindow;\n\t\t\t\tdebugWindow.init(window);\n\t\t\t}\n\t\t}, 0);\n\t}\n\n<\/script>\n<\/head>\n\n<body onload=\'doLoad()\'>\n\t<ul id=\"toolsLabels\">\n\t  <!'+'--img src=\"images\/adobe_air_debugger.png\" width=\"180\" height=\"30\" \/--'+'>\n\t\tADOBE<span>&copy;<\/span> AIR&trade; Introspector\n\t<\/ul>\n    <ul id=\"toolToggle\">\n<li onclick=\"debugWindow.setTool(\'inspect\')\" id=\'inspectToolLabel\'>Inspect (F11)<\/li><\/ul>\n\t<ul id=\"tabLabels\">\n   \t  <li onclick=\"debugWindow.setTab(0)\" id=\'consoleLabel\'>Console<\/li>    \t\n        <li onclick=\"debugWindow.setTab(1)\" id=\'html2Label\'>HTML<\/li>\n\t\t<li onclick=\"debugWindow.setTab(2)\" id=\'domLabel\'>DOM<\/li>\n        <li onclick=\"debugWindow.setTab(3)\" id=\'assetsLabel\'>Assets<\/li>\n        <li onclick=\"debugWindow.setTab(4)\" id=\'sourceLabel\'>Source<\/li>\n\t\t<li onclick=\"debugWindow.setTab(5)\" id=\'netLabel\'>XHR<\/li>\n\t<\/ul>\n    <div id=\"tabPages\">\n<div id=\"consoleTab\">\n        \t<ul id=\"console\"><\/ul>\n            <div id=\"evalConsole\"><span id=\"evalConsoleLabel\">&gt;&gt;&gt;<\/span><input type=\"text\" id=\"evalConsoleText\" value=\"\" onkeyup=\"if(event.keyCode==13){ debugWindow.evalUserInput();return true;} else if(event.keyCode==38){ debugWindow.historyUserInput(-1); return true;} else if(event.keyCode==40){ debugWindow.historyUserInput(1); return true;} else debugWindow.historyUserInput();\" \/><\/div>\n        <\/div>\n\n\t\t<div id=\"html2Tab\">\n          <div id=\"html2Div\">\n\t\t  <\/div>\n\t\t  <div id=\"html2Split\">\n\t\t  <\/div>\n\t\t  <div id=\"css2Div\">\n\t\t\t<ul id=\"css2TabLabels\">\n\t\t    \t<li onclick=\"debugWindow.setCssTab(0)\" id=\'css2DomLabel\'>DOM<\/li>    \t\n\t\t        <li onclick=\"debugWindow.setCssTab(1)\" id=\'css2StyleLabel\'>Computed style<\/li>\n\t\t    <\/ul>\n\t\t\t<div id=\"css2TabPages\">\n\t\t\t\t<div id=\'css2DomTab\'><\/div>    \t\n\t\t        <div id=\'css2StyleTab\'><\/div>\n\t\t\t<\/div>\n\t      <\/div>\n\t\t\t\n        <\/div>    \n    \t<div id=\"domTab\">\n        \t\n        <\/div>\n    \t<div id=\"assetsTab\">\n        \t\n        <\/div> \n        <div id=\"sourceTab\">\n        \t\n        <\/div>\n\t\t<div id=\"netTab\">\n            \n        <\/div>    \n<\/div>\n    \n<div id=\"windowSelector\">\n<input id=\'refreshActiveWindow\' type=\"button\" value=\"Refresh active window:\" onclick=\"debugWindow.refreshWindows()\" \/>\n\t <select id=\"windowList\" onchange=\"debugWindow.setActiveWindowById(parseFloat(this.options[this.options.selectedIndex].value))\"><\/select>\n       \n<\/div>\n\n   \n<\/body>\n<\/html>\n\n'
}

air.Introspector.register();


