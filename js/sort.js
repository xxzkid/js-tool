(function(){
    /**
     * 排序
     * @param {Object} obj 对象或数组
     * @param {Function} [compareFunction] 比较的方法
     */
    window.ksort = function(obj, compareFunction) {
        if(Object.prototype.toString.call(obj) === '[object Object]') {
            return sortObj(obj, compareFunction);
        } else if(Object.prototype.toString.call(obj) === '[object Array]') {
            return sortArr(obj, compareFunction);
        }
        throw "not sortable";
    }
    
    
    function sortObj(obj, compareFunction) {
        var keys = Object.keys(obj), target = {};
        keys.sort(compareFunction);
        keys.forEach(function(key) {
            target[key] = obj[key];
        });
        return target;
    }
    
    function sortArr(obj, compareFunction) {
        return obj.sort(compareFunction);
    }
    
})();
