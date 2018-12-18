import React, { Component } from 'react'
import Gif from './Gif'
import Masonry from './Masonry'
import LinearProgress from '@material-ui/core/LinearProgress'
import Icon from '@material-ui/core/Icon'

import styles from '../styles/Giphy.module.css'

class Giphy extends Component {

  state = {
    trendingGifs: [],
    trendingCache: {},
    trendingOffset: 0,
    searchResults: [],
    searchCache: {},
    searchOffset: 0,
    fetching: false,
    searchInput: '',
    searchTerm: '',
    columnWidth: 300,
    mode: 'trending'
  }

  handleInput = (e) => {
    this.setState({searchInput: e.target.value})
  }

  handleKeys = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      this.handleSearch()
    }
  }

  handleClear = () => {
    this.setState({searchInput: '', mode: 'trending'})
  }

  handleSearch = () => {
    if (this.state.searchInput.length < 1) return
    this.setState({
      mode: 'search',
      searchTerm: this.state.searchInput,
      searchOffset: 0,
      searchResults: [],
      searchCache: {}
    }, () => {
      this.fetchGifs(this.state.searchInput)
    })
  }

  handleScroll = (e) => {
    if (this.state.fetching) return
    let { scrollHeight, clientHeight, scrollTop } = e.target
    let distanceToBottom = scrollHeight - clientHeight - scrollTop
    if (distanceToBottom < 10) {
      this.state.mode === 'search'
        ? this.fetchGifs(this.state.searchTerm)
        : this.fetchGifs()
    }
  }

  fetchGifs = (search) => {
    this.setState({fetching: true})
    let gifs, cache, offset, url
    if (search) {
      gifs = this.state.searchResults
      cache = this.state.searchCache
      offset = this.state.searchOffset
      url = `http://api.giphy.com/v1/gifs/search?q=${search}&offset=${offset}&limit=5&api_key=Zkseoil9MQBO3b2mhkJEA9OpbRtluYpK`
    } else {
      gifs = this.state.trendingGifs
      cache = this.state.trendingCache
      offset = this.state.trendingOffset
      url = `http://api.giphy.com/v1/gifs/trending?offset=${offset}&limit=5&api_key=Zkseoil9MQBO3b2mhkJEA9OpbRtluYpK`
    }
    fetch(url).then((res) => {
      return res.json()
    })
    .then((json) => {
      if (json.meta.status === 200) {
        json.data.forEach((gif) => {
          if (cache[gif.id]) return
          cache[gif.id] = gif
          gifs.push(gif)
        })
        let gifList = search
          ? {searchResults: gifs, searchCache: cache, searchOffset: offset + 5}
          : {trendingGifs: gifs, trendingCache: cache, trendingOffset: offset + 5}
        this.setState({
          ...gifList,
          fetching: false
        })
      } else {
        this.setState({fetching: false})
      }
    })
    .catch((err) => {
      this.setState({fetching: false})
    })
  }

  componentDidMount() {
    this.fetchGifs()
  }

  render() {
    let gifs = this.state.mode === 'search'
      ? this.state.searchResults
      : this.state.trendingGifs

    return (
      <div className={styles.root} onScroll={this.handleScroll}>
        <div className={styles.header}>
          <div className={styles.title}>GIPHY DEMO</div>
          <div className={styles.search}>
            <Icon onClick={this.handleClear}>clear</Icon>
            <input
              placeholder="Search..."
              value={this.state.searchInput}
              onChange={this.handleInput}
              onKeyUp={this.handleKeys}
              className={styles.input}
            />
            <Icon onClick={this.handleSearch}>search</Icon>
          </div>
          {this.state.fetching &&
            <div className={styles.loading}>
              <LinearProgress/>
            </div>
          }
        </div>
        <Masonry columnWidth={this.state.columnWidth}>
          {gifs.map((gif) =>
            <Gif gif={gif} key={gif.id} width={this.state.columnWidth}/>
          )}
        </Masonry>
      </div>
    )
  }
}

export default Giphy
