angular.module('orderable_table', []);

/*
 options = {
    clickable: true,
    columns: [{header: 'id',
               value: function(item){return item.id;},
               width: 80,
               span_classes: 'label label-' + $filter(statuscssclass)(JobUtil.job_status(job),'job'),
               checkbox: true,
               click: function(item){$state.go('somestate', {par1: item.id})},
               show_filter_button: false,
               menu: [
                {
                  action: function(){alert('clonando')},
                  label: 'clonar'
                },{
                  action: function(){alert('editando')},
                  label: 'editar'
                }]
              }],
 }
*/

angular.module('orderable_table').directive('orderableTable', function(){
    return {
        restrict: 'E',
        replace: true,
        scope: {
            options: '=',
            onchangeFilters: '&?',
            items: '=',
            tableFilter: '&?',
            onchangeSelection: '&?',
        },
        templateUrl: BASE_URL+'/orderable-table/orderable-table.html',
        controller: function($scope, $filter){
            var unregister = $scope.$watch('options', function(){
                if (!$scope.order_by && $scope.options && $scope.options.columns && $scope.options.columns.length){
                    $scope.sort_by($scope.options.columns[0]);
                    $scope.reverse = true;
                    unregister();
                }
            });
            $scope.filter_items = function(item){
                if ($scope.tableFilter){
                    return $scope.tableFilter({item: item});
                } else {
                    return true;
                }
            };
            $scope.toggle_select_all = function(){
                var items = $filter('filter')($scope.items, $scope.filter_items);
                if (items.length){
                    var bool_value = !items[0].selected;
                    items.map(function(item){
                        item.selected = bool_value;
                    });
                }
                if ($scope.onchangeSelection){
                    $scope.onchangeSelection();
                }
            };
            $scope.sort_by = function(clmn){
                if ($scope.order_by && ($scope.order_by === clmn.ordered_value || $scope.order_by === clmn.value)){
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.order_by = clmn.ordered_value || clmn.value;
                    $scope.reverse = false;
                }
            }
        },
    };
});
