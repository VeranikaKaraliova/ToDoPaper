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
    console.log(textError);
    const error = document.querySelector('.error');
    error.style.display = 'flex';
    const errorContainer = document.querySelector('.error-container');
    if (textError === 'Cannot read property \'name\' of undefined') {
      errorContainer.innerHTML = '<p>Пользователя с таким именем не существует</p>';
    } else {
      errorContainer.innerHTML = '<p>Что-то пошло не так, попробуйте еще раз</p>';
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

  login(nameUser, pass) {
    return new Promise((resolve, reject) => {
      let index = null;
      for (let i = 0; i < this.arrAllUserRegistr.length; i++) {
        if (this.arrAllUserRegistr[i].name === nameUser) {
          index = i;
        }
      }
      if (this.arrAllUserRegistr[index].name === nameUser && this.arrAllUserRegistr[index].pass === pass) {
        localStorage.setItem('user', JSON.stringify(nameUser));
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

  addTask(data) {
    return new Promise((resolve, reject) => {
      this.allTask.push(data);
      localStorage.setItem('allTask', JSON.stringify(this.allTask));
      resolve(this.allTask);
    })
      .then((res) => {
        this.аctiveTaskView.display(this.allTask, this.user);
        this.сompliteTaskView.display(this.allTask, this.user);
      })
      .catch((e) => {
        this.error(e.message);
      });
  }

  complite(id) {
    return new Promise((resolve, reject) => {
      this.allTask = JSON.parse(localStorage.getItem('allTask'));
      const index = this.allTask.findIndex((item) => item.id == id);
      this.allTask[index].isActive = false;
      localStorage.setItem('allTask', JSON.stringify(this.allTask));
      resolve(this.allTask);
    })
      .then(() => {
        this.аctiveTaskView.display(this.allTask, this.user);
        this.сompliteTaskView.display(this.allTask, this.user);
      })
      .catch((e) => {
        this.error(e.message);
      });
  }

  back(id) {
    return new Promise((resolve, reject) => {
      const index = this.allTask.findIndex((item) => item.id == id);
      this.allTask[index].isActive = true;
      localStorage.setItem('allTask', JSON.stringify(this.allTask));
      resolve(this.allTask);
    })
      .then(() => {
        this.аctiveTaskView.display(this.allTask, this.user);
        this.сompliteTaskView.display(this.allTask, this.user);
      })
      .catch((e) => {
        this.error(e.message);
      });
  }

  remove(id) {
    return new Promise((resolve, reject) => {
      const index = this.allTask.findIndex((item) => item.id == id);
      document.getElementById(id).innerHTML = '';
      this.allTask.splice(index, 1);
      localStorage.setItem('allTask', JSON.stringify(this.allTask));
      resolve(this.allTask);
    })
      .then(() => {
        this.аctiveTaskView.display(this.allTask, this.user);
        this.сompliteTaskView.display(this.allTask, this.user);
      })
      .catch((e) => {
        this.error(e.message);
      });
  }

  edit(id) {
    return new Promise((resolve, reject) => {
      const index = this.allTask.findIndex((item) => item.id == id);
      const editTask = document.getElementById('add-task');
      editTask.value = `${this.allTask[index].text}`;
      editTask.parentNode.id = `${this.allTask[index].id}`;
      resolve(this.allTask);
    })
      .then(() => {
        this.аctiveTaskView.display(this.allTask, this.user);
        this.сompliteTaskView.display(this.allTask, this.user);
      })
      .catch((e) => {
        this.error(e.message);
      });
  }

  filterTask(filters) {
    return new Promise((resolve) => {
      let result = this.allTask;
      const filterObj = {
        text: (task, text) => task.text.toLowerCase().includes(text.toLowerCase()),
        date: (task, date) => task.createdAt.slice(0, 10).includes(date),
      };
      Object.keys(filters).forEach((key) => {
        result = result.filter((task) => filterObj[key](task, filters[key]));
      });
      resolve(result);
    })
      .then((res) => {
        let resultFalse; let
          resultTrue = [];
        this.аctiveTaskView.display(res, this.user);
        this.сompliteTaskView.display(res, this.user);
        resultFalse = res.filter((item) => (item.isActive === false)).filter((item) => item.author === this.user);
        resultTrue = res.filter((item) => (item.isActive === true)).filter((item) => item.author === this.user);
        const infoTrue = document.createElement('div');
        const infoFalse = document.createElement('div');
        const allDoneTask = document.getElementById('done-task');
        const newTask = document.getElementById('new-task');
        console.log(resultFalse);
        if (resultTrue.length === 0 && resultFalse.length === 0) {
          infoFalse.innerHTML = '<div class="info"><p>Выполненных задач, соответствующих отбору, нет</p></div>';
          allDoneTask.appendChild(infoFalse);
          infoTrue.innerHTML = '<div class="info"><p>Активных задач, соответствующих отбору, нет</p></div>';
          newTask.appendChild(infoTrue);
        }
        if (resultFalse.length === 0) {
          infoFalse.innerHTML = '<div class="info"><p>Выполненных задач, соответствующих отбору, нет</p></div>';
          allDoneTask.appendChild(infoFalse);
        }
        if (resultTrue.length === 0) {
          infoTrue.innerHTML = '<div class="info"><p>Активных задач, соответствующих отбору, нет</p></div>';
          newTask.appendChild(infoTrue);
        }
      })
      .catch((e) => {
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

    const loginIn = document.getElementById('login-in');
    loginIn.addEventListener('click', () => {
      const registr = document.querySelector('.registr');
      registr.style.display = 'none';
      const login = document.querySelector('.login');
      login.style.display = 'flex';
      controller.clear();
      const formLogin = document.getElementById('form-login');
      formLogin.addEventListener('submit', (event) => {
        event.preventDefault();
        login.style.display = 'none';
        const name = formLogin[0].value;
        const pass = formLogin[1].value;
        controller.login(name, pass);
      });
    });

    const formRegistr = document.getElementById('form-registr');
    formRegistr.addEventListener('submit', (event) => {
      event.preventDefault();
      const login = document.querySelector('.login');
      console.log(formRegistr[0].value);
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
          return controller.login(name, pass);
        });

        controller.clear();
      }
    });
  };

  const linkLogin = document.querySelector('.login-button');
  linkLogin.onclick = function () {
    const login = document.querySelector('.login');
    login.style.display = 'flex';

    const signUp = document.getElementById('sign-up');
    signUp.addEventListener('click', () => {
      const registr = document.querySelector('.registr');
      registr.style.display = 'flex';
      const login = document.querySelector('.login');
      login.style.display = 'none';
      controller.clear();
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
          controller.clear();
          const formLogin = document.getElementById('form-login');
          formLogin.addEventListener('submit', (event) => {
            event.preventDefault();
            login.style.display = 'none';
            const name = formLogin[0].value;
            const pass = formLogin[1].value;
            return controller.login(name, pass);
          });
        }
      });
    });

    controller.clear();
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
    localStorage.setItem('user', JSON.stringify(''));
    controller.user = JSON.parse(localStorage.getItem('user'));
    controller.setCurrentUser();
  });

  const mainPage = document.getElementById('main-page');
  mainPage.addEventListener('click', () => {
    const error = document.querySelector('.error');
    error.style.display = 'none';
  });

  const btnAddTask = document.getElementById('btn-add-task');
  btnAddTask.addEventListener('click', () => {
    const addTask = document.getElementById('add-task');
    const id = Number(new Date());
    const index = controller.allTask.findIndex((item) => item.id == addTask.parentNode.id);
    if (index !== -1 && addTask.value !== '') {
      controller.allTask[index].text = addTask.value;
      addTask.parentNode.id = '';
      addTask.value = '';
      localStorage.setItem('allTask', JSON.stringify(controller.allTask));
      controller.allTask = JSON.parse(localStorage.getItem('allTask'));
      controller.аctiveTaskView.display(controller.allTask, controller.user);
      controller.сompliteTaskView.display(controller.allTask, controller.user);
    }
    if (index === -1 && addTask.value === '') {
      alert('Введите название задачи');
    } if (index === -1 && addTask.value !== '') {
      controller.addTask({
        text: addTask.value,
        author: controller.user,
        isActive: true,
        createdAt: new Date(),
        id,
      });
      addTask.value = '';
    }
  });

  const task = document.querySelector('.task');
  task.addEventListener('click', (event) => {
    if (event.target.type === 'checkbox') {
      const { id } = event.target.parentNode.parentNode.parentNode;
      controller.complite(id);
    }
    if (event.target.className === 'fas fa-check') {
      const { id } = event.target.parentNode.parentNode;
      controller.back(id);
    }
    if (event.target.className === 'fas fa-trash-alt') {
      const { id } = event.target.parentNode.parentNode;
      controller.remove(id);
    }
    if (event.target.className === 'fas fa-edit') {
      const { id } = event.target.parentNode.parentNode;
      controller.edit(id);
    }
    if (event.target.className === 'btn-search-task') {
      const searchTask = document.getElementById('search-task');
      const searchDateTask = document.getElementById('calendar');
      controller.filterTask({ text: searchTask.value, date: searchDateTask.value });
    }
  });
});
