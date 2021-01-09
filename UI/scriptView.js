const arrTest = [
  {
    id: '1',
    text: 'Поставить елку!',
    createdAt: new Date('2021-01-01T13:01:15'),
    author: 'Nika',
    isActive: true,
  },
  {
    id: '2',
    text: 'Приготовить салат!',
    createdAt: new Date('2021-01-02T23:12:10'),
    author: 'Nika',
    isActive: true,
  },
  {
    id: '3',
    text: 'Сделать кофе!',
    createdAt: new Date('2021-01-02T23:11:10'),
    author: 'Nika',
    isActive: false,
  },
];

class HeaderView {
  constructor(id = 'header') {
    this.activeUser = document.getElementById(id);
  }

  display(user) {
    if (user === '' || user === undefined) {
      const loginRegistr = document.getElementById('login-registr');
      loginRegistr.style.display = 'flex';

      const addTaskContainer = document.getElementById('add-task-container');
      addTaskContainer.style.display = 'none';

      const activeUser = document.getElementById('active-user');
      activeUser.style.display = 'none';

      const filter = document.getElementById('filter');
      const info = document.createElement('div');
      info.innerHTML = '<div class="filter"><p class="welcom">Добро пожаловать!&#128588;</p><span class="welcom-info">С помощью этого приложения ты сможешь правитьно организовать свой день, а может даже и жизнь;) Для того, чтобы начать необходимо войти или зарегистрироваться</span></div>';
      filter.appendChild(info);

      const search = document.getElementById('search');
      search.style.display = 'none';

      const filterDate = document.getElementById('filter-date');
      filterDate.style.display = 'none';

      const welcom = document.querySelector('.welcom');
      welcom.style.display = 'block';
    } else {
      const loginRegistr = document.getElementById('login-registr');
      loginRegistr.style.display = 'none';

      const activeUser = document.getElementById('active-user');
      activeUser.style.display = 'flex';

      const helloUser = document.getElementById('hello-user');
      helloUser.innerHTML = `Привет, ${user}`;

      const addTaskContainer = document.getElementById('add-task-container');
      addTaskContainer.style.display = 'flex';

      const search = document.getElementById('search');
      search.style.display = 'flex';

      const filter = document.querySelector('.filter');
      filter.innerHTML = `<div class="search" id="search">
      <input type="text" class="search-task" id="search-task" placeholder="Найти..." />
      <button class="btn-search-task" id="btn-search-task">Найти</button>
      </div>
      <div class="filter-date" id="filter-date">
        <p>Фильтр</p>
        <input type="date" id="calendar"  class="calendar">
      </div>`;
    }
  }
}

// проверка HeaderView
// headerView = new HeaderView('authorized');
// headerView.display('');

class ActiveTaskView {
  constructor(id = 'new-task') {
    this.id = id;
  }

  display(activeTaskArr = [], user) {
    activeTaskArr = activeTaskArr.sort((a, b) => a.createdAt - b.createdAt);
    const newTask = document.getElementById(this.id);
    newTask.innerHTML = '';
    const myTask = document.createElement('p');
    myTask.innerHTML = 'Мои задачи';
    newTask.appendChild(myTask);
    if (user === '' || user === undefined) {
      const info = document.createElement('div');
      info.innerHTML = '<div class="info"><p>Здесь будут отображаться твои активные задачи;)</p></div>';
      newTask.appendChild(info);
    }
    for (let i = 0; i < activeTaskArr.length; i++) {
      if (activeTaskArr[i].author === user && activeTaskArr[i].isActive === true) {
        const activeTask = document.createElement('div');
        activeTask.innerHTML = `<div class="container-task" id="${activeTaskArr[i].id}">
        <div class="text-task">
            <div class="round">
              <input type="checkbox" id="${activeTaskArr[i].id + 1}"/>
              <label for="${activeTaskArr[i].id + 1}"></label>
            </div>
            <p>${activeTaskArr[i].text}</p>
            <i class="fas fa-edit"></i>
            <i class="fas fa-trash-alt"></i>
        </div>
        <div class="time">
          <p>${new Date(activeTaskArr[i].createdAt).getDate()}/${new Date(activeTaskArr[i].createdAt).getMonth() + 1}/${new Date(activeTaskArr[i].createdAt).getFullYear()}</p>
          <p>${new Date(activeTaskArr[i].createdAt).getHours()}:${new Date(activeTaskArr[i].createdAt).getMinutes()}</p>
        </div>
      </div>`;
        newTask.appendChild(activeTask);
      }
    }
  }
}

// проверка ActiveTaskView
// аctiveTaskView = new ActiveTaskView('new-task');
// аctiveTaskView.display(arrTest, 'Nika');

class CompliteTaskView {
  constructor(id = 'done-task') {
    this.id = id;
  }

  display(compliteTaskArr = [], user) {
    compliteTaskArr = compliteTaskArr.sort((a, b) => a.createdAt - b.createdAt);
    const allDoneTask = document.getElementById(this.id);
    allDoneTask.innerHTML = '';
    const doneTask = document.createElement('p');
    doneTask.innerHTML = 'Выполнено';
    allDoneTask.appendChild(doneTask);
    if (user === '' || user === undefined) {
      const info = document.createElement('div');
      info.innerHTML = '<div class="info"><p>Здесь будут отображаться твои выполненные задачи;)</p></div>';
      allDoneTask.appendChild(info);
    }
    for (let i = 0; i < compliteTaskArr.length; i++) {
      if (compliteTaskArr[i].author === user && compliteTaskArr[i].isActive === false) {
        const newDoneTask = document.createElement('div');
        newDoneTask.innerHTML = `<div class="container-task" id="${compliteTaskArr[i].id}">
        <div class="text-task">
          <i class="fas fa-check"></i>
          <p>${compliteTaskArr[i].text}</p>
          <i class="fas fa-edit"></i>
          <i class="fas fa-trash-alt"></i>
        </div>
        <div class="time">
          <p>${new Date(compliteTaskArr[i].createdAt).getDate()}/${new Date(compliteTaskArr[i].createdAt).getMonth() + 1}/${new Date(compliteTaskArr[i].createdAt).getFullYear()}</p>
          <p>${new Date(compliteTaskArr[i].createdAt).getHours()}:${new Date(compliteTaskArr[i].createdAt).getMinutes()}</p>
        </div>
      </div>`;
        allDoneTask.appendChild(newDoneTask);
      }
    }
  }
}
// //проверка CompliteTaskView
// сompliteTaskView = new CompliteTaskView('done-task');
// сompliteTaskView.display(arrTest, 'Nika');
