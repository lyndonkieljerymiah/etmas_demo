/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var DataManager = (function() {
    function DataManager() {
        this.success = null;
        this.failed = null;
    }
    
    DataManager.prototype.sendPost = function(controller,action,param,formData) {
        var that = this;
        var uri = controller + "/" + action;
        if(param.trim() !== "") {
            uri = uri + "/" + param;
        }
        
        $.post(uri,formData,function(body) {
            that.success(body);
        });
        
    };
    
    DataManager.prototype.sendGet = function(controller,action,param) {
        var that = this;
        var uri = controller + "/" + action;
        $.get(uri,param);
    }
    return DataManager;
    
})();


