import jwt from 'jsonwebtoken';

const EXCLUDED_ROUTES = [
  { route: '/register', method: 'POST' },
  { route: '/login', method: 'POST' },
  { route: '/admin/login', method: 'POST' },
  { route: '/refresh_token', method: 'POST' },
  { route: '/admin/refresh_token', method: 'POST' }
];

const verifyToken = (reqRole) => (req, res, next) => {
  const isExcluded = EXCLUDED_ROUTES.some((excluded) => {
    const normalizedPath = req.path.replace(/\/$/, '');

    return excluded.route === normalizedPath && (!excluded.method || excluded.method === req.method);
  });

  if (isExcluded) return next();
  
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  const secret =
    reqRole === 'admin' ? process.env.ADMIN_ACCESS_SECRET_TOKEN : process.env.USER_ACCESS_SECRET_TOKEN;

  try {
    const decoded = jwt.verify(token, secret);

    if (decoded.role !== reqRole) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    req.user = decoded;
    req.user.token = token;

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export default verifyToken;
