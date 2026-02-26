class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _handleResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Error: ${res.status}`);
  }

  _request(endpoint, options) {
    return fetch(`${this._baseUrl}${endpoint}`, options).then(
      this._handleResponse,
    );
  }

  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getInitialCards() {
    return this._request("/cards", {
      method: "GET",
      headers: this._headers,
    });
  }
  getUserInfo() {
    return this._request("/users/me", {
      method: "GET",
      headers: this._headers,
    });
  }

  editUserInfo(name, about) {
    return this._request("/users/me", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ name, about }),
    });
  }
  updateAvatar(avatar) {
    return this._request("/users/me/avatar", {
      method: "PATCH",
      headers: this._headers,
      body: JSON.stringify({ avatar }),
    });
  }

  createCard({ name, link }) {
    return this._request("/cards", {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({ name, link }),
    });
  }

  deleteCard(cardId) {
    return this._request(`/cards/${cardId}`, {
      method: "DELETE",
      headers: this._headers,
    });
  }

  likeCard(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "PUT",
      headers: this._headers,
    });
  }

  dislikeCard(cardId) {
    return this._request(`/cards/${cardId}/likes`, {
      method: "DELETE",
      headers: this._headers,
    });
  }
}

export default Api;
