import ko from 'knockout';

import { Tracker } from 'meteor/tracker';

// Comment out log and all calls to it, except when debugging.
//function log() { console.log.apply(console, arguments); }; 

const meteorComputed = (computeValue) => {
    // TODO Implement writable meteor computed observables.
    // TODO Respect all the different computed configurations.

    let invalidator = ko.observable(false);
    // We use invalidator to force Knockout observables to recompute their results.

    let result = ko.observable();

    let isSleeping = true;

    let updater = null;
    let computation = null;

    let resultWrapper = ko.pureComputed(() => {
        if (isSleeping) {
            result(); // Create this dependency, but do not use the cached value.
            invalidator(!invalidator()); // When sleeping, subscribe to invalidator and always invalidate to force recomputation.

            //log('computing a sleeping Meteor computed');

            return ko.ignoreDependencies(computeValue);
        }

        return result();
    });

    resultWrapper.subscribe(() => {
        // When we start watching resultWrapper, set up Knockout and Meteor to observe dependencies.

        //log('waking a Meteor computed from sleep');

        isSleeping = false;

        if (updater !== null) { return; }

        updater = ko.computed(() => {
            invalidator(); // Subscribe to this so we can force invalidation.
            
            if (computation !== null) {
                computation.stop();
            }
            
            computation = Tracker.autorun((computation) => {
                if (computation.firstRun) {
                    result(computeValue());

                    //log('updated a Meteor computed: ', result.peek());
                } else {
                    // Meteor dependencies have changed.
                    // The execution path might be different from the previous run, so we need to make sure we also have the Knockout dependency-detection watching when we re-execute.

                    //log('invalidating a Meteor computed for a Meteor dependency');

                    invalidator(!invalidator.peek());
                }
            });
        });
    }, null, 'awake');

    resultWrapper.subscribe(() => {
        // When we stop watching resultWrapper, clean everything up.

        //log('putting a Meteor computed to sleep');

        if (updater !== null) {
            updater.dispose();
            updater = null;
        }
        
        if (computation !== null) {
            computation.stop();
            computation = null;
        }
        
        result(undefined);
        isSleeping = true;
    }, null, 'asleep');

    return resultWrapper;
};

// TODO Create ko.meteorAutorun if a use is found.

// TODO Support loading knockout templates, instead of leaving that to the package user.

ko.meteorComputed = meteorComputed;

export default ko;
