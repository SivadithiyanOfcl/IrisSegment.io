# IrisSegment.io

# Setup
To get this repository, run the following command inside your git-enabled terminal:

```git clone https://github.com/SivadithiyanOfcl/IrisSegment.io.git```

##### Note: In-order to run the project, use your base/virtual environment. and locate to the requirements.txt in your folder and install the necessary libraries.

```pip install -r requirements.txt```

You need to make one last adjustment before running the code: Locate the utils.py file under the EDMMGC\myapp and replace the following line of code


Once you have downloaded Django, navigate to the cloned repo directory and run the following:

```python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver```

## Once the server is hosted, visit http://127.0.0.1:8000/ to access the app.
