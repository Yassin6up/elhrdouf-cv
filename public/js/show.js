import {
    gsap
} from "gsap/src";
import {
    ScrollTrigger
} from "gsap/ScrollTrigger";

let point = document.getElementById('dot')

window.onmousemove = (event) => {
    point.style.transform = `translateX(${event.x }px) translateY(${event.y}px)`;
}

console.log(window.innerWidth);
if (window.innerWidth <= 600) {
    console.log("mobile");
    point.style.display = "none";
} else {
    console.log('computer')
}

let musicBtn = document.getElementById('musicButton')
let isPlayed = false;
musicBtn.onclick = () => {
    if (isPlayed) {
        pauseMusic()
    } else {
        playMusic()
    }
}

function playMusic() {
    document.querySelectorAll('.audio').forEach((music) => {
        isPlayed = true
        return music.play()

    })
}

function pauseMusic() {
    document.querySelectorAll('.audio').forEach((music) => {
        isPlayed = false
        return music.pause()

    })
}

document.body.onclick = ()=>{
    document.getElementById('clickSound').play()
}

let projectsContainer = document.getElementById("projects")

let projects = [{
        name: "Windows Web",
        photo: "../assets/windows.png",
        deps: {
            html: `<div class="html"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png?20170517184425" alt=""><p>HTML</p></div>`,
            css: `<div class="css"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/363px-CSS3_logo_and_wordmark.svg.png?20160530175649" alt=""><p>Css</p></div>`,
            js: `<div class="js"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/600px-JavaScript-logo.png?20120221235433" alt=""><p>JavaScript</p></div>`,
            firebase: "",
            nodejs: "",
            sqllite: "",
            prisma: "",
            reactjs: "",
            expressjs: ""
        },
        gihtub: "https://github.com/Yassin6up/windows",
        web: "https://windowsys.vercel.app/"
    },
    {
        name: "Youxo Ai Bot",
        photo: "../assets/youxo.png",
        deps: {
            nodejs: "",
            sqllite: "",
            prisma: "",
            reactjs: "",
            expressjs: "",
            html: `<div class="html"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png?20170517184425" alt=""><p>HTML</p></div>`,
            css: `<div class="css"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/363px-CSS3_logo_and_wordmark.svg.png?20160530175649" alt=""><p>Css</p></div>`,
            js: `<div class="js"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/600px-JavaScript-logo.png?20120221235433" alt=""><p>JavaScript</p></div>`,
            firebase: `<div class="firebase"><img src="https://upload.wikimedia.org/wikipedia/commons/4/46/Touchicon-180.png?20200723100028" alt=""><p>FireBase</p></div>`,
        },
        gihtub: "https://github.com/Yassin6up/Youxo-bot",
        web: "https://youxo-bot.vercel.app/"
    },
    {
        name: "Acolux Web",
        photo: "../assets/acolux.png",
        deps: {
            firebase: "",
            html: `<div class="html"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png?20170517184425" alt=""><p>HTML</p></div>`,
            css: `<div class="css"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/363px-CSS3_logo_and_wordmark.svg.png?20160530175649" alt=""><p>Css</p></div>`,
            js: `<div class="js"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/600px-JavaScript-logo.png?20120221235433" alt=""><p>JavaScript</p></div>`,
            nodejs: "",
            sqllite: "",
            prisma: "",
            reactjs: "",
            expressjs: ""
        },
        gihtub: "https://github.com/Yassin6up/acoluxx",
        web: "https://www.acoluxsmart.com/"
    },
    {
        name: "HQPAcademy Web",
        photo: "../assets/hqp.png",
        deps: {
            firebase: "",
            html: `<div class="html"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png?20170517184425" alt=""><p>HTML</p></div>`,
            css: `<div class="css"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/363px-CSS3_logo_and_wordmark.svg.png?20160530175649" alt=""><p>Css</p></div>`,
            js: `<div class="js"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/600px-JavaScript-logo.png?20120221235433" alt=""><p>JavaScript</p></div>`,
            nodejs: `<div class="nodejs"><img src="https://upload.wikimedia.org/wikipedia/commons/6/67/NodeJS.png?20130122160021" alt=""><p>NodeJs</p></div>`,
            sqllite: `<div class="sqllite"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/SQLite370.svg/382px-SQLite370.svg.png?20140602232932" alt=""><p>SQLLite</p></div>`,
            prisma: `<div class="prisma"><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtQVFTyNHD2au2UDsZkmq-QwIygCV1eAhnH8GjC0UTQVeoR3x7a2tsImGVZsIhMKDDJU8&usqp=CAU" alt=""><p>Prisma</p></div>`,
            reactjs: `            <div class="react"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/640px-React-icon.svg.png" alt=""><p>ReactJs</p></div>        `,
            expressjs: `            <div class="express"><img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt=""><p>ExpressJs</p></div>`

        },
        gihtub: "#",
        web: "#"
    },
    {
        name: "Games Website",
        photo: "https://baaeed.hsoubcdn.com/files/profiles/photos/222149/743d50a9-9505-4dcc-a79e-b28ff5f03409.png",
        deps: {
            firebase: "",
            html: `<div class="html"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png?20170517184425" alt=""><p>HTML</p></div>`,
            css: `<div class="css"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/363px-CSS3_logo_and_wordmark.svg.png?20160530175649" alt=""><p>Css</p></div>`,
            js: `<div class="js"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/600px-JavaScript-logo.png?20120221235433" alt=""><p>JavaScript</p></div>`,
            nodejs: "",
            sqllite: "",
            prisma: "",
            reactjs: "",
            expressjs: ""
        },
        gihtub: "https://github.com/Yassin6up/ShopGame",
        web: "https://gaming-site-six.vercel.app/"
    },
    {
        name: "Finito Game",
        photo: "../assets/finto.png",
        deps: {
            firebase: "",
            html: `<div class="html"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png?20170517184425" alt=""><p>HTML</p></div>`,
            css: `<div class="css"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/363px-CSS3_logo_and_wordmark.svg.png?20160530175649" alt=""><p>Css</p></div>`,
            js: `<div class="js"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/600px-JavaScript-logo.png?20120221235433" alt=""><p>JavaScript</p></div>`,
            nodejs: "",
            sqllite: "",
            prisma: "",
            reactjs: "",
            expressjs: ""
        },
        gihtub: "https://github.com/Yassin6up/finito-game",
        web: "https://finito-game.vercel.app/"

    },


]

