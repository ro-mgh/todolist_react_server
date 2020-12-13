import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      required: true,
      enum: ['active', 'complete'],
      default: 'active'
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: true
    }
  },
  { timestamps: true }
)

itemSchema.index({ createdBy: 1, name: 1 }, { unique: false })

export const Item = mongoose.model('item_react', itemSchema)
