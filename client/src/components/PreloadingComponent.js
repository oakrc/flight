import React from "react";
import '../css/preloadanim.css';

function PreloadingComponent(props) {
  return (
    <svg style={{zIndex: props.zIndex ? 0 : 10000}}className="container" id="logo" width="567" height="125" xmlns="http://www.w3.org/2000/svg" xmlnssvg="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
         <symbol width="371.38876mm" height="75.847298mm" viewBox="0 0 371.38877 75.847298" id="svg_37" xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" xmlnssvg="http://www.w3.org/2000/svg">
       
          <metadata id="svg_12">image/svg+xml</metadata>
          <g id="svg_2" transform="translate(-89.054116,-13.932593)">
           <rect id="svg_11" width="1057.1428" height="382.85715" x="485.71429" y="886.90668"/>
           <rect id="svg_10" width="805.71429" height="308.57144" x="445.71429" y="875.47809"/>
           <rect id="svg_9" width="1797.1427" height="734.28564" x="165.71428" y="889.76379"/>
           <path className="planeSymbol" fill="#000000" stroke="#000000" strokeWidth="1.9" strokeMiterlimit="4" d="m91.79103,38.35538c1.45929,-0.02534 4.20074,1.65674 6.0921,3.73796c2.62175,2.88496 5.82456,3.74261 13.47968,3.60961c5.52245,-0.09595 10.03705,-0.55055 10.03243,-1.01013c-0.005,-0.45963 -0.79972,-2.895 -1.76683,-5.41198c-0.96712,-2.51695 -3.10082,-9.02261 -4.74155,-14.457c-2.83532,-9.39107 -2.8113,-9.8837 0.48468,-9.94097c2.2873,-0.03972 6.76857,5.11643 13.16393,15.14653l9.69611,15.20675l11.08073,-0.19252c7.55781,-0.1313 11.83348,0.71097 13.44836,2.64921c4.31456,5.17853 -0.90112,8.66422 -13.28635,8.8794l-11.03488,0.19171l-6.93248,11.87805c-9.75268,16.71008 -12.25372,19.7327 -15.72181,19.00051c-2.70778,-0.57167 -2.56151,-2.24208 1.32513,-15.13279c2.40288,-7.96959 4.37803,-14.70654 4.38921,-14.97098c0.0111,-0.26446 -4.49807,-0.40233 -10.02055,-0.30639c-7.65509,0.133 -10.83952,1.10162 -13.40225,4.07664c-4.72535,5.48561 -9.08707,5.27196 -7.24097,-0.35467c0.78483,-2.39197 1.40517,-6.51082 1.37855,-9.15299c-0.02657,-2.64214 -0.7297,-6.73799 -1.56245,-9.10187c-1.10409,-3.13429 -0.79563,-4.31046 1.13921,-4.34408z" id="svg_8"/>
           <rect id="svg_7" width="1331.4286" height="734.28571" x="105.71429" y="644.0495"/>
           <text fontStyle="normal" fontWeight="normal" fontSize="79.18143px" fontFamily="sans-serif" fill="none" stroke="#000000" strokeMiterlimit="4" xmlSpace="preserve" x="89.89095" y="74.23542" id="svg_4">
            <tspan fill="none" stroke="#000000" strokeMiterlimit="4" x="89.89095" y="74.23542" id="svg_5">
             <tspan className="text" fontStyle="normal" fontWeight="normal" fontSize="70px" fontFamily="Kollektif" textAnchor="start" fill="none" stroke="#000000" strokeMiterlimit="4" x="89.89095" y="74.23542" id="svg_6">WestFlight</tspan>
            </tspan>
           </text>
           <rect id="svg_3" width="294.28571" height="154.28572" x="342.85715" y="729.76379"/>
          </g>
         </symbol>
        </defs>
        <g>
         <use x="0" y="0" transform="matrix(0.4308153986930847,0,0,0.4308153986930847,0,0) " xlinkHref="#svg_37" id="svg_38"/>
         <g id="svg_39"/>
        </g>
    </svg>
  )
}

export default PreloadingComponent