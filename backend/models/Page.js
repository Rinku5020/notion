const mongoose = require('mongoose');

const PageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', default: null },
    isTrashed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Page', PageSchema);
