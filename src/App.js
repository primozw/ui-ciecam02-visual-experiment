import React, { Component } from 'react';
import './App.css';

/* Custom Components */
import Footer from './component/Footer';
import TextModeContent from './component/TextModeContent';
import IconModeContent from './component/IconModeContent';
import GuiModeContent from './component/GuiModeContent';


/* Material design React */
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';


/* Import CIECAM modules */
import workspace from "./utilities/workspace"
import illuminant from "./utilities/illuminant"
import XYZ from "./utilities/xyz"
import * as rgb from "./utilities/rgb"
import CIECAM02m2 from "./utilities/cam-m2"
import {xyz2lab, lab2xyz} from "./utilities/cielab";
import utility from './utilities/utility.js';

/* Import color data */
import colors from './api/color-data.js';

require('webfontloader');
const axios = require('axios');
const _ = require('lodash');

class App extends Component {
  constructor(props) {

    super(props);
    var that = this;
    this.colors = _.shuffle(colors);
    this.counter = 0;

    this.userData = [];
    this.userID = utility.getQueryVariable('id') ? utility.getQueryVariable('id') : null;
    this.btnDelay = utility.getQueryVariable('btnDelay') ? utility.getQueryVariable('btnDelay') : 3000;
    this.contentDelay = utility.getQueryVariable('contentDelay') ? utility.getQueryVariable('contentDelay') : 1000;

    this.state = {
      intro: true,
      introCounter: utility.getQueryVariable('introDuration') ? utility.getQueryVariable('introDuration') : 120,
      contentVisible: true,
      buttonsVisible: true,
      inductionSize: utility.getQueryVariable('size') ? utility.getQueryVariable('size') : '315px',
      mode: utility.getQueryVariable('mode') ? utility.getQueryVariable('mode') : 'icons',
      splitHorizontal: utility.getQueryVariable('split') ? utility.getQueryVariable('split') : false,
      colorAdjustment: this.colors[0].adjust,
      dialogs: {
        settings: false,
        export: false,
      },
      tab: 0,
      menu: false,
      colors: {
        initBackground: this.colors[0].background1,
        targetBackground: this.colors[0].background2,
        initForeground: this.colors[0].color,
        newForeground: false
      },
      colorData: null,
      options: {
        textMode: {
          text: utility.getQueryVariable('text') ? utility.getQueryVariable('text') : 'The quick brown fox jumps over the lazy dog.',
          fontSize: utility.getQueryVariable('textSize') ? utility.getQueryVariable('textSize') : 35,
          bold: utility.getQueryVariable('textBold') ? utility.getQueryVariable('textBold') : false,
          italic: false,
          underlined: false,
          fontFamily: utility.getQueryVariable('font') ? utility.getQueryVariable('font') : 'Roboto'
        },
        iconMode: {
          iconSize: utility.getQueryVariable('iconSize') ? utility.getQueryVariable('iconSize') : 130,
          icon: utility.getQueryVariable('icon') ? utility.getQueryVariable('icon') : 'folder',
        },
        guiMode: {

        }
      },
      conditions: {
        workspace: 'sRGB',
        adaptingLuminance: 80,
        surroundType: 'dim',
        background: 'init', // init | target | average
        pHue: -0.05,
        pLightness: -0.4,
        whitePoint: illuminant.D65,
        discounting: false
      },
      fontList: false,
      palette: [],
      selectedScheme: null,
      noticeBar: {
        status: false,
        text: ''
      },
      finished: false,
      msg: null
    };

    
    /* COLOR TRANSFORMATION PROPERTIES */
    this.cond = {
      workspace: 'sRGB',
      whitePoint: illuminant.D65,
      adaptingLuminance: 300,
      surroundType: "dim",
      discounting: false
    }

    /* STYLES AND CLASSES */
    this.styles = {
      menuButton: {
        marginLeft: -12,
        marginRight: 20,
      },

      switch: {
        checked: {
          color: "#1f1f1f"
        }
      }
    };

    this.classes = {
      menu: {
        modal: 'menu',
        paper: 'menu__paper'
      },
      tabs: {
        flexContainer: 'tabs',
      },
      tab: {
        labelContainer: 'labelContainer',
        root: 'tab'
      }
    }

    // Bind function to this class
    this.changeColors = this.changeColors.bind(this);
    this.closeNoticeBar = this.closeNoticeBar.bind(this);


    //Get Google Fonts JSON file
    axios.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBeeXqefLKfQf7r9Hfcn3uxC65iOS0kLPU')
    .then((response) => that.fontList = response.data.items)
    .catch((error) => console.log(error));
  }

