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
        console.log(id)
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
            toastr.success('Success', data.message, {timeOut: 5000});
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function salesAccount(id) {
    $('#invoice__list').empty();
    $.ajax({
        url: '/api/invoice/get_invoice_by_account/' + id,
        type: 'POST',
        contentType: "application/json",
        processData: false,
        success: function (data) {
            console.log(data);
            if (data.length === 0) {
                $('#invoice__list').append(`<h5 class="text-center">No invoice</h5>`);
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
                $('#invoice__list').append(template);
            })

        },
        error: function (err) {
            console.log(err)
        }
    })
}