import React from 'react'
import styles from '../styles/Gif.module.css'

const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']

class Gif extends React.Component {
  state = {
    loading: true,
    showInfo: false,
    color: 'black'
  }

  loaded = () => {
    this.setState({loading: false})
  }

  showInfo = () => {
    this.setState({showInfo: !this.state.showInfo})
  }

  hover = () => {
    this.setState({showInfo: true})
  }

  unhover = () => {
    this.setState({showInfo: false})
  }

  componentDidMount() {
    let color = colors[Math.floor(Math.random() * colors.length)]
    this.setState({color})
  }


  render() {
    let { gif } = this.props
    let { loading, showInfo } = this.state

    let scale = Number(gif.images.original.width) / this.props.width
    let height = Number(gif.images.original.height) / scale


    return (
      <div className={styles.frame} onMouseEnter={this.hover} onMouseLeave={this.unhover}>
        <img
          src={gif.images.downsized.url}
          className={styles.image}
          onLoad={this.loaded}
          style={{height: height, backgroundColor: this.state.color}}
        />
        {showInfo && <div className={styles.info}>
          <div className={styles.title}>{gif.title}</div>
          {gif.user &&
            <div className={styles.user}>
              <img src={gif.user.avatar_url} className={styles.avatar}/>
              {gif.user.display_name}
            </div>
          }
        </div>}
      </div>
    )
  }
}

export default Gif
