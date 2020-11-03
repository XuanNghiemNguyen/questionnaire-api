const express = require('express')
const Makers = require('../models/maker.model')
const asyncHandler = require('express-async-handler')
const router = express.Router()

const {CATEGORIES} = require('../constants/index')

router.post(
    '/',
    asyncHandler(async (req, res, next) => {
      try {
        const { searchText } = req.body;
        const _searchText = new RegExp('.*' + searchText + '.*');
        return res.json({
          success: false,
          result: searchText
            ? await Makers.find({ name: { $regex: _searchText, $options: 'i' } })
            : (await Makers.find()).map(i => i.id),
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: error.toString(),
        });
      }
    }),
  );
router.post('/create', asyncHandler(async (req, res, next) => {
    try {
        const { name, description, category } = req.body
        if (!name || !category || !CATEGORIES.includes(category))
            throw new Error(`check ${JSON.stringify(req.body)} again!`)
        const newMaker = new Makers();
        newMaker.name = name;
        newMaker.description = description;
        newMaker.category = category;
        newMaker.createdAt = Date.now();
        await newMaker.save();
        return res.json({
            success: false,
            result: newMaker
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.toString()
        })
    }
}))
module.exports = router;