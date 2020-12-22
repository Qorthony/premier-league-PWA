const loadKlasemen = () => {
  showLoader(true);
  getKlasemenFromCache();

  let klasemen = getKlasemen();
  let timFavorit = getTimFav();

  Promise.all([klasemen, timFavorit]).then((values) => {
    const content = document.getElementById("body-content");
    let str = JSON.stringify(values[0]).replace(/http:/g, "https:");
    data = JSON.parse(str);
    let html = "";

    let item = "";
    values[0].standings[0].table.forEach((result) => {
      let btnTambah = `<a href="#home" class="waves-effect waves-light blue darken-1 btn" onclick="tambahTimFav(${result.team.id}, '${result.team.name}', '${result.team.crestUrl}');">Tambah</a>`;
      values[1].forEach((tim) => {
        if (tim.id === result.team.id) {
          btnTambah = `<a class="secondary-content" style="float:left"><i class="material-icons">grade</i></a>`;
        }
      });

      item += `
                <tr>
                    <td>${result.position}</td>
                    <td> <img class="responsive-img" width="24" height="24" src="${
                      result.team.crestUrl || "img/empty_badge.svg"
                    }" alt="logo" > ${result.team.name}</td>
                    <td>${result.playedGames}</td>
                    <td>${result.won}</td>
                    <td>${result.draw}</td>
                    <td>${result.lost}</td>
                    <td>${result.points}</td>
                    <td>${btnTambah}</td>
                </tr>
              `;
    });

    html += `
        <div class="row">
        <div class="s12">
          <div class="card">
            <div class="card-content">
              <div class="card-title">
                <h5>Klasemen Liga Inggris</h5>
                <hr>
              </div>
              <table class="striped responsive-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Tim</th>
                    <th>M</th>
                    <th>M</th>
                    <th>S</th>
                    <th>K</th>
                    <th>Poin</th>
                    <th>Tim Favorit</th>
                  </tr>
                </thead>
                <tbody id="data-klasemen">${item} </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
        `;
    content.innerHTML = html;
    showLoader(false)
  });
};

const loadPertandingan = () => {
  showLoader(true);
  getPertandinganFromCache();

  let pertandingan = getPertandingan();
  let pertandinganFavorit = getPertandinganFav();

  Promise.all([pertandingan, pertandinganFavorit]).then((values) => {
    const content = document.getElementById("body-content");
    let html = "";
    let item = "";

    values[0].matches.forEach((match) => {
      // let score = "";
      if (match.status == "POSTPONED") {
        match.score = "POSTPONED";
      } else if (match.status == "FINISHED") {
        match.score = `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`;
      } else if (match.status == "SCHEDULED") {
        match.score = "vs";
      } else {
        match.score = "";
      }

      let btnTambah = `<a class="waves-effect waves-light blue darken-1 btn" onclick="tambahPertandinganFav(${match.id}, ${match.matchday},'${match.homeTeam.name}','${match.score}','${match.awayTeam.name}')" >Tambah</a>`;
      values[1].forEach((pertandingan) => {
        if (pertandingan.id === match.id) {
          btnTambah = `<a class="secondary-content" style="float:left"><i class="material-icons">grade</i></a>`;
        }
      });

      item += `
            <tr>
                <td>${match.matchday}</td>
                <td>${match.homeTeam.name}</td>
                <td>${match.score}</td>
                <td>${match.awayTeam.name}</td>
                <td>${btnTambah}</td>
            </tr>
        `;
    });

    html += `
            <div class="row">
                <div class="col s12">
                    <div class="card">
                        <div class="card-content">
                            <div class="card-title">
                                <h5>Pertandingan Liga Inggris</h5>
                                <hr>
                            </div>
                            <table class="striped centered responsive-table">
                                <thead>
                                    <tr>
                                        <th>Pekan Ke-</th>
                                        <th>Tim Kandang</th>
                                        <th>Skor</th>
                                        <th>Tim Tandang</th>
                                        <th>Tambah ke Favorit</th>
                                    </tr>
                                </thead>
                                <tbody id="data-klasemen"> ${item}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        `;

    content.innerHTML = html;
    showLoader(false)
  });
};

