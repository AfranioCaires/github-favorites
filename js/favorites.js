export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }
  load() {
    const entries = JSON.parse(localStorage.getItem("@github-favorites")) || [];
  }

  delete(user) {
    this.entries = this.entries.filter((entry) => entry.login !== user.login);
    this.update();
  }
}
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");
    this.update();
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

  removeAllRows() {
    this.tbody.querySelectorAll("tr").forEach((tr) => tr.remove());
  }
}
