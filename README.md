## Knockout for Meteor

This package is meant to contain the bare minimum functionality required to bridge Meteor and Knockout.

You can create Knockout-compatible read-only computed observables that will react to changes in Meteor's observables.

```js
    viewModel.items = ko.meteorComputed(() => Items.find({}).fetch() || []);
```

You can then use this observable in Knockout bindings, just like any other Knockout observable.

```html
    <pre data-bind="text: JSON.stringify(items())"></pre>
```

This approach is simple, but extremely flexible. You can create computed observables from arbitrary combinations of many different Meteor and Knockout observables.

```js
    let mappedItems ko.meteorComputed(() => {
        let user = Meteor.user();

        return items().map((item) => user.name + ' can see ' + item.name);
    });
```

Avoid causing side-effects in the computation function you pass to ko.meteorComputed.

Observables created with ko.meteorComputed act like observables created with ko.pureComputed. A Meteor computed will unsubscribe from its dependencies and stop updating itself whenever it has no subscribers of its own, just like a Knockout pure computed. To keep your memory tidy, clean up a Meteor computed the same way you would clean up a Knockout pure computed.

This solution is intended to work whether or not you change ko.options.deferUpdates.

### Planned Features

* Writable Meteor computed observables.
* A ko.meteorAutorun function similar to Meteor's Tracker.autorun function, which reacts to both Knockout and Meteor observables.
* A system to automatically integrate Knockout components into Meteor builds. (Right now, I'm using Knockout on top of Blaze templates, which is easy and works correctly as long as I don't go out of my way to break it. But since this approach is not elegant, I want to get away from it.)
