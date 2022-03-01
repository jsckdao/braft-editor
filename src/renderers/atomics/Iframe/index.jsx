import './style.scss'
import React from 'react'
import { ContentUtils } from 'braft-utils'

export default class IFrame extends React.Component {

  state = {
    toolsVisible: false,
    curVisibleTool: '',
    curUrl: '',
    curWidth: '',
    curHeight: ''
  };

  lockEditor () {
    this.props.editor.lockOrUnlockEditor(true)
  }

  unlockEditor () {
    this.props.editor.lockOrUnlockEditor(false)
  }

  showTools = () => {
    const { url, width, height } = this.props.mediaData
    this.setState({
      toolsVisible: true,
      curVisibleTool: '',
      curUrl: url,
      curWidth: width || '',
      curHeight: height || ''
    }, () => this.lockEditor())
  }

  hideTools = () => {
    this.setState({ toolsVisible: false }, () => this.unlockEditor())
  }

  setUrl = (evt) => {
    this.setState({ curUrl: evt.target.value })
  }

  setImageWidth = (evt) => {
    this.setState({ curWidth: evt.target.value })
  }

  setImageHeight = (evt) => {
    this.setState({ curHeight: evt.target.value })
  }

  setMediaData(data) {
    this.props.editor.setValue(ContentUtils.setMediaData(this.props.editor.getValue(), this.props.entityKey, data))
    window.setImmediate(this.props.editor.forceRender)
  }

  switchTool(type) {
    if (this.state.curVisibleTool === type) {
      this.setState({ curVisibleTool: '' })
    } else {
      this.setState({ curVisibleTool: type })
    }
  }

  removeIframe = () => {
    this.props.editor.setValue(ContentUtils.removeBlock(this.props.editor.getValue(), this.props.block))
    this.unlockEditor()
  }

  confirmUrl = () => {
    this.setMediaData({ url: this.state.curUrl })
  }

  confirmIframeSize = () => {
    this.setMediaData({
      width: this.state.curWidth,
      height: this.state.curHeight
    })
  }

  render() {

    const { mediaData, language } = this.props
    const { toolsVisible, curUrl, curHeight, curWidth, curVisibleTool } = this.state
    const { url, name, width, height } = mediaData

    return (
      <div className="bf-iframe-wrap">
        <iframe src={url} title={name} frameBorder="0" style={{ width, height }} />
        <div className="bf-iframe-mask" onMouseEnter={this.showTools} onMouseLeave={this.hideTools}>
          {toolsVisible && (
            <div className="bf-media-toolbar"
              data-float="left"
              data-align="center">
              {curVisibleTool === 'url' && (
                <div className='bf-image-link-editor'>
                  <div className='editor-input-group'>
                    <input type='text' placeholder={language.linkEditor.inputWithEnterPlaceHolder}
                      onChange={this.setUrl} value={curUrl}
                    />
                    <button type='button' onClick={this.confirmUrl}>{language.base.confirm}</button>
                  </div>
                </div>
              )}

              {curVisibleTool === 'size' && (
                <div className='bf-image-size-editor'>
                  <div className='editor-input-group'>
                    <input type='text' placeholder={language.base.width} onChange={this.setImageWidth} value={curWidth} />
                    <input type='text' placeholder={language.base.height} onChange={this.setImageHeight} value={curHeight} />
                    <button type='button' onClick={this.confirmIframeSize}>{language.base.confirm}</button>
                  </div>
                </div>
              )}

              <a className={curVisibleTool === 'url' ? 'active' : ''} onClick={() => this.switchTool('url')}>
                <span>&#xe91a;</span>
              </a>
              <a className={curVisibleTool === 'size' ? 'active' : ''} onClick={() => this.switchTool('size')}>
                <span>&#xe3c2;</span>
              </a>
              <a onClick={this.removeIframe}>
                <span>&#xe9ac;</span>
              </a>
            </div>
          )}
        </div>

      </div>
    )
  }

}