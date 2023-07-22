import Candidate from '../models/candidate';

export const findAll = (req, res) => {
  Candidate.find()
    .then((result) => {
      if (!result) {
        return res.status(404).json({ message: '등록된 후보가 없습니다.' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {});
};

export const findByDivision = (req, res) => {
  Candidate.find({ division: req.params.division })
    .then(function (result) {
      if (!result) {
        return res.status(404).json({ message: '해당 부문 후보를 찾을 수 없습니다.' });
      } else {
        return res.status(200).json(result);
      }
    })
    .catch((err) => {});
};

export default {
  findAll,
  findByDivision,
};
