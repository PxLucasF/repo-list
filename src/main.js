import api from './api'

class App {
  constructor () {
    this.repositories = [];
    this.formEl = document.getElementById('repo-form');
    this.inputEl = document.querySelector('input[name=repository]');
    this.buttonEl = document.querySelector('button');
    this.listEl = document.getElementById('repo-list');
    this.registerHandlers();
  }

  registerHandlers () {
    this.formEl.onsubmit = event => this.addRepository(event);
  }

  toggleLoading () {
    this.buttonEl.classList.toggle('loading');
  }

  async addRepository () {
    event.preventDefault();

    const repoInput = this.inputEl.value;

    if (repoInput.length === 0) {
      return;
    }

    this.toggleLoading();

    try {
      const response = await api.get(`/repos/${repoInput}`);
      const { name, description, html_url, owner: {avatar_url} } = response.data;
  
      this.repositories.push({
        name,
        description,
        avatar_url,
        html_url
      });
  
      this.inputEl.value = '';
  
      this.render();
    } catch (err) {
      alert(`Repositório "${this.inputEl.value}" não encontrado.`);
    }

    this.toggleLoading();
  }

  render () {
    this.listEl.innerHTML = '';
    this.repositories.forEach(repo => {
      let imgEl = document.createElement('div');
      imgEl.setAttribute('style', `background-image: url('${repo.avatar_url}')`);
      imgEl.classList.add('avatar');
      
      let titleEl = document.createElement('p');
      titleEl.classList.add('title');
      titleEl.innerHTML = repo.name;
      
      let subtitleEl = document.createElement('p');
      subtitleEl.classList.add('subtitle');
      subtitleEl.innerHTML = repo.description;

      let infoEl = document.createElement('div');
      infoEl.classList.add('info');
      infoEl.appendChild(titleEl);
      infoEl.appendChild(subtitleEl);

      let listItemEl = document.createElement('a');
      listItemEl.href = repo.html_url;
      listItemEl.appendChild(imgEl);
      listItemEl.appendChild(infoEl);

      this.listEl.appendChild(listItemEl);
    });
  }
}

new App();