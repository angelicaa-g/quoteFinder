//Event listeners
let authorLinks = document.querySelectorAll("a");

for (authorLink of authorLinks) {
  authorLink.addEventListener("click", getAuthorInfo);
}

async function getAuthorInfo() {
  var myModal = new bootstrap.Modal(document.getElementById('authorModal'));
  myModal.show();

  let url = `/api/author/${this.id}`;
  let response = await fetch(url);
  let data = await response.json();

  let authorInfo = document.querySelector("#authorInfo");

  authorInfo.innerHTML = `<h1>${data[0].firstName} ${data[0].lastName}</h1>`;
  authorInfo.innerHTML += `<img src="${data[0].portrait}" width="200"><br><br>`;
  authorInfo.innerHTML += `Date of Birth: ${data[0].dob}<br>`;
  authorInfo.innerHTML += `Date of Death: ${data[0].dod}<br>`;
  authorInfo.innerHTML += `Biography: ${data[0].biography}<br>`;
  authorInfo.innerHTML += `Gender: ${data[0].sex}<br>`;
  authorInfo.innerHTML += `Profession: ${data[0].profession}<br>`;
  authorInfo.innerHTML += `Country: ${data[0].country}<br><br>`;
}
