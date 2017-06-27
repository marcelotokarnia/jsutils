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
        templateUrl: APP.BASE_URL+'components/orderable_table/orderable_table.html',
        controller: function($scope, $filter){
            var unregister = $scope.$watch('options', function(){
                if ($scope.options){
                    if (!$scope.order_by && $scope.options.columns && $scope.options.columns.length){
                        if ($scope.options.order_by){
                            $scope.sort_by($scope.options.order_by);
                        } else {
                            $scope.sort_by($scope.options.columns[0]);
                        }
                        if ($scope.options.reverse !== undefined){
                            $scope.reverse = $scope.options.reverse;
                        } else {
                            $scope.reverse = true;
                        }
                    }
                    if (!$scope.options.page_size){
                        $scope.options.page_size = 100;
                    }
                    unregister();
                }
            });

            $scope.page = 0;

            $scope.total_pages = function(){
                var items = $filter('filter')($scope.items, $scope.filter_items);
                if ($scope.options && $scope.options.page_size){
                    return Math.ceil(items.length / $scope.options.page_size);
                } else {
                    return 0;
                }

            };

            $scope.showing_items = function(){
                if ($scope.options && $scope.options.page_size){
                    var items = $filter('filter')($scope.items, $scope.filter_items);
                    if (!$scope.page){
                        return Math.min($scope.options.page_size, items.length);
                    } else if ($scope.page + 1 === $scope.total_pages()){
                        return items.length % $scope.options.page_size;
                    } else {
                        return $scope.options.page_size;
                    }
                } else {
                    return 0;
                }
            };

            $scope.previous_page = function(){
                $scope.page--;
            };

            $scope.next_page = function(){
                $scope.page++;
            };

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
