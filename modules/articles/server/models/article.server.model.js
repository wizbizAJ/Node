'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Article Schema
 */
var ArticleSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  name: {
    type: String,
    default: '',
    trim: true,
    required: 'Name cannot be blank'
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  lookupcategory: {
    type: Schema.ObjectId,
    ref: 'Lookup_category'
  },
  status: {
    type: String,
    enum: [
      'Active',
      'Inactive',
      'Deleted'
    ],
    default: 'Inactive',
    trim: true,
    required: 'Status cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  lastActivity: {
    type: Object
  }
});

mongoose.model('Article', ArticleSchema);
