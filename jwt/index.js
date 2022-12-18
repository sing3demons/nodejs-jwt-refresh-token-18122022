const jwt = require('jsonwebtoken')

const jwtGenerate = user => {
  const accessToken = jwt.sign({ name: user.name, id: user.id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '3m',
    algorithm: 'HS256',
  })
  return accessToken
}

const jwtRefreshTokenGenerate = user => {
  const refreshToken = jwt.sign({ name: user.name, id: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '1d',
    algorithm: 'HS256',
  })

  return refreshToken
}

const jwtValidate = (req, res, next) => {
  try {
    if (!req.headers['authorization']) return res.sendStatus(401)

    const token = req.headers['authorization'].replace('Bearer ', '')

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) throw new Error(error)
    })
    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}

const jwtRefreshTokenValidate = (req, res, next) => {
  try {
    if (!req.headers['authorization']) return res.sendStatus(401)
    const token = req.headers['authorization'].replace('Bearer ', '')

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err) throw new Error(error)

      req.user = decoded
      req.user.token = token
      delete req.user.exp
      delete req.user.iat
    })
    next()
  } catch (error) {
    return res.sendStatus(403)
  }
}

const generateJWT = user => {
  const accessToken = jwt.sign(
    {
      sub: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '1h',
    }
  )

  const refreshToken = jwt.sign(
    {
      sub: user._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '1d',
    }
  )
  return { accessToken, refreshToken }
}

module.exports = {
  jwtGenerate,
  jwtRefreshTokenGenerate,
  jwtValidate,
  jwtRefreshTokenValidate,
  generateJWT,
}
