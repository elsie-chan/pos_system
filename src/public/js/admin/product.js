$(document).ready(function () {
    uploadImage();

    $('.saveProductBtn').on('click', function () {
        addProduct();
    });
    $('.update-product').on('click', function () {
        let id = $(this).attr('data-id');
        console.log(id)
        fillData(id);
        uploadImageEdit();
        $('.saveEditProductBtn').on('click', function () {
            updateProduct(id);
        });
    });
    $('.remove').on('click', function(e) {
        e.preventDefault();
        let id = $(this).attr('data-id');
        $('.remove-product').on('click', function (e) {
            e.preventDefault();
            deleteProduct(id);
        });
    })

});

function uploadImage() {
    let imageFile = $('#image_upload--add');
    let imagePreview = $('#image_preview');
    let imagePath;
    console.log($('#image_preview').attr('src'))

    imageFile.on('change', function () {
        console.log()
        let image = this.files[0];
        console.log(image)
        imagePath = URL.createObjectURL(image);
        imagePreview.attr('src', imagePath);
    })
}
function uploadImageEdit() {
    let imageFile = $('#edit--image_file');
    let imagePreview = $('#edit--image_preview');
    let imagePath;
    console.log('edit image preview:'+ imagePreview.attr('src'));

    imageFile.on('change', function () {
        console.log("edit image");
        let image = this.files[0];
        imagePath = URL.createObjectURL(image);
        imagePreview.attr('src', imagePath);
        console.log(imagePreview.attr('src'));
    })
}
function addProduct() {
    let name = $('#product_name').val();
    let importPrice = $('#import_price').val();
    let retailPrice = $('#retail_price').val();
    let category = $('#product_category').val();
    let image = $('#image_upload--add')[0].files[0];

    let data = new FormData()
    data.append('name', name)
    data.append('importPrice', importPrice)
    data.append('retailPrice', retailPrice)
    data.append('category', category)
    data.append('image', image)

    $.ajax({
        url: '/api/product/create',
        type: 'POST',
        data: data,
        processData: false,
        contentType: false,
        success: function (data) {
            // console.log(data)
            location.href = '/admin/product'
            toastr.success(data.message, 'Success', {timeOut: 5000})
        },
        error: function (err) {
            console.log(err)
        }
    })
}
function fillData(id) {
    $.ajax({
        url: '/api/product/get/' + id,
        type: 'GET',
        success: function (data) {
            console.log(data)
            $('#edit--product_name').val(data.name);
            $('#edit--product_barcode').val(data._id);
            $('#edit--import_price').val(data.importPrice);
            $('#edit--retail_price').val(data.retailPrice);
            $('#edit--product_category').val(data.category);
            $('#edit--image_preview').attr('src', '/images/uploads/products/' + data.image);
        },
        error: function (err) {
            console.log(err)
        }
    })
}
function updateProduct(id) {
    let name = $('#edit--product_name').val();
    let barcode = $('#edit--product_barcode').val();
    let importPrice = $('#edit--import_price').val();
    let retailPrice = $('#edit--retail_price').val();
    let category = $('#edit--product_category').val();
    let image = $('#edit--image_file')[0].files[0];
    console.log(image)

    let data = new FormData()
    data.append('name', name)
    data.append('barcode', barcode)
    data.append('importPrice', importPrice)
    data.append('retailPrice', retailPrice)
    data.append('category', category)
    data.append('image', image)

    console.log(data)

    $.ajax({
        url: '/api/product/update/' + id,
        type: 'PUT',
        data: data,
        processData: false,
        contentType: false,
        success: function (data) {
            console.log(data)
            // location.href = '/admin/product'
            toastr.success(data.message, 'Success', {timeOut: 5000});
            location.reload();
        },
        error: function (err) {
            console.log(err)
        }
    })
}
function deleteProduct(id) {
    $.ajax({
        url: '/api/product/delete/' + id,
        type: 'DELETE',
        success: function () {
            location.href = '/admin/product'
            toastr.success("Delete product", 'Success', {timeOut: 5000})
        },
        error: function (err) {
            console.log(err)
        }
    })
}

