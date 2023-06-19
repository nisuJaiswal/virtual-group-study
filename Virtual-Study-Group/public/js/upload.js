//sidenav - ARROW v
const arrow = document.querySelector(".arrow");
arrow.addEventListener("click", (e) => {
    const parent = e.target.parentElement.parentElement;
    console.log(parent);
    parent.classList.toggle("show-menu");
    // arrow.style.transform="rotate(-180deg)";
    arrow.classList.toggle("rotate");
});

//Hamburger
const navbar = document.querySelector(".navbar");
const sidebar = document.querySelector(".sideNav");

navbar.addEventListener("click", () => {
    navbar.classList.toggle("active");
    sidebar.classList.toggle("close");
})

//Profile-arrow v
const profileArrow = document.querySelector(".profile-arrow");
const profileMenu = document.querySelector(".profile-container-option");
// console.log(profileMenu);
profileArrow.addEventListener("click", () => {
    profileMenu.classList.toggle("open");
    profileArrow.classList.toggle("rotate");
})

// Drag and Drop Files
const dropFiles = document.querySelector('.dropFiles');
const filePath = document.querySelector('#filePath');
const fileDropped = document.querySelector('.fileDropped')
// console.log(fileDropped);
// console.log(filePath.innerText);
// console.log(dropFiles);
const dropZone = document.querySelector('.dropzone');
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!dropZone.classList.contains('dragged')) {
        dropZone.classList.add('dragged')
        console.log('dragging over element');
    }
})

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragged');
})

const fileInput = document.querySelector('#inputFile');


dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    ondDrop(e);

    dropZone.classList.remove('dragged');
    dropFiles.classList.add('d-none');
    fileDropped.classList.remove('d-none');
    filePath.innerText = `${e.dataTransfer.files[0].name}`;
    
    const crossBtn = document.createElement('span');
    crossBtn.classList.add('crossBtn');
    filePath.appendChild(crossBtn)
    
    crossBtn.addEventListener('click',()=>{
        console.log('cross Clicked');
        dropFiles.classList.remove('d-none');
        fileDropped.classList.add('d-none');
        fileInput.value = '';
    })
    
})


const browseBtn = document.querySelector('.browseBtn');

browseBtn.addEventListener('click', () => {
    fileInput.click();
})

document.getElementById('inputFile').onchange = function (e) {
    e.preventDefault();
    console.log(e.target.files[0].name);
    filePath.innerText = `${e.target.files[0].name}`;

    const crossBtn = document.createElement('span');
    crossBtn.classList.add('crossBtn');
    filePath.appendChild(crossBtn);

    fileDropped.classList.remove('d-none');
    dropFiles.classList.add('d-none');

     crossBtn.addEventListener('click',()=>{
        console.log('cross Clicked');
        dropFiles.classList.remove('d-none');
        fileDropped.classList.add('d-none');
        fileInput.value = '';
    })
};

// MIRACLE MIRACLE MIRACLE MIRACLE
// MOJ KAR DI BETE 
// YAHA WAHA SAARE JAHA ME TERA RAAJ HAI JIJA JI...

function ondDrop(e) {
    fileInput.files = e.dataTransfer.files;
    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);
}

// Tags
[].forEach.call(document.getElementsByClassName('materialTags'), function (el) {
    let hiddenInput = document.createElement('input'),
        mainInput = document.createElement('input'),
        tags = [];

    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', el.getAttribute('data-name'));

    mainInput.setAttribute('type', 'text');
    mainInput.classList.add('mainInput');
    // mainInput.style.width = '100%';
    mainInput.setAttribute('placeholder', 'Enter Your Tags Here');
    // mainInput.style.border = '2px solid red';
    mainInput.addEventListener('input', function(){
        let enteredTags = mainInput.value.split(',');
        if(enteredTags.length > 1){
            // console.log('inputted')
            enteredTags.forEach(function(t){
                let filteredTag = filterTag(t);
                if(filteredTag.length > 0){
                    addTag(filteredTag);
                }
            })
            mainInput.value = '';
        }
    })

    mainInput.addEventListener('keydown', (e)=>{
        let keyCode = e.which || e.keyCode;
        if(keyCode === 8 && mainInput.value.length === 0 && tags.length > 0){
            removeTag(tags.length-1)
        }
    })
    el.appendChild(mainInput);
    el.appendChild(hiddenInput);

    function addTag(text){
        let tag = {
            text: text,
            element: document.createElement('span')
        };

        tag.element.classList.add('tag')
        tag.element.textContent = tag.text;

        let closeBtn = document.createElement('span');
        closeBtn.classList.add('close');
        closeBtn.addEventListener('click', ()=>{
            removeTag(tags.indexOf(tag));
        })
        tag.element.appendChild(closeBtn);

        tags.push(tag);

        el.insertBefore(tag.element, mainInput);
        refreshTags();

    }

    function removeTag(index){
        let tag = tags[index];
        tags.splice(index, 1);
        el.removeChild(tag.element);
        refreshTags();
    }
    function refreshTags(){
        let tagsList = [];
        tags.forEach((t)=>{
            tagsList.push(t.text);
        })
        hiddenInput.value= tagsList.join(',')
    }
    function filterTag(tag){
        return tag.replace(/[^\w -]/g, '').trim().replace(/\W+/g, '-');
    }   

})