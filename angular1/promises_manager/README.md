# ngpromises_manager

## What ? 

This is an angular factory to assist you manage your promises in multiple pipelines.

## Why ? 

It is most useful when you have a single page application and a transition requires a long process to finish with the possibility of 
canceling this process and start a new one.

If not well implemented, there is a chance that the first promise will end and trigger an unexpected transition change after the second promise is already fulfilled 
and the application is already showing the desired content.

## How ? 

1. You can refer to the test file, there you will find some usage examples.

In sum, you will create a new pipeline manager (you can create more than one, each represents a pipeline of promises) and associate promises to each pipeline
 using the manager's override_promise method and append functions to each promise executes as soon as it is fulfilled with 'then'.
 
Optionally you may assign a name to each group of promises in the override_promise method (the second parameter) as an extra layer of security. 
If the given name is different then current promise's group name an error is thrown. 
In this case you probably needed another manager.

Each pipeline is made to support one, and only one pending promise at a time. So, if the case described above in the 'Why' section were to happen, 
the first promise would be instantly canceled before the second promise starts.

Like this:

```javascript
var manager1 = new PromisesManager();
var manager2 = new PromisesManager();
var deferred1 = $q.defer();
var deferred2 = $q.defer();

var promises = {};

promises.manager1 = manager1.override_promise(deferred1.promise, 'test1').then(function(response){
    expect(response).equal('nice flow');
});
promises.manager2 = manager2.override_promise(deferred2.promise).then(function(response){
    expect(response).equal('nicely done');
});
```
