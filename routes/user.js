const { Router } = require('express')
const User = require('../models/user.js')
const { generateJWT, jwtVerify, jwtRefreshTokenVerify } = require('../jwt/index.js')
const router = Router()

router.get('/profile', jwtVerify, async (req, res) => {
  const { userId } = req.tokenDt
  const user = await User.findById(userId)
  res.json(user)
})

router.post('/auth/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body

  const exitsEmail = await User.findOne({ email: email })
  if (exitsEmail) {
    return res.status(400).json({
      resultCode: 40000,
      resultDescription: 'email duplicate',
    })
  }

  const user = new User()
  user.fistName = first_name
  user.lastName = last_name
  user.email = email
  user.password = await user.encryptPassword(password)
  await user.save()

  res.status(201).json({
    resultCode: 20100,
    resultDescription: 'create user',
    resultData: user,
  })
})

router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(400).json({
      resultCode: 40000,
      resultDescription: 'error',
      resultData: 'email or password invalid',
    })
  }

  const isValid = await user.checkPassword(password)
  if (!isValid) {
    return res.status(400).json({
      resultCode: 40000,
      resultDescription: 'error',
      resultData: 'email or password invalid',
    })
  }

  const { accessToken, refreshToken } = generateJWT(user)

  res.status(200).json({
    resultCode: 20000,
    resultDescription: 'login',
    resultData: { accessToken, refreshToken },
  })
})

router.post('/auth/refresh', jwtRefreshTokenVerify, async (req, res) => {
  const { userId } = req.refreshToken
  const user = await User.findById(userId)

  if (!user) return res.sendStatus(401)

  const { accessToken, refreshToken } = generateJWT(user)

  return res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
  })
})

module.exports = router
