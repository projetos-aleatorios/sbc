const overlay = document.getElementById('overlay');
const query = new URLSearchParams(window.location.search);
let elo;

class SoloBoom {

  static #endpoint = "https://soloboomchallenge.com/backend/api/Stats?tournamentId=fa942c88-07d6-41b7-87a2-b4398fa725d9";

  static async #sbc() {
    const response = await fetch(this.#endpoint);
    const data = await response.json();
    return data;
  }

  static #player_data(player) {
    player.rankStatus = player.rankStatus === ' | 0 LP' ? "MD5" : player.rankStatus;
    elo = player.rankStatus;
    return player;
  }

  static async search_player(streamerName) {
    const data = await this.#sbc();
    const player = data.find(i => i.streamerName.toLowerCase() === streamerName.toLowerCase());

    if (!player) throw new Error("no_player");

    return this.#player_data(player);
  }

}

async function run() {
  try {
    if (!query.get('streamerName')) return overlay.innerHTML = `Exemplo: ${window.location.hostname}?streamerName=nicklink`;
    const { rankStatus } = await SoloBoom.search_player(query.get('streamerName'));
    overlay.innerHTML = `Elo: ${rankStatus}`;
  } catch (e) {
    if (e.message == "no_player") return overlay.innerHTML = `${query.get('streamerName')} não está participando do SoloBoom`;
    return overlay.innerHTML = `Elo: ${elo}`;
  };
};

run();
setInterval(run, 60000);