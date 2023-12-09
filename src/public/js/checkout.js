$(document).ready(()=> {
    $('.phoneNumber').on('change', function () {
        const phoneNumber = $(this).val();
        console.log(phoneNumber)
        checkPhoneNumber(phoneNumber);
    });
    $('#received').on('change', function () {
        // check the customer information
        let phoneNumber = $('.phoneNumber').val();
        let fullname = $('.fullname').val();
        let address = $('.address').val();
        if(phoneNumber === '' || fullname === '' || address === '') {
            toastr.error('Please enter customer information!');
            return;
        }
        // check the received
        let received = $(this).val();
        let total = $(this).attr('min');
        if(Number(received) < Number(total)) {
            $('#errorMessage').text('Received must be greater than ' + total + ' !');
            $(this).val('');
            return;
        }
        $('#errorMessage').text('');
        const change = received - total;
        $('.change').text('$'+change);
    });
    $('#btnPay').on('click', function () {
        let phoneNumber = $('.phoneNumber').val();
        let fullname = $('.fullname').val();
        let address = $('.address').val();
        if(phoneNumber === '' || fullname === '' || address === '') {
            toastr.error('Please enter customer information!');
            return;
        }

        if ($('#received').val() === '') {
            toastr.error('Please enter received money!');
            return;
        }

        // check the customer
        if ($('.more').attr('data-id') === '') {
            createCustomer(phoneNumber, fullname, address);
        }
        // create invoice
        const take = $('#received').val();
        console.log(phoneNumber, take)
        createInvoice(phoneNumber, take);
    });
})

