
  # Premium Educational App for Kids

  This is a code bundle for Premium Educational App for Kids. The original project is available at https://www.figma.com/design/4PMuGFfO0jamsJ1Olpa1fg/Premium-Educational-App-for-Kids.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Gemini API key

  Copy `.env.example` to `.env.local` and set your Gemini API key:

  ```text
  GEMINI_API_KEY=your-gemini-api-key
  ```

  Keep the real key only in `.env.local` or your hosting provider's server-side environment settings. Do not use a `VITE_` prefix: Vite exposes variables with that prefix to browser code. `.env.local` is ignored by Git.

  Start or restart the development app with `npm run dev` after changing `.env.local`. In AI Teacher, open **Settings** and choose **Test connection**. For a production Node deployment, build with `npm run build` and run the app server with `npm start`; set `GEMINI_API_KEY` in the server environment.
  