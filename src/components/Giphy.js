import React, { Component } from 'react'
import Gif from './Gif'
import Masonry from './Masonry'
import LinearProgress from '@material-ui/core/LinearProgress'
import Icon from '@material-ui/core/Icon'

import styles from '../styles/Giphy.module.css'

class Giphy extends Component {

  state = {
    gifs: [],
    offset: 0,
    fetching: false,
    searchInput: '',
    columnWidth: 300
  }

  handleInput = (e) => {
    this.setState({searchInput: e.target.value})
  }

  handleKeys = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      this.handleSearch()
    }
  }

  handleSearch = () => {
    if (this.state.searchInput.length < 1) return
    this.setState({offset: 0, gifs: []}, () => this.fetchGifs(this.state.searchInput))
  }

  handleScroll = (e) => {
    if (this.state.fetching) return
    let { scrollHeight, clientHeight, scrollTop } = e.target
    let distanceToBottom = scrollHeight - clientHeight - scrollTop
    if (distanceToBottom < 10) {
      this.fetchGifs()
    }
  }

  fetchGifs = (search) => {
    this.setState({fetching: true})
    let offset, url
    if (search) {
      offset = this.state.offset
      url = `http://api.giphy.com/v1/gifs/search?q=${search}&offset=${offset}&limit=5&api_key=Zkseoil9MQBO3b2mhkJEA9OpbRtluYpK`
    } else {
      offset = this.state.offset
      url = `http://api.giphy.com/v1/gifs/trending?offset=${offset}&limit=5&api_key=Zkseoil9MQBO3b2mhkJEA9OpbRtluYpK`
    }
    fetch(url).then((res) => {
      return res.json()
    })
    .then((json) => {
      if (json.meta.status !== 200) {
        this.setState({fetching: false})
        return
      }
      this.setState({
        gifs: [...this.state.gifs, ...json.data],
        offset: offset + 5,
        fetching: false
      })
    })
    .catch((err) => {
      this.setState({fetching: false})
    })
  }

  componentDidMount() {
    this.fetchGifs()
  }

  render() {
    return (
      <div className={styles.root} onScroll={this.handleScroll}>
        <div className={styles.header}>
          <div className={styles.title}>GIPHY DEMO</div>
          <div className={styles.search}>
            <input
              placeholder="Search..."
              value={this.state.searchInput}
              onChange={this.handleInput}
              onKeyUp={this.handleKeys}
              className={styles.input}
            />
            <Icon onClick={this.handleSearch}>search</Icon>
          </div>
        </div>
        <Masonry columnWidth={this.state.columnWidth}>
          {this.state.gifs.map((gif) =>
            <Gif gif={gif} key={gif.slug} width={this.state.columnWidth}/>
          )}
        </Masonry>
        {this.state.fetching &&
          <div className={styles.loading}>
            <LinearProgress/>
          </div>
        }
      </div>
    )
  }
}

export default Giphy
