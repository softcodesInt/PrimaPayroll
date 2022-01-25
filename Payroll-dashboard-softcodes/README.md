#### Setup

- cd `Payroll-dashboard-softcodes`
- Install the dependencies: `yarn install`    # if you don't have yarn, you will need to install it 
- Add the backend url to the environment
    - `export REACT_APP_BASE_URL=http://127.0.0.1:8000/api/v1`  # this is how to set environment variable on unix os, if you
    use a windows os, google how to set environment variable
      
- Start the server: `yarn start:dev`



#### DIRECTORY BREAKDOWN
The source code is situated in the `src/` directory

- `assets/`: contains images and all
- `components/`: These are the reusable components the entire app uses like loaders, form inputs, modals, layouts etc
- `pages/`: These are the pages of the app, and it consists of two sub directories:
    - `auth/`: This houses authentication pages: login, reset password and set password
    - `dashboard/`: This consists of the protected pages after an admin signs in
  
- `redux/`:  The redux integration such as actions, selectors, types and reducers lives here
- `routes/`: The url of each page lives here
- `services/`: The api configuration and how to communicate with the backend lives here
    The backend `BASE_URL` is extracted here, it reads the value set from the environment variable.
  
- `utils/`: consists of other reusable tools used