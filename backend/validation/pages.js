const { body } = require('express-validator');

const pageValidation = [
  body('title').trim().notEmpty().withMessage('Title required'),
  body('parentId').optional({ nullable: true }).isMongoId().withMessage('Invalid parentId'),
];

module.exports = { pageValidation };
