import Prize from '../models/prize';

export const findAll = (req, res) => {
  Prize.find()
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: '등록된 상이 없습니다.' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {});
};

export const findByDivision = (req, res) => {
  Prize.find({ division: req.params.division })
    .then((result) => {
      if (!result || !result.length) {
        return res.status(404).json({ message: '해당 부문을 찾을 수 없습니다.' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {});
};

export const findByPrizeCode = (req, res) => {
  req.params.code = req.params.code.toUpperCase();
  Prize.find({ division: req.params.division, code: req.params.code })
    .then((result) => {
      if (!result || !result.length) {
        return res.status(404).json({ message: '해당 상을 찾을 수 없습니다.' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {});
};

export default {
  findAll,
  findByDivision,
  findByPrizeCode,
};
