// In order to use this directive, do the following:
// <button event-binder="click=f1,mouseover=f2">
// use jquery events and avoid repeated angular digest cycles, especially on keyup and keydown
angular.module('eventbinder', []);

angular.module('eventbinder').directive('eventBinder', function(){
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            if (attrs.eventBinder !== undefined) {
                var all_pairs = attrs.eventBinder.split(",");
                var events_array = [];
                var functions_array = [];
                for (var j = 0; j < all_pairs.length; j++) {
                    events_array.push(all_pairs[j].split("=")[0]);
                    functions_array.push(all_pairs[j].split("=")[1]);
                }
                for (var i = 0; i < functions_array.length; i++) {
                    var function_i = functions_array[i];
                    el.on(events_array[i], function(event){
                        scope.$apply(function(){
                            scope.$eval(function_i)(el[0], event, scope);
                        });
                    });
                }
            }
        }
    };
});
