backbone.ditto
==============

A simple abstraction layer over Backbone Models and Collections

Backbone.Ditto is an easier way to allow models to define CRUD operations.

To facilitate this, models can have a `methodUrl` hash defined on them.

The method url hash can contain up to four methods, `create`, `read`, `put`, and `delete`.
These map to the HTTP methods CREATE, GET, PUT, and DELETE, respectively.

***Nesting
Ditto Models can also be nested. This can be done as a client-side way to implement
relationships in the database. If you do this, simply set the model as a property
on the model.
```
  var usr = new UserModel({name: 'Billy'});
  var img = new PhotoModel({src: 'http://example.com/billy.jpeg'});

  user.set("avatar", img);
```

When models are sent to the server, they are in a hash in the form of
```
{
  "className": "User",
  "attributes": {
    "name": "Billy",
    "avatar": "..."
  }
}
```
Any nested model which matches this format is considered to be a `refernce`

And for nested models, they work as you would naturally expect
```
{
  "className": "User",
  "attributes": {
    "name": "Billy",
    "avatar": {
      "className": "Photo",
      "attributes": {
        "src": "http://example.com/billy.jpeg"
      }
    }
  }
}
```
If data comes down in this same format, it will be parse into fully-featured Backbone models.
In order to facilitate this, however, your models must implement the `getModelDefinitions`
method.
This method must return a reference to a Backbone Model definition to be constructed
when given a `className` string.