projects.map((project) => {
    projectsContainer.innerHTML += `
    <div class="singleProject">
              <img src="${project.photo}" alt="">
              <div class="projectDetails">
                <h1>${project.name}</h1>
            <div class="projectDepandencise">
                  <div class="skillsBadges forProject">
                  ${project.deps.js}
                  ${project.deps.html}
                  ${project.deps.css}
                  ${project.deps.firebase}
                  ${project.deps.prisma}
                  ${project.deps.expressjs}
                  ${project.deps.reactjs}
                  ${project.deps.sqllite}
                  ${project.deps.nodejs}
                  
                  </div>
                </div>
                <div class="projectLinks">
                  <a target="_blank" href="${project.gihtub}">
                  <div class="btn github">
                    <i class="fa-brands fa-github"></i> <p>GitHub</p> 
                  </div>
                </a>
                <a  target="_blank" href="${project.web}">
                  <div class="btn web">
                      <i class="fa-solid fa-globe"></i><p> Web</p>
                  </div>
                </a>
                </div>
              </div>
            </div>
    
    `
})


document.getElementById("qrIN").setAttribute("src", "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.linkedin.com/in/yassin-ait-elhardouf-676974247/")
document.getElementById("qrFB").setAttribute("src", "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.facebook.com/profile.php?id=100015338087618")
document.getElementById("qrINS").setAttribute("src", "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.instagram.com/yassin_elhardofi/")


const cards = document.querySelectorAll(".card");
//card rotate on mouse move
let mostX = 20;
let mostY = 20
cards.forEach((card) => {

    card.addEventListener("mousemove", (e) => {


        
        let x = e.offsetX
        let y = e.offsetY
        let {
            height,
            width
        } = card.getBoundingClientRect()
        let halfWidth = width / 2;
        let halfHeight = height / 2;
        const rotationY = ((x - halfWidth) / halfWidth) * mostX;
        const rotationX = ((y - halfHeight) / halfHeight) * mostY;
        console.log(rotationY , rotationX)
        card.style.transform = "rotateY(" + rotationY + "deg) rotateX(" + rotationX + "deg)";
    });

    //card back to normal when mouse out
    card.addEventListener("mouseout", () => {
        card.style.transform = "rotateY(0deg) rotateX(0deg)";
        card.style.transition = "all 0.5s ease";
    });
})



fetch('https://api.quotable.io/random').then((data)=>{
    return data.json()
}).then((quote)=>{
    
    document.getElementById('qute').innerHTML = quote.content
    document.getElementById('author').innerHTML = quote.author
})