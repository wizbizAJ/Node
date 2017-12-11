'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Color Schema
 */
var ColorSchema = new Schema({
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
  hcode: {
    type: String,
    default: '',
    trim: true,
    required: 'Hexa code cannot be blank'
  },
  rgbcode: {
    type: String,
    default: '',
    trim: true
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

mongoose.model('Color', ColorSchema);