  componentDidMount(){
    // Set intro counter
    this.introTimer = setInterval(()=>{
      if (this.state.introCounter > 0 ) {
        this.setState((prevState, props) => ({
          introCounter: prevState.introCounter - 1
        }));
      } else {
        clearInterval(this.introTimer);
        this.setState({intro: false});
        this.setTimer();
      }
      
    }, 1000);

    // Set first color
    var [adjColors, conditions, colorData]  = this.adjustColor({
      colors: this.state.colors, 
      conditions: this.state.conditions,
    });
    this.setState({
      colors: adjColors,
      colorData: colorData,
    });
    console.log( this.colors[this.counter].name );
    console.log( this.colors[this.counter].adjust )

  }

  // Send data to the server
  sendData(){
   const that = this;
   var msg;
    axios.post(process.env.PUBLIC_URL + '/php/', {
      userData: this.userData,
      userID: this.userID,
      conditions: this.state.conditions
    })
    .then(function (response) {
      console.log(response);
      if (response.status === 200 && response.data === 'OK') {
         msg = 'Hvala za sodelovanje!';
      } else {
        msg = 'Ups! Nekaj je šlo narobe ...';
      }
      //Set progress circle
      that.setState({
        msg: msg, 
        finished: true
      });

    });
  }

  getTime(){
    return Date.now() - this.timer;
  }

  setTimer(){
    this.timer = Date.now();
  }




  changeColors(value){

    // Write user data
    this.userData.push({
      time: this.getTime()/1000,
      color1: this.state.colors.initForeground,
      color2: this.state.colors.newForeground,
      background1: this.state.colors.initBackground,
      background2: this.state.colors.targetBackground,
      adjust: (this.state.colorAdjustment) ? 1 : 0,
      id: this.colors[this.counter].id,
      agreement: value,
      ...this.state.colorData
    });

    console.log(this.userData);

    // Increase counter
    this.counter++

    // Change color or finished test
    if (this.counter < this.colors.length){
      var [adjColors, conditions, colorData]  = this.adjustColor({
        colors: {
          initBackground: this.colors[this.counter].background1,
          targetBackground: this.colors[this.counter].background2,
          initForeground: this.colors[this.counter].color,
        }, 
        conditions: this.state.conditions,
      });
      this.setState({
        colors: adjColors,
        colorAdjustment: this.colors[this.counter].adjust,
        colorData: colorData,
      });

      console.log( this.colors[this.counter].name );
      console.log( this.colors[this.counter].adjust )

      setTimeout(()=>{
        this.setState({
          contentVisible: true,
        });
        this.setTimer();
      }, this.contentDelay);
      setTimeout(()=>{
        this.setState({
          buttonsVisible: true,
        });
      }, this.btnDelay);

    } else {
      this.sendData();
    }
  }


  crop (v) {
    return Math.max(0, Math.min(1, v));
  }



  adjustColor = ({colors, conditions}) => {
    var xyz = XYZ(workspace[conditions.workspace], conditions.whitePoint);

    var xyzInitBg = xyz.fromRgb(rgb.fromHex(colors.initBackground)),
        xyzInitFg = xyz.fromRgb(rgb.fromHex(colors.initForeground)),
        xyzTargetBg = xyz.fromRgb(rgb.fromHex(colors.targetBackground)),
        background;

    //Define background condition
    if (conditions.background === 'init'){
      background = xyzInitBg;
    } else if (conditions.background === 'target') {
      background = xyzTargetBg;
    } else {
      const labInit = xyz2lab(xyzInitBg, conditions.whitePoint);
      const labTarget = xyz2lab(xyzTargetBg, conditions.whitePoint);
      background = lab2xyz([
        (labInit[0] + labTarget[0]) / 2,
        (labInit[1] + labTarget[1]) / 2,
        (labInit[2] + labTarget[2]) / 2,
      ], conditions.whitePoint);
    }

    var forwardCam = CIECAM02m2({
      whitePoint: conditions.whitePoint,
      adaptingLuminance: conditions.adaptingLuminance,
      background: xyzInitBg,
      proximalField: xyzInitBg,
      surroundType: conditions.surroundType,
      discounting: conditions.discounting
    }, {
      lightness: conditions.pLightness,
      hue: conditions.pHue
    });

    var inverseCam = CIECAM02m2({
      whitePoint: conditions.whitePoint,
      adaptingLuminance: conditions.adaptingLuminance,
      background: background,
      proximalField: xyzTargetBg,
      surroundType: conditions.surroundType,
      discounting: conditions.discounting
    },{
      lightness: conditions.pLightness,
      hue: conditions.pHue
    });

    var JCH = forwardCam.fromXyz(xyzInitFg),
        xyzTarget = inverseCam.toXyz(JCH),
        rgbFg = xyz.toRgb(xyzTarget);

    colors.newForeground = rgb.toHex(rgbFg.map(this.crop));

    var colorData = {
      background1XYZ: xyzInitBg,
      proximal1XYZ: xyzInitBg,
      background2XYZ: background,
      proximal2XYZ: xyzTargetBg,
      JCH: JCH,
      xyz1: xyzInitFg,
      xyz2: xyzTarget,
      rgb2: rgbFg
    }

    return [colors, conditions, colorData];
      
  }


