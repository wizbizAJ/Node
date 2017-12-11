'use strict';

/**
 * Module dependencies
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Advertisement Schema
 */
var AdvertisementSchema = new Schema({
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
  durationTime: {
    type: String,
    default: '',
    trim: true,
    required: 'Duration Time be blank'
  },
  ar: {
    type: String,
    trim: true
  },
  mediaSelector: {
    type: Array
  },
  primaryMedia: {
    type: String
  },
  productId: {
    type: Schema.ObjectId,
    ref: 'Product'
  },
  campaign_company: {
    type: Schema.ObjectId,
    ref: 'Campaign_company',
    required: 'Campaign Company cannot be blank'
  },
  styleLookId: {
    type: Schema.ObjectId,
    ref: 'StyleLook'
  },
  description: {
    type: String,
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
  option: {
    type: String,
    enum: [
      'Image',
      'Product',
      'StyleLook',
      'AR'
    ],
    trim: true,
    required: 'Option cannot be blank'
  },
  type: {
    type: Schema.ObjectId,
    ref: 'Campaign_category',
    required: 'Type cannot be blank'
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  lastActivity: {
    type: Object
  }
});

mongoose.model('Advertisement', AdvertisementSchema);
