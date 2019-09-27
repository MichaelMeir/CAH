# CAH 🃏

School project to recreate Cards Against Humanity as a web application

 * [Trello](https://trello.com/b/OgEWE9v6/cah)
 * [Project Document](https://docs.google.com/document/d/1kLjY055EVXxt8uHrTNBsvc903VmObTEjeBEUzurITAU/)
 * [Documentation](https://github.com/MichaelMeir/CAH/wiki)
 * [Usage Documentation (sprint #1)](https://docs.google.com/document/d/140VfEZmT8CUH6iFzybjzhuYkgIx_JdL6TPucEy5zs-k/edit?usp=sharing)

## Installation ⚙️
1. Clone the repository and make sure to run a single `npm install` in the `client` and `server` directory.
2. Make sure to run the following command in the `server` directory: `cp env.example .env` and fill in your database credentials.
3. To generate the required certificates and keys, please run the provided script. `./generateKey.sh`, in the `server` directory.
4. The final step before the application , you must run `npm run dev` in both `server` and `client` directory. In case you are on a Windows device, we have setup a temporarily `server` script that you have to run instead: `npm run windev`.
5. Enjoy the client side of the application at https://localhost:8080 and the server side of the application (the API) at https://localhost:9000 🎉
