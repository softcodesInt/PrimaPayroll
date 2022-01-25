# Backend Service
This Repo houses the RESTFUL APIs and the Loan decision tree

**Backend**

* [Django](https://www.djangoproject.com/)
* [Django REST framework](http://www.django-rest-framework.org/) Django REST framework is a powerful and flexible toolkit for building Web APIs
* [Django REST Knox](https://github.com/James1345/django-rest-knox) Token based authentication for API endpoints
* [WhiteNoise](http://whitenoise.evans.io/en/latest/django.html) to serve files efficiently from Django
* [Prospector](http://prospector.landscape.io/en/master/) a complete Python static analysis tool
* [Bandit](https://github.com/openstack/bandit) a security linter from OpenStack Security
* [pytest](http://pytest.org/latest/) a mature full-featured Python testing tool
* [Mock](http://www.voidspace.org.uk/python/mock/) mocking and testing Library
* [Responses](https://github.com/getsentry/responses) a utility for mocking out the Python Requests library


## Readme Notes

* If the command line starts with $, the command should run with user privileges
* If the command line starts with #, the command should run with root privileges


#### Prerequisites
* Install [Python, PIP and Virtualenv](https://timmyreilly.azurewebsites.net/python-pip-virtualenv-installation-on-windows/)
* Install [POSTGRESQL](https://www.microfocus.com/documentation/idol/IDOL_12_0/MediaServer/Guides/html/English/Content/Getting_Started/Configure/_TRN_Set_up_PostgreSQL.htm)
* CREATE A DATABASE with this info
* database name: "payrollapi", database user "payrollapi_dev", database password "password" without quotes

#### Installation
* `cd primerfit-api` 
* Create a new virtualenv `mkvirtualenv virtualenv`
* `pip install -r requirements.txt`
* `cd src`
* `$ python manage.py migrate`      # migrates all the tables
* `$ python manage.py runserver`    # this runs the server



# CONFIGURATION
- `payrollapi/settings/dev.py` should be used for development
- `payrollapi/settings/prod.py` should be used for production