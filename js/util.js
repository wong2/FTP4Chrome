define(function(require, exports, module){

	var extend;
	exports.extend = extend = function (obj, dest) {
		Object.getOwnPropertyNames(obj).forEach(function(name) {
			dest[name] = Object.getOwnPropertyDescriptor(obj, name);
		});
	};

	exports.inspect = function(o){
		console.dir(o);
    };

	exports.inherits = function(child, parent, proto) {
		var descriptors = {};
		extend(child.prototype, descriptors);
		if (proto) extend(proto, descriptors);
		child.prototype = Object.create(parent.prototype, descriptors);
		child.super = parent;
	};

	exports.rawStringToBuffer = function ( str ) {
        var idx, len = str.length, arr = new Array( len );
        for ( idx = 0 ; idx < len ; ++idx ) {
        	arr[ idx ] = str.charCodeAt(idx) & 0xFF;
        }
        // You may create an ArrayBuffer from a standard array (of values) as follows:
        return new Uint8Array( arr ).buffer;
    };

    exports.bufferToRawString = function ( buf ) {
        var result = [];
        var view = new Uint8Array( buf );
        for(var i=0, len=view.length; i < len; i++){
            result.push(String.fromCharCode(view[i]));
        }
        return Array.prototype.join.call(result, "");
    };

})
