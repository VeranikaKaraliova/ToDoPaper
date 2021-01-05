let arrAllUserRegistr = [
  {
    name: 'Nata',
    pass: '123',
  },
];

class Controller {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.allTask = JSON.parse(localStorage.getItem('allTask'));
    this.arrAllUserRegistr = JSON.parse(localStorage.getItem('arrAllUserRegistr'));
    this.headerView = new HeaderView('authorized');
    this.аctiveTaskView = new ActiveTaskView('new-task');
    this.сompliteTaskView = new CompliteTaskView('done-task');
  }

  error(textError) {
    console.log(textError.message);
    const error = document.querySelector('.error');
    error.style.display = 'flex';
    const errorContainer = document.querySelector('.error-container');
    // console.log(textError.message)
    if (textError.message === undefined) {
      errorContainer.innerHTML = '<p>Попробуйте еще раз</p>';
    } else {
      errorContainer.innerHTML = `<p>${textError.message}</p>`;
    }
  }

  setCurrentUser() {
    this.headerView.display(this.user);
    this.аctiveTaskView.display(this.allTask, this.user);
    this.сompliteTaskView.display(this.allTask, this.user);
  }

  clear() {
    const nameUser = document.getElementById('name-user');
    const nameUserLog = document.getElementById('name-user-log');
    const pass = document.getElementById('password');
    const passRepit = document.getElementById('password-repit');
    const passLog = document.getElementById('password-log');
    const addTask = document.getElementById('add-task');
    nameUser.value = '';
    nameUserLog.value = '';
    pass.value = '';
    passLog.value = '';
    addTask.value = '';
    passRepit.value = '';
  }

  //  add(num1, num2) {
  //   console.time('timeAdd');
  //   return new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //           resolve(num1 + num2);
  //           console.timeEnd('timeAdd');
  //       }, Math.random()*3000);
  //   });
  // }

  login(name, pass) {
    return new Promise((resolve, reject) => {
      let index = null;
      for (let i = 0; i < this.arrAllUserRegistr.length; i++) {
        if (this.arrAllUserRegistr[i].name === name) {
          index = i;
        }
      }
      if (this.arrAllUserRegistr[index].name === name && this.arrAllUserRegistr[index].pass === pass) {
        localStorage.setItem('user', JSON.stringify(name));
        this.user = JSON.parse(localStorage.getItem('user'));
        resolve(this.setCurrentUser());
      } else {
        reject(this.catch());
      }
    })
      .catch((e) => {
        localStorage.setItem('user', JSON.stringify(''));
        this.error(e.message);
      });
  }
}

function sendLocalStor() {
  if (JSON.parse(localStorage.user === undefined)) {
    localStorage.setItem('user', JSON.stringify(''));
  }
  if (JSON.parse(localStorage.allTask === undefined)) {
    localStorage.setItem('allTask', JSON.stringify(arrTest));
  }
  if (JSON.parse(localStorage.arrAllUserRegistr === undefined)) {
    localStorage.setItem('arrAllUserRegistr', JSON.stringify(arrAllUserRegistr));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  sendLocalStor();
  const controller = new Controller();
  controller.setCurrentUser();

  const linkRegistr = document.querySelector('.regisrt-button');
  linkRegistr.onclick = function () {
    const registr = document.querySelector('.registr');
    registr.style.display = 'flex';

    const formRegistr = document.getElementById('form-registr');
    formRegistr.addEventListener('submit', (event) => {
      event.preventDefault();
      const login = document.querySelector('.login');
      if (controller.arrAllUserRegistr.some((item) => item.name === formRegistr[0].value)) {
        (alert('Пользователь с таким именем уже существует'));
        registr.style.display = 'flex';
        login.style.display = 'none';
      }
      if (!controller.arrAllUserRegistr.some((item) => item.name === formRegistr[0].value) && formRegistr[1].value !== formRegistr[2].value) {
        (alert('Пароли не соврадают'));
        registr.style.display = 'flex';
        login.style.display = 'none';
      }
      if (!controller.arrAllUserRegistr.some((item) => item.name === formRegistr[0].value) && formRegistr[1].value === formRegistr[2].value) {
        arrAllUserRegistr = controller.arrAllUserRegistr;
        arrAllUserRegistr.push({ name: formRegistr[0].value, pass: formRegistr[1].value });
        localStorage.setItem('arrAllUserRegistr', JSON.stringify(arrAllUserRegistr));
        registr.style.display = 'none';
        login.style.display = 'flex';
        const formLogin = document.getElementById('form-login');
        formLogin.addEventListener('submit', (event) => {
          event.preventDefault();
          login.style.display = 'none';
          const name = formLogin[0].value;
          const pass = formLogin[1].value;
          controller.clear();
          controller.login(name, pass);
        });
      }
    });
  };

  const linkLogin = document.querySelector('.login-button');
  linkLogin.onclick = function () {
    const login = document.querySelector('.login');
    login.style.display = 'flex';
    const formLogin = document.getElementById('form-login');
    formLogin.addEventListener('submit', (event) => {
      event.preventDefault();
      login.style.display = 'none';
      const name = formLogin[0].value;
      const pass = formLogin[1].value;
      controller.login(name, pass);
    });
  };

  const exit = document.querySelector('.btn-exit');
  exit.addEventListener('click', () => {
    controller.user = localStorage.setItem('user', JSON.stringify(''));
    controller.setCurrentUser();
  });

  const mainPage = document.getElementById('main-page');
  mainPage.addEventListener('click', (event) => {
    const error = document.querySelector('.error');
    error.style.display = 'none';
  });
});
