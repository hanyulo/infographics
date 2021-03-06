/* eslint-disable react/no-find-dom-node */
import React, { Component, PropTypes } from "react"
import { Link } from "react-router"
import ReactHowler from "react-howler"
import classnames from "classnames"
import Swipeable from "react-swipeable"
import SVGInline from "react-svg-inline"
import ReactCSSTransitionReplace from "react-css-transition-replace"
import raf from "raf" // requestAnimationFrame polyfill

import Page from "../Page"
import styles from "./Slide.scss"
import commonStyles from "../../styles/common.scss"
import LeftNavButton from "../../components/Navigation/LeftNavButton"
import RightNavButton from "../../components/Navigation/RightNavButton"
import CirclePlayButton from "../../components/Navigation/CirclePlayButton"
import Header from "../../components/Header"
import VideoPlayer from "../../components/Multimedia/VideoPlayer"
import LastSlide from "./LastSlide"
import MapOverlay from "./MapOverlay"

import navHomeIcon from "../../../content/assets/nav-home.svg"
import navHomeMobileIcon from "../../../content/assets/nav-home-mobile.svg"

import { PHOTOS, VIDEOS, AUDIOS, TEXT } from "./multimedia.js"

const MAP_SLIDE_INDEX = 2

let velocity
if (typeof window !== "undefined") {
  velocity = require("velocity-animate")
}

