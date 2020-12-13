import { User } from './user.model'

// not in use (but tbc)
export const me = (req, res) => {
  res.status(200).json({ data: req.user })
}
