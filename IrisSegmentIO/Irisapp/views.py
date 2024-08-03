from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
import tensorflow as tf
import cv2
import numpy as np
import io
import os
import zipfile
import base64
from PIL import Image
from io import BytesIO

def index(request):
    return render(request, 'index.html')

model_path = os.path.join(settings.BASE_DIR, 'Irisapp', 'static', 'models', 'unet.h5')
try:
    model = tf.keras.models.load_model(model_path)
except Exception as e:
    model = None
    print(f'Error loading model: {e}')

@csrf_exempt
def upload_images(request):
    if request.method == 'POST':
        if model is None:
            return JsonResponse({'status': 'error', 'message': 'Model could not be loaded'}, status=500)

        files = request.FILES.getlist('images')

        try:
            zip_buffer = BytesIO()
            with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                for file in files:
                    image_array, original_size = process_image(file)
                    mask_image = generate_mask(image_array)
                    mask_image = resize_mask(mask_image, original_size)

                    # Convert mask image to bytes
                    mask_image_bytes = BytesIO()
                    mask_image.save(mask_image_bytes, format='PNG')
                    mask_image_bytes.seek(0)

                    # Save each mask as a file in the zip archive
                    mask_filename = f'{os.path.splitext(file.name)[0]}_mask.png'
                    zip_file.writestr(mask_filename, mask_image_bytes.getvalue())

            zip_buffer.seek(0)
            zip_file_base64 = base64.b64encode(zip_buffer.getvalue()).decode('utf-8')
            response_data = {
                'status': 'success',
                'zip_data': zip_file_base64
            }
            return JsonResponse(response_data)

        except Exception as e:
            print(f'Error processing images: {e}')
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

def process_image(file):
    # Convert uploaded file to a format OpenCV can use
    file_content = file.read()
    image_array = np.frombuffer(file_content, np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    
    original_size = (image.shape[1], image.shape[0])  # (width, height)
    
    # Resize the image to 256x256 using OpenCV with interpolation
    resized_image_array = cv2.resize(image, (256, 256), interpolation=cv2.INTER_AREA)
    
    # Normalize the image
    resized_image_array = resized_image_array / 255.0
    resized_image_array = np.expand_dims(resized_image_array, axis=0)  # Add batch dimension
    return resized_image_array, original_size

def generate_mask(image_array):
    # Predict the mask using the U-Net model
    mask = model.predict(image_array)
    mask = np.squeeze(mask)  # Remove batch dimension
    mask = (mask > 0.5).astype(np.uint8) * 255  # Binarize mask
    
    # Convert the mask to an image
    mask_image = Image.fromarray(mask)
    return mask_image

def resize_mask(mask_image, original_size):
    # Resize the mask to the original image dimensions using PIL
    mask_image = mask_image.resize(original_size, Image.LANCZOS)
    return mask_image