function checkPhoneNumber(phoneNumber) {
    $.ajax({
        url: '/api/customer/get',
        method: 'POST',
        data: {
            phone: phoneNumber
        },
        success: function (response) {
            console.log(response)
            if (response.length == 0) {
                toastr.info('New customer')
                $('.more').attr('data-id', '');
                $('.fullname').val('');
                $('.address').val('');
                return;
            }
            const id = response[0]._id;
            $('.more').attr('data-id', response[0]._id);
            $('.more').attr('data-bs-target', "#viewDetailModal");
            $('.fullname').val(response[0].fullname);
            $('.address').val(response[0].address);
            viewDetail(id);
        },
        error: function (error) {
            console.log(error)
            toastr.info('New customer')
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

function createCustomer(phoneNumber, fullname, address) {
    $.ajax({
        url: '/api/customer/create',
        type: 'POST',
        data: JSON.stringify({
            phone: phoneNumber,
            fullname,
            address
        }),
        contentType: "application/json",
        success: function(data) {
            console.log(data)
        },
        error: function(err) {
            console.log(err);
        }
    })
}

function createInvoice(customer, take) {
    $.ajax({
        url: '/api/invoice/create',
        type: 'POST',
        data: JSON.stringify({
            take: take,
            customer: {
                "phone": customer
            }
        }),
        contentType: "application/json",
        processData: false,
        success: function (data) {
            console.log(data);
            $('.customer').addClass('d-none');
            $('.checkout--section').empty();
            $('.checkout--section').html(`
            <!--PAYMENT SUCCESSFULLY-->
    
            <h3 class="normal-text text-success pb-3 text-center">PAYMENT SUCCESSFULL</h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="70"
              height="70"
              viewBox="0 0 70 70"
              fill="none"
              class="d-block mx-auto mb-4"
            >
              <path
                d="M35.0002 5.83325C18.9585 5.83325 5.8335 18.9583 5.8335 34.9999C5.8335 51.0416 18.9585 64.1666 35.0002 64.1666C51.0418 64.1666 64.1668 51.0416 64.1668 34.9999C64.1668 18.9583 51.0418 5.83325 35.0002 5.83325ZM47.2502 30.0416L33.2502 44.0416C32.0835 45.2083 30.3335 45.2083 29.1668 44.0416L22.7502 37.6249C21.5835 36.4583 21.5835 34.7083 22.7502 33.5416C23.9168 32.3749 25.6668 32.3749 26.8335 33.5416L31.2085 37.9166L43.1668 25.9583C44.3335 24.7916 46.0835 24.7916 47.2502 25.9583C48.4168 27.1249 48.4168 28.8749 47.2502 30.0416Z"
                fill="#83DBAF"
              />
            </svg>
            <div class="row mb-2">
                <div class="col-6">
                    <h6 class="text-md-start">Customer name</h6>
                </div>
                <div class="col-6">
                    <h6 class="text-end total">${data.customer[0].fullname}</h6>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <h6 class="text-md-start">Phone number</h6>
                </div>
                <div class="col-6">
                    <h6 class="text-end total">${data.customer[0].phone}</h6>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <h6 class="text-md-start">Address</h6>
                </div>
                <div class="col-6">
                    <h6 class="text-end total">${data.customer[0].address}</h6>
                </div>
            </div>
            <div class="row mb-2">
                <div class="col-6">
                    <h6 class="text-md-start">Total</h6>
                </div>
                <div class="col-6">
                    <h6 class="text-end total">${data.total}</h6>
                </div>   
     
          </div>
          <div class="row mb-2 justify-content-between">
            <div class="col-6">
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#invoiceDetailModal">See detail</button>
            </div>
            <div class="col-6">
              <a href="/"><button type="button" class="btn btn-primary">Home</button></a>
            </div>

            `);


                $('#detail').html(`
                    <div class=" mb-2">
                                <div class="card-body">
                                    <h5 class="card-title">Invoice id: ${ data._id }</h5>
                                    <div class="row justify-content-between">
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Fullname:

                                                <span
                                                        class="fw-light text-muted">${ data.customer[0].fullname }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Phone: <span
                                                        class="fw-light text-muted">${ data.customer[0].phone}</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Address: <span
                                                        class="fw-light text-muted">${ data.customer[0].address }</span>
                                            </h6>
                                        </div>
                                        <div class="col-1 text-end invisible">
                                            <div class="d-flex align-items-center gap-2 cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg"
                                                     class="icon icon-tabler icon-tabler-dots" width="24" height="24"
                                                     viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                     fill="none"
                                                     stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                                    <path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                                                    <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                                                    <path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row justify-content-between">
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Quantity: <span
                                                        class="fw-light text-muted">${ data.productQuantity }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Total: <span
                                                        class="fw-light text-muted">${ data.total }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Time: <span
                                                        class="fw-light text-muted">${ new Date(data.datePurchase).toLocaleString() }</span>
                                            </h6>
                                        </div>
                                        <div class="col-1 text-end">
                                            <div class="d-flex align-items-center gap-2 cursor-pointer">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row justify-content-between">
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Payment method: <span
                                                        class="fw-light text-muted">${ data.paymentMethod }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Take: <span
                                                        class="fw-light text-muted">${ data.take }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Change: <span
                                                        class="fw-light text-muted">${ data.change }</span>
                                            </h6>
                                        </div>
                                        <div class="col-1 text-end invisible">
                                            <div class="d-flex align-items-center gap-2 cursor-pointer">

                                            </div>
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
                                            ${ data.products.map( (product) => {
                    return `
                                                   <tr>
                                                    <td>
                                                        <div class="d-flex px-2 py-1">
                                                            <div>
                                                                <img src="/images/uploads/products/${ product.products.image }"
                                                                     class="avatar avatar-sm me-3" alt="user1">
                                                            </div>
                                                            <div class="d-flex flex-column justify-content-center">
                                                                <h6 class="mb-0 text-sm">${ product.products.name }</h6>
                                                                <p class="text-xs text-secondary mb-0">${ product.products._id }</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="align-middle text-center">
                                                        <p class="text-xs text-secondary mb-0">${ product.products.category }</p>
                                                    </td>
                                                    <td class="align-middle text-center">
                                                        <p class="text-xs text-secondary mb-0">${ product.products.retailPrice }</p>
                                                    </td>
                                                    <td class="align-middle text-center">
                                                        <p class="text-xs text-secondary mb-0">${ product.quantity }</p>
                                                    </td>
                                                </tr> 
                                                `
                })
                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                `)
                $('.print').on('click', function () {
                    printPDF(document.getElementById('detail'));
                })
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function printPDF(content) {
    var opt = {
        margin:       10,
        filename:     'invoice.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().from(content).set(opt).save();
}