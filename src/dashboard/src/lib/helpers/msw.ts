import { setupWorker, rest } from 'msw'

interface LoginBody {
  username: string
}
interface LoginResponse {
  username: string
  firstName: string
}

const worker = setupWorker(
	rest.get< LoginResponse>('/login', (req, res, ctx) => {
    const username = "req.body"
    return res(
      ctx.json({
        username,
        firstName: 'John'
      })
    );
  }),
  rest.post<LoginBody, LoginResponse>('/login', (req, res, ctx) => {
    const { username } = req.body
    return res(
      ctx.json({
        username,
        firstName: 'John'
      })
    );
  }),
);
worker.start();