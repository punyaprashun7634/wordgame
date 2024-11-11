let categoryContainer = document.querySelector('.category-container');

let response = await fetch('../data.json');
let data = await response.json();


let categoryFiller = (data)=>{
    for(let [key, value] of Object.entries(data.categories)){
        let categoryBtn = document.createElement('a');
        categoryBtn.classList.add('categoryBtn', 'bounce');
        categoryBtn.textContent = key;
        categoryContainer.appendChild(categoryBtn);
    }

    // click event
    let categoryBtns = document.querySelectorAll('.categoryBtn');
    
    categoryBtns.forEach((categoryBtn)=>{
        categoryBtn.addEventListener('click', ()=>{
            console.log(categoryBtn);
            const buttonContent = categoryBtn.textContent;
            window.location.href = 'playground.html?category=' + encodeURIComponent(buttonContent);
        })
    })
}

categoryFiller(data)

