import { Item } from '../resources/item/item.model'

export const getTasks = async (req, res) => {
  const user = req.user._id

  const tasksArr = await Item.find({
    createdBy: user
  })
    .lean()
    .exec()
  try {
    res.status(200).send({
      tasks: tasksArr
    })
  } catch (e) {
    return res
      .status(401)
      .send({ emessage: 'Error occured while getting tasks', error: e })
      .end()
  }
}
