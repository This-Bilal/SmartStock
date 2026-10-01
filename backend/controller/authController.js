const asyncHandler = require('express-async-handler')

const checkLoginStatus = asyncHandler(async (req, res) => {
  res.status(200).json(true);
});

module.exports = {
    checkLoginStatus
}