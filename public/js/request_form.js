const sel = document.querySelector('.type') ;
sel.addEventListener('change' , () =>{
    if(sel.value == "New")
    {
        document.querySelectorAll('._replace').forEach(el => {
            el.style.display = "none" ;
        
        })

        document.querySelectorAll('._new').forEach(el => {
            el.style.display = "inline" ;
        
        })

    }
    else
    {

        document.querySelectorAll('._replace').forEach(el => {
            el.style.display = "inline" ;
        
        })

        document.querySelectorAll('._new').forEach(el => {
            el.style.display = "none" ;
        
        })
    }
})

document.querySelectorAll('._replace').forEach(el => {
    el.style.display = "none" ;

})
