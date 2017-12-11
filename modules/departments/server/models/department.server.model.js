'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Department Schema
 */
var DepartmentSchema = new Schema({
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
  contactName: {
    type: String,
    default: '',
    trim: true
  },
  contactNumber: {
    type: String,
    default: '',
    trim: true
  },
  userId: {
    type: Object,
    ref: 'User'
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

mongoose.model('Department', DepartmentSchema);
