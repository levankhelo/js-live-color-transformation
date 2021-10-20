

class _LiveColorsBase {
	constructor(){};

	hex( str ) {

		let converted = "";
		var hex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( str );
		converted = "rgb(" + parseInt(hex[1],16) + "," + parseInt(hex[2],16) + "," + parseInt(hex[2],16) +")";

		return this.rgb( converted )
	}

	rgb( str ) {
		/* extract and returb rgb values from string
		 * 
		 * Arguments:
		 * 		- str (string)
		 * 			string which should be parsed for
		 * 			rgb(255,255,255) value
		 * 
		 * Returns:
		 * 		- rgb (object)
		 * 			object that contains three attributes
		 * 			.r for value of red color
		 * 			.g for value of green color
		 * 			.rbfor value of blue color
		 */

		if( /^#([0-9A-F]{3}){1,2}$/i.test(str) ) {
			return this.hex(str);

		}

		var rgb = {
			"r": null,
			"g": null,
			"b": null 
		};
	
		let i = 3;
		let len = str.length;
	
		// check if we are capturing values or not
		let capturing;
		
		// store red, green, blue values
		let colors = ["","",""]; 
		// calculate which color should we fill in, in colros array
		let currentColorField = 0; 
		
	
		for( i; i < len; i++ ) {
			switch(str[i]) {
				case "(": 
					capturing = true; 
					continue;
				case ")": 
					capturing = false; 
					break;
				case ",": 
					currentColorField++;
					continue;
				default: 
					if( !capturing ) continue;
					colors[currentColorField] += str[i];
					break;
			}
			if( capturing == false ) break;
		}
		
		rgb.r = parseInt(colors[0]);
		rgb.g = parseInt(colors[1]);
		rgb.b = parseInt(colors[2]);
	
		return rgb;
	}

	create_rgb(r,g,b) {
		return {
			"r": parseInt(r),
			"g": parseInt(g),
			"b": parseInt(b) 
		};
	}
}

class _LiveColorsExtractor extends _LiveColorsBase {
	constructor(){ super() }
	background( el, _ret = false ) {
		let val = this.rgb(window.getComputedStyle(el).background);

		// check if called internally and return element
		if( _ret ) {
			return {
				"value": val,
				"element": el
			};
		};
		return val;
	}
	
	color( el, _ret = false ) {
		let val = this.rgb(window.getComputedStyle(el).color)
		// check if called internally and return element
		if( _ret ) {
			return {
				"value": val,
				"element": el
			};
		};
		return val;
	}
	
	border( el, _ret = false ) {
		let val = this.rgb(window.getComputedStyle(el).borderColor)
		// check if called internally and return element
		if( _ret ) {
			return {
				"value": val,
				"element": el
			};
		};
		return val;;
	}
}

class _LiveColorsAction {
	constructor(){
		this.update = function(){

		}	
	}
}

class LiveColorsEngine extends _LiveColorsBase {

	constructor() {
		super();

		var master = this;
		/*** private variables ***/
		const author = "Levan Khelashvili";

		/*** public variables ***/
		var history = new Array;

		/*** private subclasses ***/
		

		/*** private function ***/
		function printAuthor() {
			if(this.logs) console.log("live colors engine initialized.\n\tCreated by: " + author);
		}

		function pushHistory(value) {
			if( typeof value != "number" ) {
				throw "pushHistory accepts only numbers";
			}
			history.push(value)
		}

		this.testPushHistory = function() {
			for( var i = 100; i >0; i--) {
				pushHistory(i)
			}
		}

		var _update_AnimationFrame = null;
		function update() {
			/* 	Animation Frame
			 * 		animates elements
			 */
			_update_AnimationFrame = window.requestAnimationFrame(update);
		}

		function stopUpdate() {
			if ( _update_AnimationFrame == null ) {
				return null;
			}
			window.cancelAnimationFrame(_update_AnimationFrame)
			_update_AnimationFrame = null;
			
		}

		
		/*** public function ***/
		this.extract = new _LiveColorsExtractor;

		this.getHistory = function() {
			/* get history of colors
			 * 
			 * Arguments:
			 * 		- (no argument)
			 * 			returns whole array
			 * 
			 * 		- number (int)
			 * 			returns one number
			 * 
			 * 		- numbers (int)
			 * 			returns array with numbers
			 * 
			 */
			if (arguments[0] == undefined) {
				return history
			} else if( typeof(arguments[0]) == "number" ) {
				if( arguments.length == 1) {
					if( arguments[0] >= 0 ){
						return history[arguments[0]]
					} else {
						return history[history.length-1+arguments[0]]
					}
				}
				let i = 0;
				let data = new Map;
				
				while( typeof(arguments[i]) == "number" ) {
					let N = arguments[i];
					let val = undefined;
					
					if( N >= 0 ){
						val = history[N]
					} else {
						val = history[history.length-1-N]
					}
					
					data[N] = history[N]
					i++;
				}

				return data;
			}
		}

		this.animateBackground = function(elem, color1, color2) {
			var scope = this;
			let obj = master.extract.background(elem, true);
			if( color2 == undefined ) {
				var current = obj.value;
				var target = color1;			
			} else {
				var current = color1;
				var target = color2;
			}
			
			var animateBackground_AnimationFrame = null;
			function animation() {
				animateBackground_AnimationFrame = window.requestAnimationFrame(animation);
				
				current = master.extract.background(elem);
				
				var change = {
					"r": (current.r>=target.r)?((current.r==target.r)?0:-1):1,
					"g": (current.g>=target.g)?((current.g==target.g)?0:-1):1,
					"b": (current.b>=target.b)?((current.b==target.b)?0:-1):11
				}
				
				obj.element.style.backgroundColor = "rgb(" + (current.r+change.r) + "," + (current.g+change.g) + "," + (current.b+change.b) + ")"

				if(this.logs) console.log(change, current, target, (change.r + change.g + change.b) == 0)

				if( (change.r + change.g + change.b) == 0) {
					window.cancelAnimationFrame( animateBackground_AnimationFrame );
					return;
				}
			}

			animation()
			
			

		}
		/*** initialized ***/
		printAuthor();
	}

}