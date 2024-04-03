
const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItermsContaine = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById ("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")



//Criando um Array para itens selecionados//
let cart = [];

//Abrir o carrinho
cartBtn.addEventListener("click", function() {
  updateCartModal()
  cartModal.style.display = 'flex'

})

//Fechar o carrinho 

cartModal.addEventListener('click' , function(event){
  if (event.target === cartModal){
    cartModal.style.display ='none'
  } 
})

closeModalBtn.addEventListener("click" , function(event){
  cartModal.style.display = 'none'

})

menu.addEventListener("click", function(event) {
 
  let item = event.target.closest(".add-to-cart-btn")
 
 if(item){
  const name = item.getAttribute("data-name")
  const price = parseFloat(item.getAttribute("data-price"))
  
  //preciso Add no carrinho//
  toCart(name , price)

 }
  
})

//Funçao para adcionar ao carrinho//

function toCart(name, price){

const existeItem = cart.find (item => item.name === name )

if(existeItem){
  existeItem.quantity += 1

}else{
  cart.push({
    name,
    price,
    quantity: 1,


  })
}
   updateCartModal()
  
}
// atualizar o carrinho //

function updateCartModal(){
  cartItermsContaine.innerHTML = "";
  let total = 0;

 cart.forEach(item =>{
   const creatItemElement = document.createElement("div")
   creatItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

   creatItemElement.innerHTML = `

    <div class="flex items-center justify-between" > 

        <div>
          <p class="font-bold" > ${item.name} </p>
          <p> Unidades ${item.quantity} </p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)} </p>
        </div>
        
       
         <button class="remover-btn" data-name="${item.name}"> Remover </button>
       
    </div>

   `
    total += item.price * item.quantity

   cartItermsContaine.appendChild(creatItemElement)
   

 })
  //Metodos para transformar a moeda em real//
 cartTotal.textContent = total.toLocaleString("pt-BR",{
 style:"currency",
  currency: "BRL"

 })
   
 cartCounter.innerHTML = cart.length
}

//função para a remoção do item//

cartItermsContaine.addEventListener("click", function (event) {
 if(event.target.classList.contains("remover-btn")){
  const name = event.target.getAttribute("data-name")

   removeItemCart(name)
 }
})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name)


  if (index !== -1 ){
     const item = cart[index]
     
     if(item.quantity > 1){
        item.quantity -= 1
        updateCartModal()  
        return
     }
        cart.splice(index, 1) 
        updateCartModal()
       
  }
}

addressInput.addEventListener("imput", function(event){
 let inputValue = event.target.value

 if(inputValue !== 0){
  addressWarn.classList.add("hidden")

  addressInput.classList.remove("border-red-500")
 }

})

checkoutBtn.addEventListener("click" , function(){

    const isOpen = checkRestaurantOpen()
    if(!isOpen){
      Toastify({
        text: "OPS! Restaurante esta fechado :( ",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "rigth", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "#ef4444",
        },
        
      }).showToast();
     }


  if (cart.length === 0) return ;
  if (addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return
  }
  
  //Encaminhar pedido para whatsapp//
  const cartItens = cart.map((item)=>{
    return(
      ` ${item.name} Quantidade: (${item.quantity}) preço: R$ ${item.price} ***`
    )
  }).join("")

  const mensagem = encodeURIComponent(cartItens)
  const phone = "5585982112279"

  window.open (`https://wa.me/${phone}?text=${mensagem} Endereço: ${addressInput.value}`)

  cart =[]
  updateCartModal()

})
 //Verificando se o restaurante esta aberto
 function checkRestaurantOpen (){
  const data = new Date()
  const hora = data.getHours()
  return hora >= 17 && hora < 23; 
 }

 const spanItem = document.getElementById("date-span")
 const isOpen = checkRestaurantOpen()

 if(isOpen){
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-600")


 }else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")

 }