const loadFavorit = () => {
  showLoader(true);
  const content = document.getElementById("body-content");
  let timFav = getTimFav();
  let pertandinganFav = getPertandinganFav();

  Promise.all([timFav, pertandinganFav]).then((values) => {
    console.log(values);
    let html = "";
    let itemTim = "";
    let itemPertandingan = "";

    if (values[0].length) {
      values[0].forEach((tim) => {
        itemTim += `
            <li class="collection-item avatar">
              <img src="${tim.logo}" alt="logo" class="circle">
              <span class="title">${tim.nama}</span>
              <a href="#favorites" class="secondary-content" onclick="hapusTimFav(${tim.id})"><i class="material-icons">delete</i></a>
            </li>
        `;
      });
    } else {
      itemTim += `
          <li class="collection-item">Belum ada tim yang dipilih</li>
      `;
    }

    if (values[1].length) {
      values[1].forEach((pertandingan) => {
        itemPertandingan += `
            <li class="collection-item" style="display:flex">
              <p>${pertandingan.timKandang} ${pertandingan.skor} ${pertandingan.timKandang} </p>
              <a href="#favorites" class="secondary-content" onclick="hapusPertandinganFav(${pertandingan.id})" style="flex-grow:1;text-align:end;align-self:center"><i class="material-icons">delete</i></a>
              
            </li>
        `;
      });
    } else {
      itemPertandingan += `
          <li class="collection-item">Belum ada pertandingan yang dipilih</li>
      `;
    }

    html += `
      <div class="row">
        <div class="col s12 m6">
          <ul class="collection with-header">
            <li class="collection-header black white-text "><h5>Tim Favorit</h5></li>
            ${itemTim}
          </ul>
        </div>
        <div class="col s12 m6">
          <ul class="collection with-header">
            <li class="collection-header black white-text "><h5>Pertandingan Favorit</h5></li>
            ${itemPertandingan}
          </ul>
        </div>
      </div>
    `;

    content.innerHTML = html;
    showLoader(false);
  });
};

// IndexDB Operation
const dbPromise = idb.open("football", 1, (upgradeDb) => {
  if (!upgradeDb.objectStoreNames.contains("timFav")) {
    upgradeDb.createObjectStore("timFav", { keyPath: "id" });
  }
  if (!upgradeDb.objectStoreNames.contains("pertandinganFav")) {
    upgradeDb.createObjectStore("pertandinganFav", { keyPath: "id" });
  }
});

const tambahTimFav = (id, nama, logo) => {
  dbPromise
    .then((db) => {
      let tx = db.transaction("timFav", "readwrite");
      let store = tx.objectStore("timFav");
      let item = {
        id: id,
        nama: nama,
        logo: logo,
        createdAt: new Date().getTime(),
      };
      store.put(item);
      return tx.complete;
    })
    .then(() => {
      M.toast({ html: `Tim Favorit berhasil disimpan!` });
      console.log("Tim berhasil disimpan");
      loadKlasemen();
    })
    .catch((err) => {
      console.error("Tim gagal disimpan", err);
    });
};

const getTimFav = () => {
  return dbPromise.then((db) => {
    let tx = db.transaction("timFav", "readonly");
    let store = tx.objectStore("timFav");
    return store.getAll();
  });
};

const hapusTimFav = (id) => {
  dbPromise
    .then((db) => {
      let tx = db.transaction("timFav", "readwrite");
      let store = tx.objectStore("timFav");
      store.delete(id);
      return tx.complete;
    })
    .then(() => {
      M.toast({ html: "Tim favorit telah dihapus" });
      loadFavorit();
    })
    .catch((err) => {
      console.error("Error : ", err);
    });
};

// idb untuk pertandingan
const tambahPertandinganFav = (id, pekan, timKandang, skor, timTandang) => {
  dbPromise
    .then((db) => {
      let tx = db.transaction("pertandinganFav", "readwrite");
      let store = tx.objectStore("pertandinganFav");
      let item = {
        id: id,
        pekan: pekan,
        timKandang: timKandang,
        skor: skor,
        timTandang: timTandang,
        createdAt: new Date().getTime(),
      };
      store.put(item);
      return tx.complete;
    })
    .then(() => {
      M.toast({ html: `Pertandingan Favorit berhasil disimpan!` });
      console.log("Pertandingan berhasil disimpan");
      loadPertandingan();
    })
    .catch((err) => {
      console.error("Pertandingan gagal disimpan", err);
    });
};

const getPertandinganFav = () => {
  return dbPromise.then((db) => {
    let tx = db.transaction("pertandinganFav", "readonly");
    let store = tx.objectStore("pertandinganFav");
    return store.getAll();
  });
};

const hapusPertandinganFav = (id) => {
  dbPromise
    .then((db) => {
      let tx = db.transaction("pertandinganFav", "readwrite");
      let store = tx.objectStore("pertandinganFav");
      store.delete(id);
      return tx.complete;
    })
    .then(() => {
      M.toast({ html: "Pertandingan favorit telah dihapus" });
      loadFavorit();
    })
    .catch((err) => {
      console.error("Error : ", err);
    });
};

const showLoader = (state) => {
  if (state) {
    document.getElementById("loader").style.display = "block";
  } else {
    document.getElementById("loader").style.display = "none";
  }
};
