const mongoose = require('mongoose');

const BlockSchema = new mongoose.Schema(
  {
    pageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Page', required: true },
    type: {
      type: String,
      enum: ['text', 'heading', 'todo', 'code', 'list'],
      required: true,
    },
    content: { type: mongoose.Schema.Types.Mixed, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Block', BlockSchema);
