const { fetchUtilityLocations } = require('../services/tomTomService');

const getUtilities = async (req, res, next) => {
  try {
    const { category, lat, lng } = req.query;
    if (!category || !lat || !lng) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const utilities = await fetchUtilityLocations(category, lat, lng);
    res.json(utilities);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUtilities };