import jwt from 'jsonwebtoken'

// Definimos el middleware userExtractor
export const userExtractor = (req, res, next) => {
  // Obtenemos el encabezado 'authorization' de la solicitud
  const authorization = req.get('authorization')

  let token = null
  // Si el encabezado 'authorization' existe y comienza con 'bearer ', extraemos el token
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    token = authorization.substring(7)
  }

  // Si no hay token, devolvemos un error
  if (!token) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  let decodedToken = null
  let userId = null
  let userRol = null
  // Intentamos verificar el token
  try {
    decodedToken = jwt.verify(token, process.env.SECRET)
    // Si la verificación es exitosa, extraemos el id del usuario del token decodificado
    userId = decodedToken.id
    userRol = decodedToken.role
  } catch (error) {
    // Si la verificación falla, devolvemos un error
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  // Si el token decodificado no tiene un id, devolvemos un error
  if (!decodedToken.id) {
    return res.status(401).json({
      error: 'token missing or invalid'
    })
  }

  // Adjuntamos el id del usuario a la solicitud
  req.userId = userId
  req.userRol = userRol

  // Pasamos el control al siguiente middleware
  next()
}
