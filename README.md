# IrisSegment.io

IrisSegment.io is a web-based platform designed for processing images of the human eye's iris 👁️. Users can upload photos and images focused on the iris region 📸, and the website will process these images to generate relatively precise masks highlighting the iris area 🕵️‍♂️. These masks are valuable for various applications in iris segmentation and analysis 🔍, enabling detailed study and processing of the iris region. Whether for research, medical diagnostics, or other applications, IrisSegment.io provides an efficient tool for extracting and analyzing the iris region from images 💻.

# Setup
To get this repository, run the following command inside your git-enabled terminal:

```
git clone https://github.com/SivadithiyanOfcl/IrisSegment.io.git
```

##### Note: In-order to run the project, use your base/virtual environment. and locate to the requirements.txt in your folder and install the necessary libraries.

```
pip install -r requirements.txt
```
Go to my kaggle page and download [this model](https://www.kaggle.com/models/sivadithiyan/irisunet) and put it inside the following location in your device:

```
C?D?E:\your base directory here\IrisSegmentIO\Irisapp\static\models
```

You need to make one last adjustment before running the code: Locate the utils.py file under the IrisSegmentIO/Irisapp and replace the following line of code
```
model_path = os.path.join(settings.BASE_DIR, 'Irisapp', 'static', 'models', 'model.h5')
```
Make sure your model name is correct and the base directory is setup as well.

Once you have downloaded Django, navigate to the cloned repo directory and run the following:

```
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

## Once the server is hosted, visit http://127.0.0.1:8000/ to access the app.
