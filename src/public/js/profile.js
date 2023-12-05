$(document).ready(function () {
    $('#change_avatar').on('change', function () {
        uploadImage();
        let formData = new FormData();
        formData.append('avatar', $('#change_avatar')[0].files[0]);

        $.ajax({
            url: '/api/account/update_avatar',
            type: 'PUT',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                console.log(response)
                toastr.success('Upload avatar successfully')
            },
            error: function() {
                toastr.error('Cannot upload avatar');
            }
        });
    })
});

function uploadImage() {
    let imageFile = $('#change_avatar');
    let imagePreview = $('#preview_avatar');
    let imagePath;
    console.log($('#image_preview').attr('src'))

    imageFile.on('change', function () {
        let image = this.files[0];
        console.log(image)
        imagePath = URL.createObjectURL(image);
        imagePreview.attr('src', imagePath);
    })
}