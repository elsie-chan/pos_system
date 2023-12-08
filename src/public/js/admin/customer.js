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
    });
    $('.viewDetail').on("click", function() {
        let id = $(this).attr('data-id');
        console.log(id);
        viewDetail(id);
    });
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
function viewDetail(id) {
    $('#history__list').empty();
    $.ajax({
        url: '/api/invoice/get_invoice_by_customer/' + id,
        type: 'POST',
        contentType: "application/json",
        processData: false,
        success: function (data) {
            console.log(data);
            if (data.length === 0) {
                $('#history__list').append(`<h5 class="text-center">No invoice</h5>`);
                return;
            }
            data.forEach(function (invoice) {
                const template = `
                <div class="card mb-2">
                                <div class="card-body">
                                    <h5 class="card-title">Invoice id: ${invoice._id}</h5>
                                    <div class="row justify-content-between">
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Quantity: <span
                                                        class="fw-light text-muted">${invoice.productQuantity}</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Total: <span
                                                        class="fw-light text-muted">${invoice.total}</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Time: <span
                                                        class="fw-light text-muted">${new Date(invoice.datePurchase).toLocaleString()}</span>
                                            </h6>
                                        </div>
                                      
                                    </div>
                                    <div class="row justify-content-between">
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Payment method: <span
                                                        class="fw-light text-muted">${invoice.paymentMethod}</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Take: <span
                                                        class="fw-light text-muted">${invoice.take}</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Change: <span
                                                        class="fw-light text-muted">${invoice.change}</span>
                                            </h6>
                                        </div>
                                        
                                    </div>
                                    <div class="table-responsive p-0">
                                        <table class="table align-items-center mb-0">
                                            <thead>
                                            <tr>
                                                <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                                    Product
                                                </th>
                                                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                                    Brand
                                                </th>
                                                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                                    Price
                                                </th>
                                                <th class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">
                                                    Quantity
                                                </th>
                                                <th></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            ${ invoice.products.map(product =>
                    `
                                                <tr>
                                                    <td>
                                                        <div class="d-flex px-2 py-1">
                                                            <div>
                                                                <img src="/images/uploads/products/${product.products.image}"
                                                                     class="avatar avatar-sm me-3" alt="user1">
                                                            </div>
                                                            <div class="d-flex flex-column justify-content-center">
                                                                <h6 class="mb-0 text-sm">${product.products.name}</h6>
                                                                <p class="text-xs text-secondary mb-0">${product.products._id}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="align-middle text-center">
                                                        <p class="text-xs text-secondary mb-0">${product.products.category}</p>
                                                    </td>
                                                    <td class="align-middle text-center">
                                                        <p class="text-xs text-secondary mb-0">${product.products.retailPrice}</p>
                                                    </td>
                                                    <td class="align-middle text-center">
                                                        <p class="text-xs text-secondary mb-0">${product.quantity}</p>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
            `
                $('#history__list').append(template);
            })

        },
        error: function (err) {
            console.log(err)
        }
    })
}