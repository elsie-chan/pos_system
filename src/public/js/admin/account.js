$(document).ready(function () {
    $('.addAccountBtn').on('click', function () {
        addAccount();
    });
    $('.lockAccount').on('click', function () {
        let id = $(this).attr('data-id');
        lockAccount(id);
    });
    $('.resendEmail').on('click', function () {
        let email = $(this).attr('data-email');
        console.log(email)
        resendEmail(email);
    });
    $('.salesAccount').on('click', function () {
        let id = $(this).attr('data-id');
        salesAccount(id);
    })
})
function uploadImage() {
    let imageFile = $('#avatar-upload');
    let imagePreview = $('#avatar-account--preview');
    let imagePath;

    imageFile.on('change', function () {
        console.log()
        let image = this.files[0];
        console.log(image)
        imagePath = URL.createObjectURL(image);
        imagePreview.attr('src', imagePath);
    })
}
function addAccount() {
    let name = $('#account__fullname--add').val();
    let email = $('#account__email--add').val();

    $.ajax({
        url: '/api/v1/auth/create',
        type: 'POST',
        data: JSON.stringify({
            fullname: name,
            email: email,
        }),
        processData: false,
        contentType: "application/json",
        success: function (data) {
            console.log(data);
            location.reload();
            toastr.success('Success', 'Add account successfully', {timeOut: 5000});
        },
        error: function (err) {
            console.log(err)
        }
    })
}
function lockAccount(id) {
    $.ajax({
        url: '/api/account/lock/' + id,
        type: 'POST',
        success: function (data) {
            console.log(data.message.isLocked);
            toastr.success('Success');
        },
        error: function (err) {
            console.log(err)
        }
    })
}
function resendEmail(email) {
    $.ajax({
        url: '/api/v1/auth/send_mail',
        type: 'POST',
        contentType: "application/json",
        data: JSON.stringify({
            email: email
        }),
        success: function (data) {
            console.log(data.message);
            toastr.success('Success', data.message , {timeOut: 5000});
        },
        error: function (err) {
            console.log(err)
        }
    })
}
function salesAccount(id) {
    $.ajax({
        url: '/api/account/find',
        type: 'POST',
        data: JSON.stringify({
            email: id
        }),
        contentType: "application/json",
        processData: false,
        success: function (data) {
            console.log(data);
            // toastr.success('Success');
        },
        error: function (err) {
            console.log(err)
        }
    })
}