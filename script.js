
const addItems=document.querySelectorAll(".add-item");
const saveItems=document.querySelectorAll(".save-item");
const textContainer=document.querySelectorAll(".textContainer");
const addBtn=document.querySelectorAll(".addBTn");
const saveBtn=document.querySelectorAll(".saveBtn");
const listColumns=document.querySelectorAll(".drag-item-list");
const backlog=document.getElementById("blocklist");
const progress=document.getElementById("progresslist");
const complete=document.getElementById("completelist");
const onhold=document.getElementById("onholdlist");



let updatedOnLoad=false;
let backlogArray=[];
let progressArray=[];
let completeArray=[];
let onholdArray=[];

allArray=[];
let draggedItem;
let currentColumn;




function getSavedColumns() {
    if (localStorage.getItem('backlog')) {
      backlogArray = JSON.parse(localStorage.backlog);
      progressArray = JSON.parse(localStorage.progress);
      completeArray = JSON.parse(localStorage.complete);
      onholdArray = JSON.parse(localStorage.onhold);
    } else {
      backlogArray = ['Release the course', 'Sit back and relax'];
      progressArray = ['Work on projects', 'en to music'];
      completeArray = ['Being cool', 'Getting stuff done'];
      onholdArray = ['Being uncool'];
    }
  }


function updateSavedColumn(){
allArray=[backlogArray,progressArray,completeArray,onholdArray];

const arrayNames=["backlog","progress","complete","onhold"];

arrayNames.forEach((arrayName,index)=>{
    localStorage.setItem(arrayName,JSON.stringify(allArray[index]));
})
}
//on stock local storage//
//Filter Arrays to remove empty items 

function filterArray(array){
    console.log(array);
    const filteredArray=array.filter(item=>item!==null);
    return  filteredArray;
}
function CreateItem(columnEL,column,item,index){

    
    const createEl=document.createElement("li");
    createEl.textContent=item;
    createEl.id=index;
    columnEL.appendChild(createEl);
    createEl.draggable=true;
    createEl.classList.add("drag-item")
    createEl.setAttribute('ondragstart','drag(event)');
    createEl.contentEditable=true;
//id specifique de chaque element
    createEl.setAttribute("onfocusout",`updateItem(${index}, ${column})`)
}




function UpdateDOM(){

    if(!updatedOnLoad){
        getSavedColumns();
    }
    backlog.textContent="";

    backlogArray.forEach((backlogItem,index)=>{
        CreateItem(backlog,0,backlogItem,index);
    
});
   backlogArray=filterArray(backlogArray)
progress.textContent="";
progressArray.forEach((progressItem,index)=>{
    CreateItem(progress,1,progressItem,index);

});

progressArray=filterArray(progressArray);
complete.textContent="";
completeArray.forEach((completeItem,index)=>{
    CreateItem(complete,2,completeItem,index);

});
completeArray=filterArray(completeArray);
onhold.textContent="";
onholdArray.forEach((onholdItem,index)=>{
    CreateItem(onhold,3,onholdItem,index);

});
onholdArray=filterArray(onholdArray);
    updatedOnLoad=true;
    updateSavedColumn();
}

//Update Item - Delete if necessary , or update  Array value


function updateItem(id, column)
{
    const selectedArray=allArray[column];
    console.log(selectedArray);
    const selectedColumnEl=listColumns[column].children;
    console.log(selectedColumnEl[id].textContent);
    if(!selectedColumnEl[id].textContent){
        delete selectedArray[id];
    }
         UpdateDOM();

}


function rebuildArray(){
    console.log(backlog.children);
    console.log(progress.children);

     backlogArray=[]

    for(let i=0; i< backlog.children.length;i++){

    backlogArray.push(backlog.children[i].textContent);
    }
     progressArray=[];

    for(let i=0; i< progress.children.length;i++){

   progressArray.push(progress.children[i].textContent);
        }

         completeArray=[];
    for(let i=0; i< complete.children.length;i++){

    completeArray.push(complete.children[i].textContent);
    }

       onholdArray=[];
    for(let i=0; i< onhold.children.length;i++){

   onholdArray.push(onhold.children[i].textContent);
        }
        UpdateDOM();
}

function addToColumn(column){

    const itemText=addItems[column].textContent;
    const selectedArray=allArray[column];
    selectedArray.push(itemText);
    addItems[column].textContent='';

     UpdateDOM();
  

    //addItem sont 4 il prend column comme un index addItems[0,or,3,]
    //cest pour quoi on l'a donnee un nombre 
    //pour les distainguer 
    //FIXME 
}

function showInputBox(column){
textContainer[column].classList.remove("cache");
addBtn[column].classList.add("cache");

}
function hideInputBox(column){
addBtn[column].classList.remove("cache");
textContainer[column].classList.add("cache");
addToColumn(column);
}

function drag(e){
draggedItem=e.target;

console.log(draggedItem);
}

//Column Allows for Item to Drop
function allowDrop(e){
    e.preventDefault();
}
//When item Enters Column Area
function dragEnter(column){
    console.log(listColumns[column]);
    currentColumn=column;

}

//Dropping Item in Column
function drop(e){
    e.preventDefault();
    const parent=listColumns[currentColumn];
    parent.appendChild(draggedItem);
    rebuildArray();
}

UpdateDOM();