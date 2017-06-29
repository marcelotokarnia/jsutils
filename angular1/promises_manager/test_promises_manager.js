describe("[promise] PromisesManager tests", function() {
    beforeEach(angular.mock.module('promises_manager'));

    it('[promise1] ResolvePromise', function(done){
        inject(function (PromisesManager, $q, $timeout) {
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

            deferred1.resolve('nice flow');
            deferred2.resolve('nicely done');

            $q.all(promises).then(function(){
                done();
            });
            $timeout.flush();
        });
    });

    it('[promise2] OverridePromise', function(done){
        inject(function (PromisesManager, $q, $timeout) {
            var manager1 = new PromisesManager();
            var manager2 = new PromisesManager();

            var could_force = false;

            var promises_status = {};

            var deferred1 = $q.defer();
            var deferred2 = $q.defer();
            var deferred3 = $q.defer();
            var deferred4 = $q.defer();

            var promises = {
                promise1: manager1.override_promise(deferred1.promise, 'test1').then(function(response){
                    expect(true).equal(false);  // this shouldn't be called, because test1 was overriden by test2
                }, function(err){
                    promises_status[1] = err;
                }),
                promise2: manager1.override_promise(deferred2.promise, 'test2').then(function(response){
                    promises_status[2] = response.message;
                }),
                promise3: manager2.override_promise(deferred3.promise).then(function(response){
                    expect(true).equal(false);  // this shouldn't be called, because promise3 was overriden by test4
                }, function(err){
                    promises_status[3] = err;
                }),
                promise4: manager2.override_promise(deferred4.promise).then(function(response){
                    expect(true).equal(false);  // this shouldn't be called, because the promise was forced to reject
                }, function(err){
                    promises_status[4] = err.message;
                })
            };

            try {
                manager1.force_resolve_promise('should fail', 'test1');
                could_force = true;
            } catch (err){
                expect(err.message).equal("Given name doesn't match the current promise");
                delete promises.promise1;
            }

            expect(could_force).equal(false);

            manager1.force_resolve_promise({message: 'should do'}, 'test2');
            manager2.force_reject_promise({message: 'should NOT go'});

            $q.all(promises).then(function(response){
                expect(promises_status[1]).equal('Overriden promise');
                expect(promises_status[2]).equal('should do');
                expect(promises_status[3]).equal('Overriden promise');
                expect(promises_status[4]).equal('should NOT go');
                done();
            });
            $timeout.flush();
        });
    });
});