  renderMainContent(foregroundColorType, backgroundColorType){
    if (this.state.mode === 'text'){
      return (
       <TextModeContent type={foregroundColorType} colors={this.state.colors} options={this.state.options.textMode}/>
      );
    } else if (this.state.mode === 'gui'){
      return (
        <GuiModeContent type={foregroundColorType} bg={backgroundColorType} colors={this.state.colors} options={this.state.options.guiMode}/>
      );
    } else {
      return (
        <IconModeContent type={foregroundColorType} colors={this.state.colors} options={this.state.options.iconMode} />
      )
    }
  }

  displayMainContent(){
    setTimeout(()=>{
      return (
        <div className="container" style={{flexDirection: (this.state.splitHorizontal) ? 'column' : 'row'}}>
          <div className="initContent">
            {this.renderMainContent('initForeground', 'initBackground')}
          </div>
          <div className="targetContent">
            <div className="targetWrapper" style={{
              backgroundColor: this.state.colors.targetBackground,
              width: '800px',
              height: '800px'
            }}>
              {this.renderMainContent((this.state.colorAdjustment) ? 'newForeground' : 'initForeground', 'targetBackground')}
            </div>
          </div>
        </div>
      )
    }, 1000);
  }

  openNoticeBar(text){
    this.setState({
      noticeBar: {
        status: true,
        text: text
      }
    })
  }

  closeNoticeBar(){
    this.setState({ noticeBar: { status: false} })
  }


  render() {
    return (
      <div>
        {(this.state.intro) ?
        (<div className="App">
          <main className="main-content notice" style={{backgroundColor: this.state.colors.initBackground}}>
            
            <div className="colorBlind">
              <img src={process.env.PUBLIC_URL + '/test_blind/deuteranopia_3.png'} />
              <img src={process.env.PUBLIC_URL + '/test_blind/deuteranopia_2.png'} />
              <img src={process.env.PUBLIC_URL + '/test_blind/contrast.png'} />
              <img src={process.env.PUBLIC_URL + '/test_blind/tritanopia_1.png'} />
              <img src={process.env.PUBLIC_URL + '/test_blind/tritanopia_2.png'} />
              <img src={process.env.PUBLIC_URL + '/test_blind/protanopia_1.png'} />
            </div>

            <h1>{this.state.introCounter}</h1>
          </main>
        </div>
        ) :
        ((!this.state.finished) ?
        (<div className="App">
          <main className="main-content" style={{backgroundColor: this.state.colors.initBackground}}>
            <div className="container" style={{
              flexDirection: (this.state.splitHorizontal) ? 'column' : 'row',
              opacity: (this.state.contentVisible) ? 1 : 0,
            }}>
              <div className="initContent">
                <div className="contentWrapper" style={{
                  width: this.state.inductionSize,
                  height: this.state.inductionSize
                }}>
                  {this.renderMainContent('initForeground', 'initBackground')}
                </div>
              </div>
              <div className="targetContent">
                <div className="contentWrapper" style={{
                  backgroundColor: this.state.colors.targetBackground,
                  width: this.state.inductionSize,
                  height: this.state.inductionSize
                }}>
                  {this.renderMainContent((this.state.colorAdjustment) ? 'newForeground' : 'initForeground', 'targetBackground')}
                </div>
              </div>
            </div>
          </main>
          <footer className="footer" style={{backgroundColor: this.state.colors.initBackground}}>
            <Footer onClick={(value)=>{
              this.setState({contentVisible: false, buttonsVisible: false});
              this.changeColors(value);
            }} visible={this.state.buttonsVisible}/>
          </footer>
        </div>) : (
          <div className="App">
            <main className="main-content notice" style={{backgroundColor: this.state.colors.initBackground}}>
              <h1>{this.state.msg}</h1>
            </main>
          </div>
        ))}
      </div>
    );
  }
}

//export default App;
export default compose(withWidth())(App);
