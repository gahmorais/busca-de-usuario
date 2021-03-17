let allUsers = [];
let userFound = [];
let inputName = null;
let divContainer = null;
let divStatistics = null;

window.addEventListener("load", () => {
  inputName = document.querySelector("#inputName");
  divContainer = document.querySelector(".users");
  divStatistics = document.querySelector(".statistics");
  fetchUsers();
});

async function fetchUsers() {
  const res = await fetch("http://localhost:3001/users");
  const json = await res.json();
  allUsers = json.map((user) => {
    const { name, dob, gender, picture } = user;

    return {
      completeName: `${name.first + " " + name.last}`,
      age: dob.age,
      gender: gender,
      picture: picture,
    };
  });

  render();
}

function handleInputName() {
  inputName.addEventListener("keyup", (e) => {
    let nameToFind = e.target.value.toLowerCase();

    if (nameToFind !== "") {
      userFound = allUsers.filter((user) => {
        return user.completeName.toLowerCase().includes(nameToFind);
      });
    } else {
      userFound = "";
    }

    renderUsers();
    renderStatistics();
  });
}

function render() {
  handleInputName();
  renderUsers();
  renderStatistics();
}

function renderStatistics() {
  let qtdMasculino = 0;
  let qtdFeminino = 0;
  let idadeTotal = 0;
  let mediaIdade = 0;

  if (userFound.length !== 0) {
    qtdMasculino = userFound.filter((user) => {
      return user.gender === "male";
    }).length;

    qtdFeminino = userFound.filter((user) => {
      return user.gender === "female";
    }).length;

    idadeTotal = userFound.reduce((acc, curr) => {
      return acc + curr.age;
    }, 0);

    mediaIdade = idadeTotal / userFound.length;
  }

  let statisticsHTML = `
  
  <div>
    <h2>Estatísticas</h2>
    <p>Sexo Masculino: <strong>${qtdMasculino}</strong></p>
    <p>Sexo Feminino: <strong>${qtdFeminino}</strong></p>
    <p>Soma das idades: <strong>${idadeTotal}</strong></p>
    <p>Média das idades: <strong>${mediaIdade.toFixed(2)}</strong></p>
  </div>`;

  divStatistics.innerHTML = statisticsHTML;
}

function renderUsers() {
  let usersHTML = `<div class="usuario-nao-encontrado">`;
  usersHTML += `<p class="user">${userFound.length} usuário(s) encontrados</p>`;
  if (userFound.length === 0) {
    usersHTML += `<p class="no-user">Nenhum usuário filtrado</p>`;
    usersHTML += "</div>";
    divContainer.innerHTML = usersHTML;
    return;
  }

  userFound.forEach((user) => {
    const { completeName, age, picture } = user;
    const userHTML = `
    <div class="usuarios-encontrados">
      <img class="thumb" src=${picture.thumbnail}><p>  ${completeName}, ${age} anos</p>
    </div>
    `;
    usersHTML += userHTML;
  });

  usersHTML += "</div>";
  divContainer.innerHTML = usersHTML;
}
