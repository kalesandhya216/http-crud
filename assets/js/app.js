let cl = console.log;

const info = document.getElementById("info");
const studentForm = document.getElementById("studentForm");
const title = document.getElementById("title");
const information = document.getElementById("information");
const submitBtn = document.getElementById("submitBtn");
const updatBtn = document.getElementById("updatBtn");

let apiUrl = 'https://jsonplaceholder.typicode.com/posts';


let postArray = [];

function fetchData(methodName, baseUrl, tampFun, data){
  // 1. create object/instance by using XMLHttpRequest();

let xhr = new XMLHttpRequest();

// 2. open method terminal

xhr.open(methodName, baseUrl)   //  In this method we have to pass three arguments 2 are mandatory and one is optional
                  // 1st >> which method we have to use 
                  // url
                  // boolean >> optional >> by default value is 'true'

// 3. onload

xhr.onload = function(){
  if((xhr.status === 200 || xhr.status === 201) && (xhr.readyState === 4)){
    // cl(xhr.response);
    if(methodName === 'GET'){
      postArray = JSON.parse(xhr.response);
      cl(postArray);
      tampFun(postArray);
    }
  }

  if(xhr.status === 404){
    alert('Page not found');
  }
}


// 4. send

xhr.send(data);
}


const onEditHandler = (ele) => {
  cl(ele.closest('.card').dataset.id);
  let getId = +ele.closest('.card').dataset.id;
  cl(getId);
  localStorage.setItem("setId", getId);
  let getObj = postArray.find(o => o.id === getId);
  cl(getObj);
  title.value = getObj.title;
  information.value = getObj.body;
  updatBtn.classList.remove("d-none");
  submitBtn.classList.add("d-none");
}



const onDeleteHandler = (e) => {
  cl(e);
  let getId = +e.closest('.card').dataset.id;
  cl(getId);
  let deleteUrl = `${apiUrl}/${getId}`
  fetchData("DELETE", deleteUrl);
  postArray = postArray.filter(ele => {
    return ele.id !== getId;
  });
  templating(postArray);
}



fetchData('GET', apiUrl, templating)






function templating(arr){
  result = "";
  arr.forEach(element => {
    result += `
                  <div class="card mb-4" data-id="${element.id}">
                  <div class="card-body">
                      <h3>
                          ${element.title}
                      </h3>
                      <p>
                          ${element.body}
                      </p>
                      <p class="text-right">
                        <button type="button" onClick="onEditHandler(this)" class="btn btn-success">Edit</button>
                        <button type="button" onClick="onDeleteHandler(this)" class="btn btn-danger">Delete</button>
                      </p>
                  </div>
                  </div>
                `;
  });
  info.innerHTML = result;
}





const onSubmitHandler = (e) => {
  e.preventDefault();
  // cl("event triggered");
  
  let obj = {
    title : title.value,
    body : information.value,
  }
  cl(obj);
  studentForm.reset();
  postArray.unshift(obj);
  templating(postArray);
  fetchData("POST", apiUrl, JSON.stringify(obj));
}



const onUpdateHandler = (e) => {
  cl(e.target);
  let getId = localStorage.getItem("setId");
  let updateUrl = `${apiUrl}/${getId}`
  let obj = {
    title : title.value,
    body : information.value,
  }
  postArray.forEach(o => {
    if(o.id == getId){
      o.title = title.value;
      o.body = information.value;
    }
  })
  templating(postArray);
  studentForm.reset();
  updatBtn.classList.add("d-none");
  submitBtn.classList.remove("d-none");
  fetchData("PATCH", updateUrl, JSON.stringify(obj));
}






studentForm.addEventListener("submit", onSubmitHandler);
updatBtn.addEventListener("click", onUpdateHandler);