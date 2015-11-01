(function() {

	window.ajax = function(options) {

		var defaultOptions = {
			async : true,
			cache : false
		};

		options = extend(defaultOptions, options);

		// 核心功能对象, 包含了xhr并实现了需求中各个方法和属性
		var _obj = {
			xhr: createXhr(), // xhr对象
			successCallbacks: [],
			errorCallbacks: [],
			alwaysCallbacks: [],
			options: options
		};

		/**
		 * 设置前置处理方法
		 * @param {Function} callback
		 */
		_obj.before = function(callback) {
			typeof(callback) === 'function' && callback(_obj.xhr);
			return _obj; // 为支持链式操作，将原对象返回
		};

		/**
		 * 设置单个请求头
		 * header方法必须在get|post方法之前执行，否则请求已发出再设置header没意义
		 * @param {String} name
		 * @param {String} value
		 */
		_obj.header = function(name, value) {
			_obj.xhr.setRequestHeader(name, value);
			return _obj;
		};

		/**
		 * 设置多个请求头
		 * @param {Object} headers
		 */
		_obj.headers = function(headers) {
			if (Object.prototype.toString.call(headers) === '[object Object]') {
				for (var name in headers) {
					_obj.xhr.setRequestHeader(name, header[name]);
				}
			}
			return _obj;
		};

		/**
		 * 成功时的回调
		 * @param {Function} callback
		 * @param {Boolean} jsonForceValidate
		 */
		_obj.success = function(callback, jsonForceValidate) {
			_obj.jsonForceValidate = jsonForceValidate;

			if (typeof(callback) === 'function') {
				_obj.successCallbacks.push(callback);
			}

			return _obj;
		};

		/**
		 * 失败时的回调
		 * @param {Function} callback
		 */
		_obj.error = function(callback) {
			if (typeof(callback) === 'function') {
				_obj.errorCallbacks.push(callback);
			}
			return _obj;
		};

		/**
		 * 执行完成时的回调，无论成功失败
		 * @param {Function} callback
		 */
		_obj.always = function(callback) {
			if (typeof(callback) === 'function') {
				_obj.alwaysCallbacks.push(callback);
			}
			return _obj;
		};

		/**
		 * 设定超时时间并绑定超时回调
		 * @param {Object} timeout
		 * @param {Function} callback
		 */
		_obj.timeout = function(timeout, callback) {
			_obj.xhr.timeout = timeout;

			if (typeof(callback) === 'function') {
				_obj.xhr.ontimeout = function() {
					callback(_obj.xhr);
				}
			}

			return _obj;
		};

		/**
		 * 以get method发起ajax请求
		 * @param {Object} url
		 * @param {Object} data
		 */
		_obj.get = function(url, data) {
			if (typeof(url) === 'undefined') throw 'url 不能为空';
			if (Object.prototype.toString.call(data) !== '[object Object]') data = undefined;
			doAjax(_obj, 'get', url, data, 'urlencoded');
			return _obj;
		};

		/**
		 * 以post method发起ajax请求
		 * @param {Object} url
		 * @param {Object} data
		 * @param {String} contentType
		 */
		_obj.post = function(url, data, contentType) {
			if (typeof(url) === 'undefined') throw 'url 不能为空';
			if (Object.prototype.toString.call(data) !== '[object Object]') data = undefined;
			if (typeof(contentType) !== 'string') contentType = 'urlencoded';
			doAjax(_obj, 'post', url, data, contentType);
			return _obj;
		};

		_obj.abort = function() {
			_obj.xhr.abort();
			return _obj;
		};

		return _obj;
	};

	/**
	 * 创建xhr对象
	 */
	function createXhr() {
		var request = false;
		if (window.XMLHttpRequest) {
			request = new XMLHttpRequest();
			if (request.overrideMimeType) {
				request.overrideMimeType("text/xml");
			}
		} else if (window.ActiveXObject) {
			var versions = ['Microsoft.XMLHTTP', 'MSXML.XMLHTTP',
				'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.7.0',
				'Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.5.0',
				'Msxml2.XMLHTTP.4.0', 'MSXML2.XMLHTTP.3.0', 'MSXML2.XMLHTTP'
			];
			for (var i = 0; i < versions.length; i++) {
				try {
					request = new ActiveXObject(versions[i]);
					if (request) {
						return request;
					}
				} catch (e) {}
			}
		}
		return request;
	}

	function doAjax(_obj, method, url, data, contentType) {
		var xhr = _obj.xhr;
		// 编码数据对象
		data = encodeData(data, contentType);

		if (!_obj.options.cache) {
			url += (url.indexOf('?') == -1 ? '?' : '&') + '_t=' + new Date().getTime();
		}

		// 如果是get请求，将编码后的data作为查询参数附加到url上
		if ('get' === method) {
			url += (url.indexOf('?') == -1 ? '?' : '&') + data;
		}

		// 绑定时间处理器
		bindEventHandler();

		xhr.open(method, url, _obj.options.async);

		// send
		if ('post' === method && data) {
			xhr.setRequestHeader('Content-Type', _obj.postContentType);
			xhr.send(data);
		} else {
			xhr.send();
		}

		/**
		 * 数据编码
		 * @param {Object} data
		 * @param {String} contentType urlencoded|json
		 */
		function encodeData(data, contentType) {
			if (Object.prototype.toString.call(data) === '[object Object]') {
				// 此处需要json字符串，现代浏览器都支持内置的JSON对象，如果老浏览器不支持，可通过json2.js来模拟实现
				if ('json' === contentType.toLowerCase() //以application/json格式post数据
					&& typeof(JSON) === 'object' // 支持JSON序列化
					&& typeof(JSON.stringify) === 'function') {

					_obj.postContentType = "application/json";
					return JSON.stringify(data);
				} else {
					// 其他说有情况都作为urlencoded处理
					_obj.postContentType = 'application/x-www-form-urlencoded';
					return encodeParam(data);
				}
			}
		}

		/**
		 * 以urlencoded方式编码数据
		 * @param {Object} data
		 */
		function encodeParam(data) {
			if (Object.prototype.toString.call(data) == '[object Object]') {
				var params = [];
				for (var name in data) {
					var value = data[name];
					if (Object.prototype.toString.call(value) === '[object Array]') {
						for (var i = 0; i < value.length; i++) {
							params.push(name + '=' + encodeURIComponent(value[i]));
						}
					} else {
						params.push(name + '=' + encodeURIComponent(value));
					}
				}

				return params.join('&');
			}
		}

		/**
		 * 绑定readystatechange事件处理器
		 */
		function bindEventHandler() {
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					var i, len;
					// 如果有always回调，先执行always
					for (i = 0, len = _obj.alwaysCallbacks.length; i < len; ++i) {
						_obj.alwaysCallbacks[i](xhr.status, xhr.responseText, xhr);
					}

					// 根据是否成功，决定调用success or error
					var resText = xhr.responseText;
					var resJson = toJson(resText);

					if (xhr.status == 200) {
						if (_obj.jsonForceValidate && typeof(resJson) === 'undefined') {
							// 强制json格式验证且转换失败，调用errorCallback
							for (i = 0, len = _obj.errorCallbacks.length; i < len; ++i) {
								_obj.errorCallbacks[i](xhr.status, xhr.responseText, xhr);
							}
						} else {
							for (i = 0, len = _obj.successCallbacks.length; i < len; ++i) {
								_obj.successCallbacks[i](resText || resJson, xhr);
							}
						}
					} else {
						// 非200状态， 调用errorCallback
						for (i = 0, len = _obj.errorCallbacks.length; i < len; ++i) {
							_obj.errorCallbacks[i](xhr.status, xhr.responseText, xhr);
						}
					}
				}
			}
		}

		function toJson(text) {
			if (Object.prototype.toString.call(text) === '[object Object]') {
				return text;
			}
		}
	}

	/**
	 * 用obj2成员值替换obj1成员值
	 * @param {Object} obj1
	 * @param {Object} obj2
	 */
	function extend(obj1, obj2) {
		if (Object.prototype.toString.call(obj1) === '[object Object]' && Object.prototype.toString.call(obj2) === '[object Object]') {
			for (var pname in obj2) {
				obj1[pname] = obj2[pname];
			}
		}
		return obj1;
	}

})();