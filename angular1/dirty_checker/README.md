# ngdirty_checker

## How

Suppose you want to check if certain attribute of an object is changed from previous reference at some points in your code
or maybe you want to check if a specific attribute is changed in at least one element of an array composed by similar objects.

All you need to do is create new DirtyCheckerServices like:

```javascript
var dirtychecker1 = new DirtyCheckerService([{obj: $scope.composed_attr, path:['want_to_check_this_attr']}]);
var dirtychecker2 = new DirtyCheckerService([{obj: $scope.composed_attr, path: ['array', 'want_to_check_this_attr_of_each_element_of_array_which_is_a_property_of_composed_attr']}]);
```

Each dirtyChecker has 2 methods of its own:

flush: returns the dirty_checker to 'not dirty' state, an update the reference to what is not dirty now.
is_dirty: compares with the last reference of 'not dirty', if something is different return true, else false
