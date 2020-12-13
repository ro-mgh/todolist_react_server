require('dotenv/config')

export const config = {
  secrets: {
    jwt: process.env.JWT_SECRET
  },
  dbUrl: process.env.DB_CONNECTION || 'mongodb://localhost/your-app-name'
}