class Slide extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollPercent: 0,
      isMute: false,
      isPlaying: false,
      percentage: 0,
    }
    this.getPhotoByIndex = this.getPhotoByIndex.bind(this)
    this.getVideoByIndex = this.getVideoByIndex.bind(this)
    this.startAudioProgressSeek = this.startAudioProgressSeek.bind(this)
    this.renderSeekPercent = this._renderSeekPercent.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.goPreSlide = this.goPreSlide.bind(this)
    this.goNextSlide = this.goNextSlide.bind(this)
    this.fadeInText = this.fadeInText.bind(this)
  }

  componentDidMount() {
    if (super.componentDidMount) super.componentDidMount()
    this.startAudioProgressSeek()
    window.addEventListener("keydown", this.handleKeyPress)
    this.fadeInText()

    const { slideIndex } = this.props.head
    if(!this.getVideoByIndex(slideIndex) && this.getAudioByIndex(slideIndex)) {
      this.setState({ isPlaying: true })
    }
  }

  componentWillUnmount() {
    this.clearRAF()
    window.removeEventListener("keydown", this.handleKeyPress)
  }

  fadeInText() {
    // let text fade in
    const { textBox } = this
    const { slideIndex } = this.props.head
    const video = this.getVideoByIndex(slideIndex)
    let tDelay = video ? 700 : 400
    let tDuration = video ? 1500 : 1000
    if(slideIndex === MAP_SLIDE_INDEX) {
      tDelay = 3500
      tDuration = 2000
    }

    if(textBox) {
      textBox.style.opacity = '0'
      velocity(textBox, "stop", true)
      velocity(textBox, { opacity: [ 1, 0 ], translateX: [ "-50%", "-50%" ] }, { delay: tDelay, duration: tDuration, easing: "easeInOut" })
    }
  }

  startAudioProgressSeek() {
    const { slideIndex } = this.props.head
    const isAudio = (AUDIOS[slideIndex] && AUDIOS[slideIndex].audio)
    this.clearRAF()
    if(isAudio) {
      // this.setState({isPlaying: true})
      this.renderSeekPercent(isAudio)
    } else {
      // this.setState({isPlaying: false})
    }
  }

  componentWillUpdate(nextProps) {
    const nextSlideIndex = nextProps.head.slideIndex
    const { slideIndex } = this.props.head
    if(this.getAudioByIndex(nextSlideIndex) &&
       this.getAudioByIndex(slideIndex) === this.getAudioByIndex(nextSlideIndex)) {
      // last two slide, continue playing
      return
    } else if(this.props.head.slideIndex !== nextSlideIndex) {
      this.setState({ isPlaying: false })

      setTimeout(function(){
        // This hides the address bar:
        window.scrollTo(0, 1);
    }, 0);

      if(!this.getVideoByIndex(nextSlideIndex) && this.getAudioByIndex(nextSlideIndex)) {
        this.setState({ isPlaying: true })
      }
    }
  }

  componentDidUpdate(prevProps) {
    const { slideIndex } = this.props.head
    if(prevProps.head.slideIndex !== slideIndex) {
      this.startAudioProgressSeek()
      this.fadeInText()
      // console.log(this.imageBox.clientHeight, this.imageBox.getBoundingClientRect())
    }
  }

  getPhotoByIndex(slideIndex) {
    const { isMobile, isPortrait } = this.context
    let retPhoto = null
    if(PHOTOS[slideIndex] && PHOTOS[slideIndex].photo && PHOTOS[slideIndex].photoMobile) {
      const mobilePath = require(`../../../content/assets/${PHOTOS[slideIndex].photoMobile}`)
      const desktopPath = require(`../../../content/assets/${PHOTOS[slideIndex].photo}`)
      retPhoto = (isMobile && isPortrait) ? mobilePath : desktopPath
    }
    return retPhoto
  }

  getVideoByIndex(slideIndex) {
    const { isMobile, isPortrait } = this.context
    let retVideo = null
    if(VIDEOS[slideIndex] && VIDEOS[slideIndex].video && VIDEOS[slideIndex].videoMobile) {
      const mobilePath = require(`../../../content/assets/${VIDEOS[slideIndex].videoMobile}`)
      const desktopPath = require(`../../../content/assets/${VIDEOS[slideIndex].video}`)
      retVideo = (isMobile && isPortrait) ? mobilePath : desktopPath
    }
    return retVideo
  }

  getAudioByIndex(slideIndex) {
    if(AUDIOS[slideIndex] && AUDIOS[slideIndex].audio) {
      return require(`../../../content/assets/${AUDIOS[slideIndex].audio}`)
    }
    return null
  }

  getPreLink(slideIndex) {
    return (slideIndex <= 0) ? '/' : `/posts/${slideIndex}/`
  }

  getNextLink(slideIndex) {
    const { totalSlides } = this.context.metadata
    return (slideIndex+2 > totalSlides) ? null : `/posts/${slideIndex + 2}/`
  }

  goPreSlide(slideIndex) {
    this.context.router.replace(this.getPreLink(slideIndex))
  }

  goNextSlide(slideIndex) {
    this.context.router.replace(this.getNextLink(slideIndex))
  }

  checkIfLastSlide(slideIndex) {
    const { totalSlides } = this.context.metadata
    return slideIndex+2 > totalSlides
  }

  handleKeyPress(evt) {
    const { slideIndex } = this.props.head
    const { totalSlides } = this.context.metadata
    evt = evt || window.event;
    switch (evt.keyCode) {
      case 37:
        this.goPreSlide(slideIndex)
        break
      case 39:
        if(slideIndex+2 <= totalSlides) {
          this.goNextSlide(slideIndex)
        }
        break
    }
  }

  clearRAF() {
    raf.cancel(this._raf)
  }

  _renderSeekPercent(isAudio) {
    if (isAudio) {
      if(this.audio){
        this.setState({
          percentage: Math.floor(this.audio.seek() * 100 / this.audio.duration()),
        })
      }
      this._raf = raf(this.renderSeekPercent)
    }
  }

  render() {
    const { isMute, isPlaying, percentage } = this.state
    const { isMobile, isTablet } = this.context
    // const { head, body } = this.props
    const { head } = this.props
    const { slideIndex } = head
    const { totalSlides, siteUrl } = this.context.metadata

    const preIndex = (slideIndex-1 < 0) ? -1 : slideIndex-1
    const nextIndex = (slideIndex+1 >= totalSlides) ? -1 : slideIndex+1

    const isLastPage = this.checkIfLastSlide(slideIndex)

    const previousLink = this.getPreLink(slideIndex)
    const nextLink = this.getNextLink(slideIndex)

    const isVideo = (VIDEOS[slideIndex] && VIDEOS[slideIndex].videoMobile)
    const isAudio = (AUDIOS[slideIndex] && AUDIOS[slideIndex].audio)

    const bgPhoto = this.getPhotoByIndex(slideIndex)
    const videoSource = this.getVideoByIndex(slideIndex)
    const audioSource = this.getAudioByIndex(slideIndex)

    const prePhoto = (preIndex>=0) ? this.getPhotoByIndex(preIndex) : null
    const preVideo = (preIndex>=0) ? this.getVideoByIndex(preIndex) : null
    const preAudio = (preIndex>=0) ? this.getAudioByIndex(preIndex) : null

    const nextPhoto = (nextIndex>=0) ? this.getPhotoByIndex(nextIndex) : null
    const nextVideo = (nextIndex>=0) ? this.getVideoByIndex(nextIndex) : null
    const nextAudio = (nextIndex>=0) ? this.getAudioByIndex(nextIndex) : null

    const homeIconSrc = isMobile ? navHomeMobileIcon : navHomeIcon

    const isMapOverlay = (slideIndex === MAP_SLIDE_INDEX)

    const Video = isVideo ?
      <VideoPlayer source={videoSource} key={videoSource}
        poster={bgPhoto}
        handlePlay={ () => {
          this.setState({ isPlaying: true })
        } }
      />
      : null

    const pageDate = head.date ? new Date(head.date) : null

    const lastPageBg = isLastPage ? styles["blur"] : null
    const desClass = isLastPage ? styles["description-hide"] : null

    return (
      <Page
        { ...this.props }
        header={
          <header>
            {
            pageDate &&
            <time key={ pageDate.toISOString() }>
              { pageDate.toDateString() }
            </time>
          }
          </header>
        }
         onKeyPress={this.handleKeyPress}
      >
        <Swipeable
          onSwipedRight={()=>{this.goPreSlide(slideIndex)}}
          onSwipedLeft={()=>{this.goNextSlide(slideIndex)}}
        >
          <div className={ styles["container"] }>

            {/* Preload Image and Video */}
            <div className={ commonStyles["hide"] }>
              <img src={prePhoto} className={ styles["image"] }/>
              <img src={nextPhoto} className={ styles["image"] }/>
              <img src={this.getPhotoByIndex(slideIndex+2)} className={ styles["image"] }/>
              <video width="10" muted>
                <source src={preVideo} type="video/webm"/>
              </video>
              <audio width="10" muted>
                <source src={preAudio} type="audio/ogg"/>
              </audio>
              <video width="10" muted>
                <source src={nextVideo} type="video/webm"/>
              </video>
              <audio width="10" muted>
                <source src={nextAudio} type="audio/ogg"/>
              </audio>
              <video width="10" muted>
                <source src={this.getVideoByIndex(slideIndex+2)} type="video/webm"/>
              </video>
              <audio width="10" muted>
                <source src={this.getAudioByIndex(slideIndex+2)} type="audio/ogg"/>
              </audio>
              <span>{ TEXT[slideIndex+1] }</span>
              <span>{ TEXT[slideIndex+2] }</span>
              <span>{ TEXT[slideIndex-1] }</span>
            </div>
            {/* End - Preload Image and Video */}

            <div className={ classnames(lastPageBg, styles["bg-media"]) }>
              {/* <img src={bgPhoto}
                className={ styles["image"] }
                 ref={(ref) => this.imageBox = ref}
              />*/}
              <ReactCSSTransitionReplace transitionName="cross-fade"
                             transitionEnterTimeout={350} transitionLeaveTimeout={350}>
                <div key={bgPhoto} style={ {backgroundImage: "url(" + bgPhoto + ")"} }
                  className={ classnames(styles["bg-large-image"]) }
                  ref={(ref) => this.imageBox = ref}
                />
              </ReactCSSTransitionReplace>
              <ReactCSSTransitionReplace transitionName="fade-wait"
                             transitionEnterTimeout={350} transitionLeaveTimeout={350}>
                { Video }
              </ReactCSSTransitionReplace>
            </div>

            <div className={styles["bg-overlay-top"]}></div>
            <div className={styles["bg-overlay-bottom"]}></div>

            {
              isMapOverlay ?
                <MapOverlay isMobile={ isMobile }/> : null
            }

            <div className={styles["bottom-box"]}
              style={{ opacity: 0 }}
              ref={ (ref) => this.textBox = ref }
            >
              <div className={ classnames(commonStyles["content-outer"],
                styles["description"], desClass) }
              >
                {/*<div
                  key={`text-${slideIndex}`}
                  dangerouslySetInnerHTML={ { __html: body } }
                />*/}
                <span key={`text-${slideIndex}`} dangerouslySetInnerHTML={ { __html: TEXT[slideIndex] } }></span>
              </div>
            </div>
            <div ref={(ref) => this.preBtn = ref}>
              <Link to={previousLink} rel="prefetch" className={ styles["left-button"] }>
                <div className={ styles["button-wraper"] } >
                  <LeftNavButton isMobile={isMobile} isTablet={isTablet}/>
                </div>
              </Link>
            </div>
            <div ref={(ref) => this.nextBtn = ref}>
              {
                (slideIndex+2 > totalSlides) ? null :
                <Link to={nextLink} rel="prefetch" className={ styles["right-button"] }>
                  <div className={ styles["button-wraper"] } >
                    <RightNavButton isMobile={isMobile} isTablet={isTablet}/>
                  </div>
                </Link>
              }
            </div>
          </div>

          <Link to="/" alt="離岸之前">
            <SVGInline className={styles["home-button"]} svg={ homeIconSrc } />
          </Link>

          {
            isAudio ?
            <div className={styles["audio-button"]}
              onClick={()=>{
                this.setState({isMute: !isMute})}
              }
            >
              <CirclePlayButton isMute={isMute}
                percentage={ percentage }
              />
              <ReactHowler
                src={ audioSource }
                loop={ true }
                mute={ isMute }
                playing={ isPlaying }
                autoPlay={ isPlaying }
                ref={(ref) => this.audio = ref}
              />
            </div> : null
          }

          {
            isLastPage ?
              <LastSlide siteUrl={siteUrl}/> : null
          }

        </Swipeable>

        <Header {...this.props}/>
      </Page>
    )
  }

}


Slide.contextTypes = {
  metadata: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
  isIOS9: React.PropTypes.bool,
  isMobile: React.PropTypes.bool,
  isTablet: React.PropTypes.bool,
  isPortrait: React.PropTypes.bool,
}

Slide.propTypes = {
  head: PropTypes.object.isRequired,
}

export default Slide
