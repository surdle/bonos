import jwt from 'jsonwebtoken'
export const userExtractor = (req, res, next) => {
  const authorization = req.get('authorization')

  let token = null
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  if (!token) {
    return res.status(401).json({
      error: 'token missing or invalid'
    }
    )
  }

  let decodedToken = null
  let userId = null
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
    userId = decodedToken.id
  } catch (error) {
    return res.status(401).json({
      error: 'token missing or invalid'
    }
    )
  }

  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    }
    )
  }

  req.userId = userId

  next()
}
