$(document).ready(function () {
    $('.addProduct').on('click', function () {
        const id = $(this).data('id');
        console.log(id)
        addProductToSession(id);
    });
    $('#addProductByNameBtn').on('click', function () {
        const name = $('.barcode').val();
        console.log(name);
        searchProductByName(name);
    });
    $('#addProductBtn').on('click', function () {
       const barcode = $('.barcode').val();
        console.log(barcode)
        addProductToSession(barcode);
    });

    registerDeleteProductFirstTime();

    $('.quantity').on('change', function () {
        const id = $(this).data('quantity');
        const quantity = $(this).val();
        console.log(id, quantity)
        updateQuantity(id, quantity);
    });
});

function addProductToSession(id) {
    $.ajax({
        url: '/add_product_to_session/' + id,
        method: 'GET',
        success: function (response) {
            console.log(response)
            $('#order__list').empty();
            $('#order__list').html(response.products.map(product => {
                return `
                <tr class="">
                                    <td>
                                        <img src="/images/uploads/products/${product.information.image}" alt="contact-img"
                                             title="contact-img" class="rounded mr-2" height="48" />
                                    </td>
                                    <td class="text-right">
                                        <h5 class="m-0 text-truncate">${product.information.name}</h5>
                                        <p class="mb-0 text-muted">${'$'+product.information.retailPrice}</p>
                                        <input type="text" class="form-text w-20 p-0 m-0 form-control-plaintext quantity" data-id="${product.id}" data-quantity="${product.id}" value="${product.quantity}"/>
                                    </td>
                                    <td class="text-right cursor-pointer deleteProduct" data-id="${product.id}">
                                        <box-icon type='solid' name='trash'></box-icon>
                                    </td>
                                </tr>
                `
            }));
            $('.checkoutBtn').removeAttr('onclick');
            $('.totalPrice').text(response.total);
            $('.deleteProduct').on('click', function () {
                const id = $(this).data('id');
                console.log(id)
                deleteProductFromSession(id);
            });
            $('.quantity').on('change', function () {
                const id = $(this).data('quantity');
                const quantity = $(this).val();
                console.log(id, quantity)
                updateQuantity(id, quantity);
            });
        },
        error: function (err) {
            toastr.error(err.responseJSON.message, 'Incorrect barcode', {timeOut: 3000})
            console.log(err)
        }
    })
}
function deleteProductFromSession(id) {
    $.ajax({
            url: '/delete_product_from_session/' + id,
            type: 'DELETE',
            success: function (response) {
                console.log(response)
                if(response.products.length === 0) {
                    $('.checkoutBtn').attr('onclick', 'return false;')
                }
                $('#order__list').html(response.products.map(product => {
                    return `
                <tr class="">
                                    <td>
                                        <img src="/images/uploads/products/${product.information.image}" alt="contact-img"
                                             title="contact-img" class="rounded mr-2" height="48" />
                                    </td>
                                    <td class="text-right">
                                        <h5 class="m-0 text-truncate">${product.information.name}</h5>
                                        <p class="mb-0 text-muted">${'$'+product.information.retailPrice}</p>
                                        <input type="text" class="form-text w-20 p-0 m-0 form-control-plaintext quantity" data-quantity="${product.id}" value="${product.quantity}"/>
                                    </td>
                                    <td class="text-right cursor-pointer deleteProduct" data-id="${product.id}">
                                        <box-icon type='solid' name='trash'></box-icon>
                                    </td>
                                </tr>
                `
                }));
                $('.totalPrice').text(response.total);
                $('.deleteProduct').on('click', function () {
                    const id = $(this).data('id');
                    console.log(id)
                    deleteProductFromSession(id);
                });
                $('.quantity').on('change', function () {
                    const id = $(this).data('quantity');
                    const quantity = $(this).val();
                    console.log(id, quantity)
                    updateQuantity(id, quantity);
                });
            },
            error: function (err) {
                console.log(err)
            }
    })
}

function registerDeleteProductFirstTime() {
    const products = $(".deleteProduct");
    products.on('click', function () {
        const id = $(this).data('id');
        console.log(id)
        deleteProductFromSession(id);
    });
}
function updateQuantity(id, quantity) {
    $.ajax({
        url: '/update_quantity/' + id,
        method: 'PUT',
        data: {
            quantity
        },
        success: function (response) {
            console.log(response)
            $('.totalPrice').text(response.total);
            $('#order__list').html(response.products.map(product => {
                return `
                <tr class="">
                                    <td>
                                        <img src="/images/uploads/products/${product.information.image}" alt="contact-img"
                                             title="contact-img" class="rounded mr-2" height="48" />
                                    </td>
                                    <td class="text-right">
                                        <h5 class="m-0 text-truncate">${product.information.name}</h5>
                                        <p class="mb-0 text-muted">${'$'+product.information.retailPrice}</p>
                                        <input type="text" class="form-text w-20 p-0 m-0 form-control-plaintext quantity" data-quantity="${product.id}" value="${product.quantity}"/>
                                    </td>
                                    <td class="text-right cursor-pointer deleteProduct" data-id="${product.id}">
                                        <box-icon type='solid' name='trash'></box-icon>
                                    </td>
                                </tr>
                `
            }));
            $('.quantity').on('change', function () {
                const id = $(this).data('quantity');
                const quantity = $(this).val();
                console.log(id, quantity)
                updateQuantity(id, quantity);
            });
            $('.deleteProduct').on('click', function () {
                const id = $(this).data('id');
                console.log(id)
                deleteProductFromSession(id);
            });
        },
        error: function (err) {
            console.log(err)
        }
    })
}

function searchProductByName(name) {
    console.log(name)
    $.ajax({
        url: '/api/product/find',
        method: 'POST',
        data: JSON.stringify({
            name
        }),
        contentType: 'application/json',
        success: function (response) {
            console.log(response)
            if(response.length === 0) {
                toastr.error('No available product', {timeOut: 3000})
                return;
            }
            $('.product--list').html(response.map(product => {
                return `
                    <div class="col-sm-6 col-md-4 col-lg-3 mt-4">
                                <div class="card text-center addProduct" data-id="${ product._id }">
                                    <img
                                            class="card-img-top"
                                            src="/images/uploads/products/${ product.image ? product.image : '1698328374688.png' }"
                                            alt="Card image"
                                            width="200px"
                                            height="200px"
                                    />
                                    <div class="card-body">
                                        <h4 class="card-title text-truncate" data-bs-toggle="tooltip"
                                            title="${ product.name }">${ product.name }</h4>
                                        <p class="card-text">${'$'+ product.retailPrice }</p>
                                        <a href="#" class="stretched-link"></a>
                                    </div>
                                </div>
                            </div>
                `
            }));
            $('.addProduct').on('click', function () {
                const id = $(this).data('id');
                console.log(id)
                addProductToSession(id);
            });
            $('.deleteProduct').on('click', function () {
                const id = $(this).data('id');
                console.log(id)
                deleteProductFromSession(id);
            });
        },
        error: function (err) {
            console.log(err)
        }
    })
}





