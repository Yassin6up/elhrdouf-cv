window.onfocus  = ()=>{
    console.log('g')
    setTimeout(()=>{
        window.location.href = "http://localhost:5173/"
    },3000)
    
}
