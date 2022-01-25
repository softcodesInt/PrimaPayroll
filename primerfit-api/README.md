# Backend Service
This Repo houses the RESTFUL APIs for the softcode's adminstration panel

**Backend**

* [Django](https://www.djangoproject.com/)
* [Django REST framework](http://www.django-rest-framework.org/) Django REST framework is a powerful and flexible toolkit for building Web APIs
* [Django REST Knox](https://github.com/James1345/django-rest-knox) Token based authentication for API endpoints
* [WhiteNoise](http://whitenoise.evans.io/en/latest/django.html) to serve files efficiently from Django


## Readme Notes

* If the command line starts with $, the command should run with user privileges
* If the command line starts with #, the command should run with root privileges


#### Prerequisites
* Install [Python, PIP and Virtualenv](https://timmyreilly.azurewebsites.net/python-pip-virtualenv-installation-on-windows/)
* Install [POSTGRESQL](https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm)
* CREATE A DATABASE with this info
* database name: "primerfitapi", database user "primerfitapi_dev", database password "password" without quotes

#### Installation
* `cd primerfit-api` 
* Create a new virtualenv `mkvirtualenv virtualenv`
* `pip install -r requirements.txt`
* `cd src`
* `$ python manage.py migrate`      # migrates all the tables
* `python manage.py loaddata fixtures.json`    # populate the data with an admin user: email: system@admin.com pw: admin123
* `$ python manage.py runserver`    # this runs the server



# CONFIGURATION
- `primerfitapi/settings/dev.py` should be used for development
- `primerfitapi/settings/prod.py` should be used for production

The environment variables for production needs to be added in the production server with the name used
e.g, `os.environ.get('SENDER_EMAIL')`, this means the label for the value in the secrets of the production server will be
SENDER_EMAIL