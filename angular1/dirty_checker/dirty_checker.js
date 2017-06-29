(function(){
	var dirty_checker_module = angular.module('dirty_checker', []);
	dirty_checker_module.factory('DirtyCheckerService', function () {
	    function DirtyCheckerService(variables_map){
	        var m = this;
	        m.compare_objects = variables_map;
	        m.flush();
	        return this;
	    }

	    function act_on_entities(m, f){
	        function act_single(obj, mdl, idp){
	            var value = obj;
	            var path = mdl.path.slice(1);
	            for (var idj in path){
	                value = value[path[idj]];
	            }
	            f(value, mdl, idp);
	        }
	        var obj, obb, mdl;
	        for (var idx in m.compare_objects){
	            mdl = m.compare_objects[idx];
	            obj = mdl.obj[mdl.path[0]];
	            if (typeof obj === 'object' && obj.length !== undefined){
	                for (var idp in obj){
	                    obb = obj[idp];
	                    act_single(obb, mdl, idp);
	                }
	            } else {
	                act_single(obj, mdl);
	            }
	        }
	    }

	    function flush(){
	        var m = this;
	        function flush_obj(value, mdl, idp){
	            if (idp === undefined){
	                mdl.ref = value;
	            } else {
	                if (mdl.ref === undefined || idp === "0"){
	                    mdl.ref = [];
	                }
	                mdl.ref[idp] = value;
	            }
	        }
	        act_on_entities(m, flush_obj);
	    }

	    function is_dirty(){
	        var m = this;
	        var is_clean = true;
	        var mdl;
	        for (var idx in m.compare_objects) {
	            mdl = m.compare_objects[idx];
	            if (mdl.obj[mdl.path[0]].length !== undefined){
	                if (!mdl.ref){
	                    mdl.ref = [];
	                }
	                if (mdl.obj[mdl.path[0]].length !==  mdl.ref.length){
	                    is_clean = false;
	                }
	            }
	        }
	        function compare_obj(value, mdl, idp){
	            if (idp === undefined){
	                if (mdl.ref !== value){
	                    is_clean = false;
	                }
	            } else {
	                if (mdl.ref[idp] !== value){
	                    is_clean = false;
	                }
	            }
	        }
	        if (!is_clean){
	            return !is_clean;
	        }
	        act_on_entities(m, compare_obj);
	        return !is_clean;
	    }

	    angular.extend(DirtyCheckerService.prototype, {
	        flush: flush,
	        is_dirty: is_dirty
	    });

	    return DirtyCheckerService;
	});
})();
