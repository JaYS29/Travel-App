const mongoose = require('mongoose');

const { Schema } = mongoose;
const defaultRequiredNumber = {
  type: Number,
  required: true,
};

const logEntrySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  comments: String,
  image: String,
  rating: {
    type: Number,
    min: 0,
    max: 10,
    default: 0,
  },
  latitude: {
    ...defaultRequiredNumber,
    min: -90,
    max: 90,
  },
  longitude: {
    ...defaultRequiredNumber,
    min: -180,
    max: 180,
  },
  visitDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;
