# React + Vite

## Product image uploads

Product images are uploaded from the browser directly to Cloudinary. Copy `.env.example` to `.env` for local development and set `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET`. The upload preset must be **unsigned**. In Cloudinary, restrict it to image formats and a suitable maximum file size; set its destination folder if desired. Never put the Cloudinary API secret in a `VITE_` variable or frontend code.

Set the same two `VITE_CLOUDINARY_*` variables in the Vercel project environment and redeploy. The frontend sends the returned `secure_url` to the backend as JSON; the backend does not need Cloudinary credentials for product uploads.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
