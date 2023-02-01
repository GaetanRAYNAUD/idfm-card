class ContentCardExample extends HTMLElement {
  set hass(hass) {
    const entityId = this.config.entity;
    const state = hass.states[entityId];
    let title = state ? state.entity_id : 'unavailable';

    if (state && state.attributes) {
      if (state.attributes['start_name']) {
        title = state.attributes['start_name'];
      } else if (state.attributes['friendly_name']) {
        title = state.attributes['friendly_name'];
      }
    }

    if (this.config['name']) {
      title = this.config['name'];
    }

    if (this.config['suffix']) {
      title += this.config['suffix'];
    }

    if (!this.content) {
      this.innerHTML = `
        <ha-card header="">
          <div class="card-content"></div>
        </ha-card>
      `;
      this.card = this.querySelector('ha-card');
      this.card.setAttribute('header', title);

      this.content = this.querySelector('div');
    }

    this.content.innerHTML = `
      <table style="border-spacing: 24px 12px">
        <thead>
          <tr>
            <th></th>
            <th>Heure</th>
            <th>Dans</th>
            <th>Destination</th>
            <th>Quai</th>
            <th>Mission</th>
          </tr>        
        </thead>
        <tbody id="table-body"></tbody>
      </table>
    `;

    if (state && state.attributes && state.attributes['trains'] && state.attributes['trains'].length > 0) {
      this.body = this.querySelector('#table-body');

      const size = this.config['size'] ? Math.min(this.config['size'], state.attributes['trains'].length) : state.attributes['trains'].length;
      for (let i = 0; i < size; i++) {
        const train = state.attributes['trains'][i];
        let row = this.body.insertRow();
        row.style.padding = '3px'
        let cell = row.insertCell();

        if (train.line) {
          let img = document.createElement('img');
          img.src = '/local/images/' + train.line + '.png';
          img.style.width = '30px';
          img.style.margin = 'auto';
          img.style.display = 'block';
          cell.appendChild(img);
        }

        cell = row.insertCell();
        cell.innerHTML = train.time ? new Date(train.time).toLocaleTimeString().slice(0, -3) : '';

        cell = row.insertCell();
        cell.innerHTML = train.time ? Math.floor((Math.abs(new Date(train.time) - new Date()) / 1000) / 60) + ' minutes' : '';

        cell = row.insertCell();
        cell.innerHTML = train.end ?? '';

        cell = row.insertCell();
        cell.innerHTML = train.platform ?? '';

        cell = row.insertCell();
        cell.innerHTML = train.mission ?? '';
      }
    }
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    }

    this.config = config;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('idfm-card', ContentCardExample);
