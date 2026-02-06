const express = require('express');
const { body, validationResult } = require('express-validator');

const Block = require('../models/Block');
const Page = require('../models/Page');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/:pageId', auth, async (req, res, next) => {
  try {
    const page = await Page.findOne({ _id: req.params.pageId, userId: req.user.userId });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    const blocks = await Block.find({ pageId: page._id }).sort({ order: 1 });
    return res.json(blocks);
  } catch (error) {
    return next(error);
  }
});

router.put(
  '/:pageId',
  auth,
  body('blocks').isArray().withMessage('Blocks array required'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const page = await Page.findOne({ _id: req.params.pageId, userId: req.user.userId });
      if (!page) {
        return res.status(404).json({ error: 'Page not found' });
      }

      const { blocks } = req.body;

      await Block.deleteMany({ pageId: page._id });
      const inserted = await Block.insertMany(
        blocks.map((block, index) => ({
          pageId: page._id,
          type: block.type,
          content: block.content,
          order: block.order ?? index,
        }))
      );

      return res.json(inserted);
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
