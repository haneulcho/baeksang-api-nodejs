import Winner from '../models/winner';

export const findById = (req, res) => {
  Winner.find({ awards_no: req.params.id })
    .then((result) => {
      if (!result || !result.length) {
        return res.status(404).json({ message: '해당 회차 결과를 찾을 수 없습니다.' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {
      ;
    });
};

export const findByDivision = (req, res) => {
  Winner.find({ awards_no: req.params.id, division: req.params.division })
    .then((result) => {
      if (!result || !result.length) {
        return res.status(404).json({ message: '해당 회차 부문에 따른 결과를 찾을 수 없습니다.' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {
      ;
    });
};

export default {
  findById,
  findByDivision,
};
