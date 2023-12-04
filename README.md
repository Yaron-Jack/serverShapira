# Lira Shapira Server 
This is the backend for the new Lira Shapira App, a local eco-currency. Earn by donating organic waste to your local compost project!

 <p align='center'>
    <img src='https://github.com/LiraShapira/app/assets/78416008/86655879-8047-4253-ac93-c1e88969f0ca' width='200' />
  </p>

## More Info
- [frontend](https://github.com/LiraShapira/app)
- [Our site](https://lirashapira.org/)

## Join us!
contributions welcome! 😊 
To start work on the app:

##### Requirements

- Postgres DB instance
- node v16 or higher

##### Steps
- fork & clone the repo.
- create .env file from .env.template at base of project
- run `npm i`
- run `npm run seed`, this should result in output:
  - LIRA_SHAPIRA_USER_ID:  2528b7df-ew04-4095-9ce9-4f3fe5cce23c
  - copy this id to your .env
- from the root of server repo, run `npm run devstart`
- your server should be ready to accept requests
