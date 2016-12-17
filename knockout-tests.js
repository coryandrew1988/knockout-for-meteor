import { Tinytest } from 'meteor/tinytest';
import { Tracker } from 'meteor/tracker';
import { ReactiveVar } from 'meteor/reactive-var';

import ko from 'meteor/keen:knockout';

// Comment out log and all calls to it, except when debugging.
//function log() { console.log.apply(console, arguments); }; 

Tinytest.add('knockout - ko has the meteorComputed function', (test) => {
  test.instanceOf(ko.meteorComputed, Function, 'ko.meteorComputed should be a function');
});

Tinytest.add('knockout - a meteor computed responds to changes to Meteor and Knockout dependencies', (test) => {
  let koObs = ko.observable(7);
  test.equal(koObs(), 7, 'a Knockout observable should contain the value passed to its factory');

  let meteorReactive = new ReactiveVar(50);
  test.equal(meteorReactive.get(), 50, 'a Meteor ReactiveVar should contain the value passed to its constructor');

  let meteorComp = ko.meteorComputed(() => koObs() + meteorReactive.get());

  test.equal(meteorComp(), 57, 'a Meteor computed should compute correctly on first run');

  //log('creating a Knockout computed with a dependency on the Meteor computed');
  let koComp = ko.computed(() => meteorComp() + 200);
  test.equal(koComp(), 257, 'a Knockout computed should compute correctly on first run');

  //log('changing the Knockout observable to 2');
  koObs(2);
  test.equal(meteorComp(), 52, 'a Meteor computed should update correctly after a Knockout dependency changes');
  test.equal(koComp(), 252, 'a Knockout computed should update correctly after a Meteor computed dependency changes');

  //log('changing the Meteor ReactiveVar to 30');
  meteorReactive.set(30);
  Tracker.flush();
  test.equal(meteorComp(), 32, 'a Meteor computed should update correctly after a Meteor dependency changes');
  test.equal(koComp(), 232, 'a Knockout computed should update correctly after a Meteor computed dependency changes');

  koComp.dispose();
});
