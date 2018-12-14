import React, { Component } from 'react'
import styles from '../styles/Masonry.module.css'

class Masonry extends Component {

  state = {
    numColumns: 1,
		columns: []
  }

  scrollRef = React.createRef()

  handleResize = () => {
    let numColumns = Math.floor(window.innerWidth / this.props.columnWidth) || 1
    this.setState({numColumns})
  }

  componentDidMount() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize)
  }

  drawGrid = () => {
		if (!this.props.children) return
		let columns = []
		let nCols = this.state.numColumns
		this.props.children.forEach((tile, i) => {
			let index = i % nCols
			if (columns[index]) {
				columns[index].push(tile)
			} else {
				columns[index] = [tile]
			}
		})
		return columns
  }

  render() {
		let columns = this.drawGrid()
    return (
      <div className={styles.root}>
        {columns.map((column) =>
					<div style={{width: this.props.columnWidth}} className={styles.column} key={columns.indexOf(column)}>
						{column.map(tile => tile)}
					</div>
				)}
      </div>
    )
  }
}

export default Masonry
