const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { runInTransaction } = require('mongoose-transact-utils');

const Events = require('../models/event.model');
const EventMakers = require('../models/event-maker.model');

const { CATEGORIES } = require('../constants/index');

const validateCategories = (record) => {
  if (Object.keys(record).length === CATEGORIES.length)
    return Object.keys(record).every((item) => CATEGORIES.includes(item));
  return false;
};

router.post(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      const { searchText } = req.body;
      const _searchText = new RegExp('.*' + searchText + '.*');
      return res.json({
        success: false,
        result: searchText
          ? await Events.find({ name: { $regex: _searchText, $options: 'i' } })
          : await Events.find(),
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.toString(),
      });
    }
  }),
);
router.post(
  '/create',
  asyncHandler(async (req, res, next) => {
    try {
      const {
        name,
        description,
        startTime,
        endTime,
        categoriesName,
      } = req.body;
      if (!name || !startTime || !endTime || !categoriesName)
        throw new Error(`check ${JSON.stringify(req.body)} again!`);
      if (!validateCategories(categoriesName))
        throw new Error(`check ${JSON.stringify(categoriesName)} again!`);

      const newEvent = new Events();
      newEvent.name = name;
      newEvent.description = description;
      newEvent.startTime = startTime;
      newEvent.endTime = endTime;
      newEvent.categoriesName = categoriesName;
      newEvent.createdAt = Date.now();
      await newEvent.save({session: session});
      return res.json({
        success: false,
        result: newEvent,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.toString(),
      });
    }
  }),
);
router.post(
    '/addMakersIntoEvent',
    asyncHandler(async (req, res, next) => {
      try {
        await runInTransaction(async session => {
            const {
              eventId,
              makerIds
            } = req.body;
            if (!eventId || !makerIds || !makerIds.length)
              throw new Error(`check ${JSON.stringify(req.body)} again!`);
            const _makerIds = Array.from(new Set(makerIds))
            let _inputs = _makerIds.length ? _makerIds.map(makerId => ({
                makerId: makerId,
                eventId: eventId,
                deletedAt: 0,
                createdAt: Date.now(),
            })) : [];

            let _existMakers = await EventMakers.find({ eventId })
            if(_existMakers && _existMakers.length) {
                _existMakers =  _existMakers.map(item => item.makerId)
                _inputs = _inputs.filter(input => !_existMakers.includes(input.makerId))
            }

            _inputs && _inputs.length && await EventMakers.insertMany(_inputs, {session: session})
            // throw new Error(" test")
            return res.json({
              success: false,
              result: _inputs,
            });
        })
      } catch (error) {
          console.log(error)
        return res.status(400).json({
          success: false,
          message: error.toString(),
        });
      }
    }),
  );
module.exports = router;