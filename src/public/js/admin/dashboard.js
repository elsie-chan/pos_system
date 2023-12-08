$(document).ready(function () {
    $('#statistic_invoice').on('change', function () {
        const value = $(this).val();
        console.log(value)
        $('.date').addClass('d-none');
        if(value === 'specific') {
            $('.date').removeClass('d-none');

            $('#filter').on('click', function () {
                const start = $('#start_date').val();
                const end = $('#end_date').val();
                console.log(start, end)
                specificStatistic(start, end);
            });
            return;
        }
        getStatistic(value);
    })
    $('.detail-invoice').on('click', function (e) {
        const id = $(this).data('id');
        console.log(id)
        invoiceDetail(id);
    });
});

function getStatistic(value) {
    $('.invoice__list').empty();
    $.ajax({
        url: `/api/statistic/get_statistics/${value}`,
        type: 'GET',
        success: function (data) {
            console.log(data)
            $('#revenue').text(data.revenue.toLocaleString('en-US', {style: 'currency', currency: 'USD'}));
            $('#total_staff').text(data.staffQuantity);
            $('#total_customer').text(data.customerQuantity);
            $('#total_product').text(data.productQuantity);
            if (data.invoices.length === 0) {
                $('.invoice__list').append(`
                    <tr>
                        <td colspan="5" class="text-center">No data</td>
                    </tr>
                `)
                return;
            }
            data.invoices.forEach(function (invoice) {
                $('.invoice__list').append(`
                    <tr>
                                        <td>
                                            <div class="d-flex px-2 py-1">
                                                <div class="d-flex flex-column justify-content-center">
                                                    <h6 class="mb-0 text-sm">${invoice.customer[0].fullname }</h6>
                                                    <p class="text-xs text-secondary mb-0">${ invoice.customer[0].phone }</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <span class="text-secondary text-xs font-weight-bold">${ invoice.account[0].fullname }</span>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <span class="text-secondary text-xs font-weight-bold">${ invoice.productQuantity }</span>
                                        </td>
                                        <td class="align-middle text-center">
                                            <span class="text-secondary text-xs font-weight-bold">${'$'+ invoice.total}</span>
                                        </td>
                                        <td class="align-middle text-center">
                                            <span class="text-secondary text-xs font-weight-bold">${ new Date(invoice.datePurchase).toLocaleString()}</span>
                                        </td>
                                        <td class="align-middle text-center">
                                            <a href="" class="detail-invoice text-secondary font-weight-bold text-xs" data-bs-toggle="modal" data-bs-target="#invoiceDetailModal" data-id="${ invoice._id }">
                                                View detail &emsp;
                                            </a>
                                        </td>
                                    </tr>
                `)
            })
            $('.detail-invoice').on('click', function (e) {
                const id = $(this).data('id');
                console.log(id)
                invoiceDetail(id);
            });
        },
        error: function (error) {
            console.log(error)
        }
    })
}

function invoiceDetail(id) {
    $.ajax({
        url: "/api/invoice/get/" + id,
        type: 'GET',
        success: function (data) {
            console.log(data)
            $('.invoice__detail').empty();
            data.forEach(function (invoice) {
                $('#detail').html(`
                    <div class=" mb-2">
                                <div class="card-body">
                                    <h5 class="card-title">Invoice id: ${ invoice._id }</h5>
                                    <div class="row justify-content-between">
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Fullname:

                                                <span
                                                        class="fw-light text-muted">${ invoice.customer[0].fullname }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Phone: <span
                                                        class="fw-light text-muted">${ invoice.customer[0].phone}</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Address: <span
                                                        class="fw-light text-muted">${ invoice.customer[0].address }</span>
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
                                                        class="fw-light text-muted">${ invoice.productQuantity }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Total: <span
                                                        class="fw-light text-muted">${ invoice.total }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Time: <span
                                                        class="fw-light text-muted">${ new Date(invoice.datePurchase).toLocaleString() }</span>
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
                                                        class="fw-light text-muted">${ invoice.paymentMethod }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Take: <span
                                                        class="fw-light text-muted">${ invoice.take }</span>
                                            </h6>
                                        </div>
                                        <div class="col">
                                            <h6 class="card-subtitle fw-semibold">Change: <span
                                                        class="fw-light text-muted">${ invoice.change }</span>
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
                                            ${ invoice.products.map( (product) => {
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
            })
        },
    })
}
function specificStatistic(start, end) {
    $('.invoice__list').empty();
    $.ajax({
        url: `/api/statistic/filter_invoice?from=${start}&to=${end}`,
        type: 'GET',
        success: function (data) {
            console.log(data)
            $('#revenue').text(data.revenue.toLocaleString('en-US', {style: 'currency', currency: 'USD'}));
            $('#total_staff').text(data.staffQuantity);
            $('#total_customer').text(data.customerQuantity);
            $('#total_product').text(data.productQuantity);
            if (data.invoices.length === 0) {
                $('.invoice__list').append(`
                    <tr>
                        <td colspan="5" class="text-center">No data</td>
                    </tr>
                `)
                return;
            }
            data.invoices.forEach(function (invoice) {
                $('.invoice__list').append(`
                    <tr>
                                        <td>
                                            <div class="d-flex px-2 py-1">
                                                <div class="d-flex flex-column justify-content-center">
                                                    <h6 class="mb-0 text-sm">${invoice.customer[0].fullname }</h6>
                                                    <p class="text-xs text-secondary mb-0">${ invoice.customer[0].phone }</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="align-middle text-center text-sm">
                                            <span class="text-secondary text-xs font-weight-bold">${ invoice.productQuantity }</span>
                                        </td>
                                        <td class="align-middle text-center">
                                            <span class="text-secondary text-xs font-weight-bold">${'$'+ invoice.total}</span>
                                        </td>
                                        <td class="align-middle text-center">
                                            <span class="text-secondary text-xs font-weight-bold">${ new Date(invoice.datePurchase).toLocaleString()}</span>
                                        </td>
                                        <td class="align-middle text-center">
                                            <a href="" class="detail-invoice text-secondary font-weight-bold text-xs" data-bs-toggle="modal" data-bs-target="#invoiceDetailModal" data-id="${invoice._id}">
                                                View detail &emsp;
                                            </a>
                                        </td>
                                    </tr>
                `)
            })
            $('.detail-invoice').on('click', function (e) {
                const id = $(this).data('id');
                console.log(id)
                invoiceDetail(id);
            });
        },
        error: function (error) {
            console.log(error)
        }
    })
}