export const createOne = model => async (req, res) => {
  try {
    const createdBy = req.user._id
    const name = req.body.body.name
    if (name !== '') {
      const doc = await model.create({ name, createdBy })
      res.status(200).send({ task: doc })
    }
  } catch (e) {
    res
      .status(400)
      .send({
        emessage: 'Failed to add new task'
      })
      .end()
  }
}

export const updateOne = model => async (req, res) => {
  try {
    const createdBy = req.user._id
    const id = req.body.body.id
    const newStatus = req.body.body.toChange
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          createdBy: createdBy,
          _id: id
        },
        newStatus,
        { new: true }
      )
      .lean()
      .exec()

    if (!updatedDoc) {
      return res
        .status(400)
        .send({
          emessage: 'No task found'
        })
        .end()
    }

    res.status(200).send({ message: 'updated succesfully' })
  } catch (e) {
    res
      .status(400)
      .send({
        emessage: 'Failed to update status'
      })
      .end()
  }
}

export const removeOne = model => async (req, res) => {
  try {
    const createdBy = req.user._id
    const id = req.body.body.id
    const removed = await model.findOneAndRemove({
      createdBy: createdBy,
      _id: id
    })

    if (!removed) {
      return res
        .status(400)
        .send({
          emessage: 'Deletion to update status'
        })
        .end()
    }

    return res.status(200).send({ message: 'delete succesfully' })
  } catch (e) {
    res
      .status(400)
      .send({
        emessage: 'Deletion to update status'
      })
      .end()
  }
}

export const crudControllers = model => ({
  removeOne: removeOne(model),
  updateOne: updateOne(model),
  createOne: createOne(model)
})
