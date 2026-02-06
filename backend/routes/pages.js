const express = require('express');
const { validationResult } = require('express-validator');

const Page = require('../models/Page');
const Block = require('../models/Block');
const auth = require('../middleware/auth');
const { pageValidation } = require('../validation/pages');

const router = express.Router();

router.get('/', auth, async (req, res, next) => {
  try {
    const query = req.query.q?.toLowerCase();
    const pages = await Page.find({ userId: req.user.userId, isTrashed: false }).sort({ updatedAt: -1 });

    if (!query) {
      return res.json(pages);
    }

    const results = [];
    for (const page of pages) {
      if (page.title.toLowerCase().includes(query)) {
        results.push(page);
        continue;
      }

      const blocks = await Block.find({ pageId: page._id });
      const match = blocks.some((block) => JSON.stringify(block.content).toLowerCase().includes(query));
      if (match) {
        results.push(page);
      }
    }

    return res.json(results);
  } catch (error) {
    return next(error);
  }
});

router.post('/', auth, pageValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, parentId } = req.body;
    const page = await Page.create({ userId: req.user.userId, title, parentId: parentId || null });

    return res.status(201).json(page);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const page = await Page.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }
    return res.json(page);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', auth, pageValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, parentId, isTrashed } = req.body;
    const page = await Page.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, parentId: parentId || null, isTrashed: Boolean(isTrashed) },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    return res.json(page);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const page = await Page.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isTrashed: true },
      { new: true }
    );

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
