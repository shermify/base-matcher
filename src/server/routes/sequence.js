import Sequence from "../models/Sequence";
import { getMatchIndices } from "../utils";

const routes = (router) => {
  /**
   * GET /sequence
   * Returns an array of sequence objects
   *
   * match - the string to match
   * count - boolean to request document count
   * id - sequence id to query a single record
   */
  router.get("/sequence", async (req, res) => {
    const { match, count, id } = req.query;

    if (count) {
      const count = await Sequence.countDocuments().exec();
      return res.json(count);
    }

    let query = {};
    if (id) {
      query.id = id;
    }
    if (match) {
      query.bases = { $regex: match, $options: "i" };
    }

    const results = await Sequence.find(query).lean().exec();

    if (!match) return res.json(results);

    const json = getMatchIndices(results, match);
    res.json(json);
  });

  /**
   * POST /sequence
   * Route to accept json file uploads
   */
  router.post("/sequence", async (req, res) => {
    const { files } = req;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const json = JSON.parse(file.buffer);
      await Sequence.findOneAndUpdate({ id: json.id }, json, {
        upsert: true,
      }).exec();
    }

    res.sendStatus(200);
  });
};

export default routes;
