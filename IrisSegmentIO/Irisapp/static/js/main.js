(function($) {
    'use strict';

    $(document).ready(function() {
        // PRELOADER JS
        $(window).on('load', function() {
            $('.loadscreen').delay(1000).fadeOut();
            $('.preloader').delay(1000).fadeOut('slow');
        });

        // Function to send images to the server
        function uploadImages() {
            const files = $('#fileInput')[0].files;
            if (files.length > 0) {
                if (files.length > 30) {
                    alert('You can only upload up to 30 images.');
                    return;
                }

                $('#uploadBox').hide(); // Hide the upload box
                $('#extractContainer').hide(); // Hide the extract container
                $('#loadingContainer').show(); // Show the loading container

                // Create a FormData object to send files
                const formData = new FormData();

                Array.from(files).forEach(file => {
                    formData.append('images', file);
                });

                // Send images to the server using AJAX
                $.ajax({
                    url: '/upload/', // Update with your Django URL
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    success: function(response) {
                        $('#loadingContainer').hide(); // Hide loading container

                        // Decode the base64 zip data and create a Blob
                        const byteCharacters = atob(response.zip_data);
                        const byteNumbers = new Array(byteCharacters.length);
                        for (let i = 0; i < byteCharacters.length; i++) {
                            byteNumbers[i] = byteCharacters.charCodeAt(i);
                        }
                        const byteArray = new Uint8Array(byteNumbers);
                        const blob = new Blob([byteArray], { type: 'application/zip' });

                        // Create a link element for download
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'masks.zip'; // Set the desired filename
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);

                        // Update success container with download link
                        $('#successContainer').show(); // Show success container
                        $('#downloadLink').hide(); // Hide download link if download is triggered automatically
                    },
                    error: function(xhr, status, error) {
                        $('#loadingContainer').hide(); // Hide loading container
                        alert('Error uploading images: ' + error);
                    }
                });
            }
        }

        // FILE UPLOAD FUNCTIONALITY
        $('#uploadBox').on('click', function() {
            if ($('#imageOverlay').is(':hidden')) {
                $('#fileInput').click();
            }
        });

        $('#fileInput').on('change', function(event) {
            const files = event.target.files;
            if (files.length > 0) {
                if (files.length > 30) {
                    alert('You can only upload up to 30 images.');
                    return;
                }

                $('#uploadBox').hide(); // Hide the upload box
                $('#extractContainer').show(); // Show the extract container

                $('#uploadedImages').empty();

                Array.from(files).forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        $('#uploadedImages').append(`
                            <img src="${e.target.result}" alt="${file.name}" />
                        `);
                    }
                    reader.readAsDataURL(file);
                });

                console.log(files);
            }
        });

        $('#extractContainer').on('click', function() {
            uploadImages(); // Call the function to upload images
        });

        $('#showImagesBtn').on('click', function(e) {
            e.stopPropagation(); // Prevent triggering the upload function
            $('#imageOverlay').fadeIn();
            $('#transparentOverlay').fadeIn();
        });

        $('#closeOverlay').on('click', function() {
            $('#imageOverlay').fadeOut();
            $('#transparentOverlay').fadeOut();
        });

        $('#fileInput').on('click', function(e) {
            e.stopPropagation();
        });

        $('#imageOverlay').on('click', function(e) {
            e.stopPropagation();
        });

        $('#uploadBox').on('click', function(e) {
            e.stopPropagation();
        });

        $('#uploadMoreBtn').on('click', function() {
            $('#successContainer').hide(); // Hide the success container
            $('#uploadBox').show(); // Show the upload box
        });
    });

})(jQuery);
