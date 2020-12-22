const API_KEY = "031cb13ff0274b41bf48afd7b3513c90";
const base_url = "https://api.football-data.org/v2/";
const klasemen_url = `${base_url}competitions/2021/standings`;
const pertandingan_url = `${base_url}competitions/2021/matches`;

const fetchAPI = (url) => {
  return fetch(url, {
    headers: {
      "X-Auth-Token": API_KEY,
    },
  });
};

const status = (res) => {
  if (res.status !== 200) {
    console.log("Error : " + res.status);

    return Promise.reject(new Error(res.statusText));
  } else {
    return Promise.resolve(res);
  }
};

const toJson = (res) => {
  return res.json();
};

const getKlasemenFromCache = () => {
  if ("caches" in window) {
    caches.match(klasemen_url).then((response) => {
      if (response) {
        response.json().then((data) => {
          const content = document.getElementById("body-content");
          let str = JSON.stringify(data).replace(/http:/g, "https:");
          data = JSON.parse(str);
          let html = "";

          let item = "";
          data.standings[0].table.forEach((result) => {
            item += `
              <tr>
                  <td>${result.position}</td>
                  <td> <img class="responsive-img" width="24" height="24" src="${
                    result.team.crestUrl || "img/empty_badge.svg"
                  }"> ${result.team.name}</td>
                  <td>${result.playedGames}</td>
                  <td>${result.won}</td>
                  <td>${result.draw}</td>
                  <td>${result.lost}</td>
                  <td>${result.points}</td>
                  <td><a class="waves-effect waves-light blue darken-1 btn" onclick="tambahTimFav(${
                    result.team.id
                  }, '${result.team.name}', '${
              result.team.crestUrl
            }');">Tambah</a></td>
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
        });
      }
    });
  }
};

const getPertandinganFromCache = () =>{
  if ("caches" in window) {
    caches.match(pertandingan_url).then(response=>{
      if (response) {
        response.json().then(data=>{
          const content = document.getElementById("body-content");
          let html = "";
          let item = "";

          data.matches.forEach((match) => {
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
            item += `
                  <tr>
                      <td>${match.matchday}</td>
                      <td>${match.homeTeam.name}</td>
                      <td>${match.score}</td>
                      <td>${match.awayTeam.name}</td>
                      <td><a class="waves-effect waves-light blue darken-1 btn" onclick="tambahPertandinganFav(${match.id}, ${match.matchday},'${match.homeTeam.name}','${match.score}','${match.awayTeam.name}')" >Tambah</a></td>
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
        })
      }
    })
  }
}

const getKlasemen = () => {
  return fetchAPI(klasemen_url).then(status).then(toJson);
};

const getPertandingan = () => {
  return fetchAPI(pertandingan_url).then(status).then(toJson);
};
