const { Router } = require('express')
const { jwtValidate, jwtGenerate, jwtRefreshTokenGenerate, jwtRefreshTokenValidate } = require('../jwt/index.js')
const router = Router()

const users = [
  { id: 1, name: 'John', refresh: null },
  { id: 2, name: 'Tom', refresh: null },
  { id: 3, name: 'Chris', refresh: null },
  { id: 4, name: 'David', refresh: null },
]

router.get('/', jwtValidate, (req, res) => {
  res.send('Hello World!')
})

router.post('/auth/login', (req, res) => {
  const { name } = req.body

  //find user
  const user = users.findIndex(e => e.name === name)

  if (!name || user < 0) {
    return res.send(400)
  }

  const access_token = jwtGenerate(users[user])
  const refresh_token = jwtRefreshTokenGenerate(users[user])

  users[user].refresh = refresh_token

  res.json({
    access_token,
    refresh_token,
  })
})

router.post('/auth/refresh', jwtRefreshTokenValidate, (req, res) => {
  const user = users.find(e => e.id === req.user.id && e.name === req.user.name)

  const userIndex = users.findIndex(e => e.refresh === req.user.token)

  if (!user || userIndex < 0) return res.sendStatus(401)

  const access_token = jwtGenerate(user)
  const refresh_token = jwtRefreshTokenGenerate(user)
  users[userIndex].refresh = refresh_token

  return res.json({
    access_token,
    refresh_token,
  })
})

module.exports = router
