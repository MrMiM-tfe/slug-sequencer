# slug-sequencer

Generates a unique slug, handling duplicates and patterns

## what is this ?

this package is plugin for mongoose that generates a slug for a document and ensures its uniqueness within a Mongoose model. If there are existing documents with the same slug , it appends a counter to make it unique

## install 

```
npm i slug-sequencer
```

## how to use ?

1 - import it as slugSequencer
```js
const slugSequencer = require("slug-sequencer")
```

2 - use it as plugin for mongoose schema after creating schema

    note 1: schema must have slug field and type must be string
    note 2: provide the field name for creating a slug to `slugSequencer` like `slugSequencer("name")`

```js
const mongoose = require('mongoose');
const slugSequencer = require("slug-sequencer")

const exampleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true
  }
});

// add plugin to schema
exampleSchema.plugin(slugSequencer("name"))

const ExampleModel = mongoose.model('Example', exampleSchema);

module.exports = ExampleModel;
```
now it's done 🙂!