Package.describe({
  name: 'keen:knockout',
  version: '0.0.1',
  summary: 'A simple bridge from Meteor\'s reactive dependencies to Knockout\'s.',
  git: 'https://github.com/coryandrew1988/knockout-for-meteor',
  documentation: 'README.md'
});

Npm.depends({
  'knockout': '3.4.1'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4.2.3');
  api.use('ecmascript');
  api.mainModule('knockout.js', 'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('reactive-var');
  api.use('keen:knockout'); 
  api.mainModule('knockout-tests.js', 'client');
});
