$(document).ready(function () {
    $('.saveInvoiceBtn').on('click', function () {
        addInvoice();
    });
});

function addInvoice() {
    let fullname = $('#customer_name')
    let phone = $('#customer_phone')
    let address = $('#customer_address')
    let take = $('#invoice_take')

    $.ajax({
        url: '/api/invoice/create',
        type: 'POST',
        data: JSON.stringify({
            take: take,
            customer: JSON.stringify({
                fullname: fullname,
                phone: phone,
                address: address
            })
        }),
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