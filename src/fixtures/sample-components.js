import React from 'react';
import h from "react-hyperscript";
import hyperscript from "hyperscript-helpers";
import '../gallery.scss';

const { div, button, span, input, form, section, img, h1 } = hyperscript(h);

export class Hello extends React.Component {
  render() {
    const Component = this;
    const { toWhat } = Component.props;
    return div(`Hello ${toWhat}`)
  }
}

export class Counter extends React.Component {
  render() {
    const Component = this;
    const { count, type, onClick } = Component.props;

    return div([
      button({ onClick }, `Count : ${count}`),
      span(` -- Type : ${type || 'none'}`)
    ]);
  }
}

export class Input extends React.Component {
  render() {
    const Component = this;
    const { value, onKeyPress, onChange, placeHolder } = Component.props;

    return input({ placeholder: placeHolder, type: "text", value, onChange, onKeyPress }, [])
  }
}

export class InputWithExplicitRef extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    const Component = this;
    const { onKeyPress, placeHolder } = Component.props;
    const onKeyPressWithRef = ev => onKeyPress(ev, this.inputRef);

    return input({ ref: this.inputRef, placeholder: placeHolder, type: "text", onKeyPress: onKeyPressWithRef }, [])
  }
}

export class InputWithImplicitRef extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    const Component = this;
    const { onKeyPress, placeHolder } = Component.props;
    const onKeyPressWithRef = ev => onKeyPress({ key: ev.key, value: this.inputRef.current.value });

    return input({ ref: this.inputRef, placeholder: placeHolder, type: "text", onKeyPress: onKeyPressWithRef }, [])
  }
}

export class TextMessage extends React.Component {
  render() {
    const Component = this;
    const { text } = Component.props;

    return span(`You entered ${text}!`)
  }
}

export class Form extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
  }

  render() {
    const Component = this;
    const { galleryState, onSubmit, onClick } = Component.props;

    const searchText = {
      loading: 'Searching...',
      error: 'Try search again',
      start: 'Search'
    }[galleryState] || 'Search';
    const isLoading = galleryState === 'loading';

    return (
      form(".ui-form", { onSubmit: ev => onSubmit(ev, this.formRef) }, [
        input(".ui-input", {
          ref: this.formRef,
          type: "search",
          placeholder: "Search Flickr for photos...",
          disabled: isLoading,
        }),
        div(".ui-buttons", [
          button(".ui-button", { disabled: isLoading, 'data-flip-key': "search" }, searchText),
          isLoading && button(".ui-button", {
            type: "button",
            onClick: onClick
          }, 'Cancel')
        ])
      ])
    )
  }
}

export class Gallery extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { galleryState, items, onClick } = this.props;
    const isError = galleryState === 'error';

    return (
      section(".ui-items", { 'data-state': galleryState }, [
        isError
          ? span(".ui-error", `Uh oh, search failed.`)
          : items.map((item, i) => img(".ui-item", {
            src: item.media.m,
            style: { '--i': i },
            key: item.link,
            onClick: ev => onClick(item)
          }))
      ])
    );
  }
}

export class Photo extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // NOTE: by machine construction, `photo` exists and is not null
    const { galleryState, onClick, photo } = this.props;

    if (galleryState !== 'photo') return null;

    return (
      section(".ui-photo-detail", { onClick }, [
        img(".ui-photo", { src: photo.media.m })
      ])
    )
  }
}

export class GalleryApp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { query, photo, items, trigger, gallery: galleryState } = this.props;

    return div(".ui-app", { 'data-state': galleryState }, [
      h(Form, { galleryState, onSubmit: trigger('onSubmit'), onClick: trigger('onCancelClick') }, []),
      h(Gallery, { galleryState, items, onClick: trigger('onGalleryClick') }, []),
      h(Photo, { galleryState, photo, onClick: trigger('onPhotoClick') }, [])
    ])
  }
}
