const express = require('express');
const router = express.Router();
const userRouter = require("./user");
const queueRouter = require('./queue');
const appointmentRouter = require('./appointment');

router.use("/user", userRouter);
router.use('/queue', queueRouter);
router.use('/appointment', appointmentRouter);

module.exports = router;