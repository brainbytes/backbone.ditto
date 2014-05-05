Backbone.DittoModel = Backbone.Model.extend
  methodUrl:
    read: -> ""
    delete: -> "/#{@get 'id'}"
    put: -> "/#{@get 'id'}"
    create: -> ""

  ignored: -> ['token']

  toJSON: ->
    json = Backbone.Model::toJSON.call(@)
    json.className = @className
    _.each json, (value, key) =>
      json[key] = value.apply(@) if _.isFunction(value)
      json[key] = value.toJSON() if App.isReference(value)
    json

  parse: (res) ->
    res = res[0] if _.isArray res
    _.each res, (val, key) => res[key] = @_build val if App.isReference val
    res

  _build: (data) ->
    _.each attrs = data.attributes, (val, key) =>
      if App.isReference val then attrs[key] = @_build val
    new @getModelDefinitions data.className.capitalize()
      .Model attrs

  save: (attributes = {}, options = {}) ->
    attrs = _.extend {}, attributes, @attributes
    _.each attrs, (val, key) =>
      delete attrs[key] if _.isFunction val or _.contains @ignored(), key
      if App.isReference attrs[key]
        attrs[key] = attrs.toJSON()
    _.extend options, 'attrs': attrs, wait: true
    Backbone.Model::save.call(@, attrs, options)

  sync: (method, model, options) ->
    if model.methodUrl and model.methodUrl[method]
      options = options or {}
      options.url = model.urlRoot + model.methodUrl[method].call(@)
    Backbone.sync method, model, options

  Backbone.DittoCollection = Backbone.Collection.extend
    sync: (method, model, opts) -> Backbone.sync method, model, opts
