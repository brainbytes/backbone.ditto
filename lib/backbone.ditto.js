Backbone.DittoModel = Backbone.Model.extend({
  methodUrl: {
    read: function() {
      return "";
    },
    "delete": function() {
      return "/" + (this.get('id'));
    },
    put: function() {
      return "/" + (this.get('id'));
    },
    create: function() {
      return "";
    }
  },
  ignored: function() {
    return ['token'];
  },
  toJSON: function() {
    var json;
    json = Backbone.Model.prototype.toJSON.call(this);
    json.className = this.className;
    _.each(json, (function(_this) {
      return function(value, key) {
        if (_.isFunction(value)) {
          json[key] = value.apply(_this);
        }
        if (App.isReference(value)) {
          return json[key] = value.toJSON();
        }
      };
    })(this));
    return json;
  },
  parse: function(res) {
    if (_.isArray(res)) {
      res = res[0];
    }
    _.each(res, (function(_this) {
      return function(val, key) {
        if (App.isReference(val)) {
          return res[key] = _this._build(val);
        }
      };
    })(this));
    return res;
  },
  _build: function(data) {
    var attrs;
    _.each(attrs = data.attributes, (function(_this) {
      return function(val, key) {
        if (App.isReference(val)) {
          return attrs[key] = _this._build(val);
        }
      };
    })(this));
    return new this.getModelDefinitions(data.className.capitalize()).Model(attrs);
  },
  save: function(attributes, options) {
    var attrs;
    if (attributes == null) {
      attributes = {};
    }
    if (options == null) {
      options = {};
    }
    attrs = _.extend({}, attributes, this.attributes);
    _.each(attrs, (function(_this) {
      return function(val, key) {
        if (_.isFunction(val || _.contains(_this.ignored(), key))) {
          delete attrs[key];
        }
        if (App.isReference(attrs[key])) {
          return attrs[key] = attrs.toJSON();
        }
      };
    })(this));
    _.extend(options, {
      'attrs': attrs,
      wait: true
    });
    return Backbone.Model.prototype.save.call(this, attrs, options);
  },
  sync: function(method, model, options) {
    if (model.methodUrl && model.methodUrl[method]) {
      options = options || {};
      options.url = model.urlRoot + model.methodUrl[method].call(this);
    }
    return Backbone.sync(method, model, options);
  }
}, Backbone.DittoCollection = Backbone.Collection.extend({
  sync: function(method, model, opts) {
    return Backbone.sync(method, model, opts);
  }
}));
