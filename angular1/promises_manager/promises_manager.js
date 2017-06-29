(function(){
    angular.module('promises_manager', []);
    angular.module('promises_manager').factory('PromisesManager', function($q){
        function PromisesManager(){
            var m = {
                defer: undefined,
                name: undefined
            };
            angular.extend(this, m);
            return this;
        }
        angular.extend(PromisesManager.prototype, {
            override_promise: override_promise,
            force_resolve_promise: force_resolve_promise,
            force_reject_promise: force_reject_promise
        });

        function override_promise(promise, name){
            var m = this;
            if (m.defer) {
                m.defer.reject('Overriden promise');
                m.name = undefined;
            }
            m.defer = $q.defer();
            m.name = name;
            var promises = {promise: promise};
            $q.all(promises).then(function(result){
                m.defer.resolve(result.promise);
                m.name = undefined;
                m.defer = undefined;
            });
            return m.defer.promise;
        }

        function validate_given_name(asked_name, current_name){
            if (current_name == asked_name){
                return;
            } else {
                throw new Error("Given name doesn't match the current promise");
            }
        }

        function force_resolve_promise(result, name){
            var m = this;
            if (m.name){
                validate_given_name(name, m.name);
            }
            if (m.defer){
                m.defer.resolve(result);
                m.defer = undefined;
            }
        }

        function force_reject_promise(result, name){
            var m = this;
            if (m.name){
                validate_given_name(name, m.name);
            }
            if (m.defer){
                m.defer.reject(result);
                m.defer = undefined;
            }
        }

        return PromisesManager;
    });
})();
