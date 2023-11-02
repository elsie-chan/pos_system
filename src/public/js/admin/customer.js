$(document).ready(function() {
    $('.saveCustomerBtn').on('click', function() {
        addCustomer();
    });
    $('.editCustomer').on('click', function() {
        let phone = $(this).attr('data-phone');
        console.log(phone);
        fillData(phone);
        $('.saveEditCustomerBtn').on('click', function() {
            updateCustomer(phone);
        })
    });
    $('.deleteCustomer').on('click', function() {
        let id = $(this).attr('data-id');
        $('.delete-customer').on('click', function() {
            deleteCustomer(id);
        });
    })
});
function addCustomer() {
    $.ajax({
        url: '/api/customer/create',
        type: 'POST',
        data: JSON.stringify({
            fullname: $('#customer_name').val(),
            phone: $('#customer_phone').val(),
            address: $('#customer_address').val()
        }),
        contentType: "application/json",
        success: function(data) {
            console.log(data)
            location.href = '/admin/customer';
            toastr.success('Success', 'Add customer successfully', {timeOut: 5000});
        },
        error: function(err) {
            console.log(err);
            toastr.error('Error', "Can\'t add account", {timeOut: 5000});
        }
    })
}
function fillData(phone) {
    $.ajax({
        url: '/api/customer/get',
        type: 'POST',
        data: JSON.stringify({
            phone: phone
        }),
        contentType: "application/json",
        success: function (data) {
            $('#edit--customer_name').val(data[0].fullname);
            $('#edit--customer_phone').val(data[0].phone);
            $('#edit--customer_address').val(data[0].address);
        },
        error: function (err) {
            console.log(err)
        }
    })
}
function updateCustomer(phone) {
    $.ajax({
        url: '/api/customer/update/' + phone ,
        type: 'PUT',
        data: JSON.stringify({
            fullname: $('#edit--customer_name').val(),
            phone: $('#edit--customer_phone').val(),
            address: $('#edit--customer_address').val()
        }),
        contentType: "application/json",
        success: function (data) {
            console.log(data)
            location.href = '/admin/customer';
            toastr.success('Success', 'Update customer successfully', {timeOut: 5000});
        },
        error: function (err) {
            console.log(err)
        }
    })
}
function deleteCustomer(id) {
    $.ajax({
        url: '/api/customer/delete/' + id,
        type: 'DELETE',
        success: function (data) {
            console.log(data)
            location.href = '/admin/customer';
            toastr.success('Success', 'Delete customer successfully', {timeOut: 5000});
        },
        error: function (err) {
            console.log(err)
        }
    })
}