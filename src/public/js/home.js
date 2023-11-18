$(document).ready(function () {
  uploadItemSlidebar();
});

function uploadItemSlidebar() {
    const sidebarItems = document.querySelectorAll('.slidebar-item');
    const homeSection = document.getElementById('home-section');
    const paymentSection = document.getElementById('payment-section');
    const paymentSuccessSection = document.getElementById('payment-success-section');
    const orHomeSection = document.getElementById('order-home');
    const orPaymentSection = document.getElementById('order-payment');
    const orPaymentSuccessSection = document.getElementById('order-payment-success');

    sidebarItems.forEach(function (item) {
      item.addEventListener('click', function () {
      // Xoá class 'item_active' từ tất cả các item
      sidebarItems.forEach(function (item) {
        item.querySelector('a').classList.remove('item_active');
      });

      // Thêm class 'item_active' cho item được nhấn
      item.querySelector('a').classList.add('item_active');
      if (item.classList.contains('home-item')) {
        showHome();
      } else if (item.classList.contains('payment-item')) {
        showPayment();
      }
      else if (item.classList.contains('account-item')) {
        showAccount();
      }
    });
  });

  function showHome() {
    homeSection.style.display = 'block';
    paymentSection.style.display = 'none';
    paymentSuccessSection.style.display = 'none';
    orHomeSection.style.display = 'block';
    orPaymentSection.style.display = 'none';
    orPaymentSuccessSection.style.display = 'none';
  }

  function showPayment() {
    homeSection.style.display ='none';
    paymentSection.style.display = 'block';
    paymentSuccessSection.style.display = 'none';
    orHomeSection.style.display = 'none';
    orPaymentSection.style.display = 'block';
    orPaymentSuccessSection.style.display = 'none';
  }

  const showAccount = () => {
    homeSection.style.display ='none';
    paymentSection.style.display = 'none';
    paymentSuccessSection.style.display = 'block';
    orHomeSection.style.display = 'none';
    orPaymentSection.style.display = 'none';
    orPaymentSuccessSection.style.display = 'block';
  }

}