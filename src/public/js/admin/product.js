// js to get all products data
const productTable = $('#productTable');
const tbody = $('#productTable tbody');

let myModal = new bootstrap.Modal(document.getElementById('editProductModal'))

// ajax request to get all products
$(document).ready(function () {
    ajaxAllProduct();
});

function ajaxAllProduct(
    page = 0,
    size = 10
) {
    let tbody = $('#productTable tbody');
    let html = "";
    let index = 1;
    $.ajax({
        url: `/api/product/getAllProducts`,
        type: "GET",
        dataType: "json",
        contentType: "application/json",
        async: false,
        success: function (data) {
            console.log(data)
            data.map(function (product, index) {
                html +=
                    `
                        <tr id="${product.id}">
                                <td>${index++}</td>
                                <td style="min-width: 200px;">
                                    <p>${product._id}</p>
                                </td>
                                <td>
                                    <p>${product.name}</p>
                                </td>
                                <td>
                                    <p>${product.category}</p>
                                </td>
                                <td>
                                    <p>${product.importPrice}</p>
                                </td>
                                <td>
                                    <p>${product.retailPrice}</p>
                                </td>
                                <td>
                                    <p>${product.createdAt}</p>
                                </td>
                                
                                <td>
                                    <div class="d-flex flex-row gap-1">
                                        <button class="editBtn btn btn-primary p-1 m-1" data-bs-toggle="modal"
                                                data-bs-target="#editProductModal">Edit
                                        </button>
                                        <button class="deleteBtn btn btn-danger p-1 m-1" data-bs-toggle="modal"
                                                data-bs-target="#deleteProductModal">Delete
                                        </button>
                                    </div>
                            </tr>
                    `;
            })
            tbody.html(html);
        },
        error: function (error) {
            console.log("Error");
        }
    })

}