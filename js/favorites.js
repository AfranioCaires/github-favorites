export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`;

    return fetch(endpoint).then((data) =>
      data.json().then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        followers,
        public_repos,
      }))
    );
  }
}

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries));
  }

  async add(user) {
    try {
      const githubUser = await GithubUser.search(user);
      if (githubUser.login === undefined) throw new Error("User not found");
      if (this.entries.some((entry) => entry.login === githubUser.login))
        throw new Error("User already exists");
      this.entries = [githubUser, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    this.entries = this.entries.filter((entry) => entry.login !== user.login);
    this.update();
    this.save();
  }
}
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.update();
    this.onAdd();
  }

  update() {
    this.removeAllRows();
    this.entries.forEach((user) => {
      const row = this.createRow();
      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `${user.name} avatar`;
      row.querySelector(".user a").href = `htttps://github.com/${user.login}`;
      row.querySelector(".followers").textContent = user.followers;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      this.tbody.append(row);
      row.querySelector(".remove").onclick = () => {
        const confirmDelete = confirm(
          "Are you sure? do you want to remove this user?"
        );
        if (confirmDelete) this.delete(user);
      };
    });
  }

  createRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="user">
      <img src="" alt="">
      <a href="" target="_blank" rel="noopener noreferrer">
        <p></p>
        <span></span>
      </a>
    </td>
    <td class="repositories"></td>
    <td class="followers"></td>
    <td><button class="remove">&times;</button></td>`;

    return tr;
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button");
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input");
      this.add(value);
    };
  }

  removeAllRows() {
    this.tbody.querySelectorAll("tr").forEach((tr) => tr.remove());
  }
}
