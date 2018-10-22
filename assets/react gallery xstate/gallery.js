// https://unpkg.com/fetch-jsonp@1.1.3/build/fetch-jsonp.js
// https://unpkg.com/flipping@latest/dist/flipping.web.js

const { Machine } = xstate;

const flipping = new Flipping();

const galleryMachine = Machine({
  initial: 'start',
  states: {
    start: {
      on: {
        SEARCH: 'loading'
      }
    },
    loading: {
      onEntry: ['search'],
      on: {
        SEARCH_SUCCESS: {
          target: 'gallery',
          actions: ['updateItems']
        },
        SEARCH_FAILURE: 'error',
        CANCEL_SEARCH: 'gallery'
      }
    },
    error: {
      on: {
        SEARCH: 'loading'
      }
    },
    gallery: {
      on: {
        SEARCH: 'loading',
        SELECT_PHOTO: 'photo'
      }
    },
    photo: {
      onEntry: ['setPhoto'],
      on: {
        EXIT_PHOTO: 'gallery'
      }
    }
  }
});

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      gallery: galleryMachine.initialState.value,
      query: '',
      items: []
    };
  }

  command(action, event) {
    switch (action.type) {
      case 'search':
        // execute the search command
        this.search(event.query);
        break;
      case 'updateItems':
        if (event.items) {
          // update the state with the found items
          return { items: event.items };
        }
        break;
      case 'setPhoto':
        if (event.item) {
          return { photo: event.item }
        }
      default:
        break;
    }
  }

  send(event) {
    const currentGalleryState = this.state.gallery;
    const nextGalleryState =
      galleryMachine.transition(currentGalleryState, event.type);

    const nextState = nextGalleryState.actions
      .reduce((state, action) => this.command(action, event) || state, undefined);

    flipping.read();

    this.setState({
      gallery: nextGalleryState.value,
      ...nextState
    }, () => flipping.flip());
  }

  handleSubmit(e) {
    e.persist();
    e.preventDefault();

    this.send({ type: 'SEARCH', query: this.state.query });
  }

  search(query) {
    const encodedQuery = encodeURIComponent(query);

    setTimeout(() => {
      fetchJsonp(
        `https://api.flickr.com/services/feeds/photos_public.gne?lang=en-us&format=json&tags=${encodedQuery}`,
        { jsonpCallback: 'jsoncallback' })
        .then(res => res.json())
        .then(data => {
          this.send({ type: 'SEARCH_SUCCESS', items: data.items });
        })
        .catch(error => {
          this.send({ type: 'SEARCH_FAILURE' });
        });
    }, 1000);
  }
  handleChangeQuery(value) {
    this.setState({ query: value })
  }
  renderForm(state) {
    const searchText = {
      loading: 'Searching...',
      error: 'Try search again',
      start: 'Search'
    }[state] || 'Search';

    return (
      <form className="ui-form" onSubmit={e => this.handleSubmit(e)}>
        <input
          type="search"
          className="ui-input"
          value={this.state.query}
          onChange={e => this.handleChangeQuery(e.target.value)}
          placeholder="Search Flickr for photos..."
          disabled={state === 'loading'}
        />
        <div className="ui-buttons">
          <button
            className="ui-button"
            disabled={state === 'loading'}
            data-flip-key="search">
            {searchText}
          </button>
          {state === 'loading' &&
          <button
            className="ui-button"
            type="button"
            onClick={() => this.send({ type: 'CANCEL_SEARCH' })}>
            Cancel
          </button>
          }
        </div>
      </form>
    );
  }
  renderGallery(state) {
    return (
      <section className="ui-items" data-state={state}>
        {state === 'error'
          ? <span className="ui-error">Uh oh, search failed.</span>
          : this.state.items.map((item, i) =>
            <img
              src={item.media.m}
              className="ui-item"
              style={{'--i': i}}
              key={item.link}
              onClick={() => this.send({
                type: 'SELECT_PHOTO', item
              })}
            />
          )
        }
      </section>
    );
  }
  renderPhoto(state) {
    if (state !== 'photo') return;

    return (
      <section
        className="ui-photo-detail"
        onClick={() => this.send({ type: 'EXIT_PHOTO' })}>
        <img src={this.state.photo.media.m} className="ui-photo"/>
      </section>
    )
  }
  render() {
    const galleryState = this.state.gallery;

    return (
      <div className="ui-app" data-state={galleryState}>
        {this.renderForm(galleryState)}
        {this.renderGallery(galleryState)}
        {this.renderPhoto(galleryState)}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
