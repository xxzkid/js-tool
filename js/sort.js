(function(){
    /**
     * 排序
     * @param {Object} obj 对象或数组
     * @param {Function} [compareFunction] 比较的方法 只有obj为Array时才会使用
     */
    window.ksort = function(obj, compareFunction) {
        if(Object.prototype.toString.call(obj) === '[object Object]') {
            return sortObj(obj);
        } else if(Object.prototype.toString.call(obj) === '[object Array]') {
            return sortArr(obj, compareFunction);
        }
        throw "not sortable";
    }
    
    
    function sortObj(obj) {
        var keys = Object.keys(obj), target = {};
        keys.sort();
        keys.forEach(function(key) {
            target[key] = obj[key];
        });
        return target;
    }
    
    function sortArr(obj, compareFunction) {
        if(typeof compareFunction === 'function') {
            return obj.sort(compareFunction);
        }
        return obj.sort();
    }
    
})();
