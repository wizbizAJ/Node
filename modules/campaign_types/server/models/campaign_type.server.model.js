'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Campaign_type Schema
 */
var Campaign_typeSchema = new Schema({
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
  afterCta: {
    type: String,
    enum: [
      'Yes',
      'No'
    ],
    trim: true,
    required: 'Pre-Recorded Campaigns is required.'
  },
  duringCta: {
    type: String,
    enum: [
      'Yes',
      'No'
    ],
    trim: true
  },
  adminOnly: {
    type: String,
    enum: [
      'Yes',
      'No'
    ],
    trim: true
  },
  duringBroadcast: {
    type: String,
    enum: [
      'Yes',
      'No'
    ],
    trim: true
  },
  broadcastEvent: {
    type: String,
    enum: [
      'Yes',
      'No'
    ],
    trim: true
  },
  linkProducts: {
    type: String,
    enum: [
      'Yes',
      'No'
    ],
    trim: true
  },
  productLineOption: {
    type: Object,
    ref: 'ProductLine'
  },
  channel: {
    type: Object,
    ref: 'Product_Communication_Channel'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  lastActivity: {
    type: Object
  }
});

mongoose.model('Campaign_type', Campaign_typeSchema);
