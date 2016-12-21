import React, {Component, PropTypes} from 'react';
import SearchInput, {createFilter} from 'react-search-input';

const KEYS_TO_FILTERS = ['body'];

const name = 'coral-plugin-searchbox';

class SearchBox extends Component {

  static propTypes = {
    id: PropTypes.string,
    items: PropTypes.array
  }

  state = {
    searchTerm: ''
  }

  render () {
    const filteredItems = this.props.items.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

    return (
      <div className={`${name}-container`}>
        <SearchInput className="search-input" onChange={this.searchUpdated}/>
        {filteredItems.map(item => {
          return (
            <div className="item" key={item.id}>
              <div className="body">{item.body}</div>
            </div>
          );
        })}
      </div>
    );
  }

  searchUpdated (term) {
    this.setState({searchTerm: term});
    this.props.dispatch(this.props.fetchItems(term));
  }
}

export default SearchBox;
