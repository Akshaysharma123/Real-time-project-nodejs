import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin'

// add button hs.
const addToCart  = document.querySelectorAll('.add-to-cart');

// increment button  
const cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza){
    // Post reqs.
    axios.post('/update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: '1000',
            text: 'Product Add to Cart'
        }).show();
    }).catch(err => {
        new Noty({
            type: 'error',
            timeout: '1000',
            text: 'Product Add to Cart'
        }).show();
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza)
    })
})

const alertMsg = document.querySelector('#success-alert')
if (alertMsg) [
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
]

initAdmin()