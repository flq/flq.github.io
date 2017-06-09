---
title: "eleven year old svg engine, reposted"
layout: post
tags: [loosely coupled, web]
date: 2017-06-09 09:48:01
---

<div class="container">

<div class="row">

<div class="six columns" markdown="1">

Roughly _eleven or twelve years_ ago, when I was young and seemed to have plenty of time for everything, I played with svg.
Back then, you needed a bwoser plugin to get it to run. I also thought that Flash was eating svg and svg, even though cool,
would not survive.

Fast-forward _eleven or twelve_ years: while preparing for some MS-certification I wanted to refresh my svg knowledge.
__Scalable Vector Graphics__ are now part of any modern browser. I took the old code and pretty much pasted it in here.
I only changed the access of svg elements from the global plugin object to __document__ and extracted the javascript to be
a normal part of the document. Everything else remains the same.

</div>
<div class="six columns">

<svg width="500" height="500">
	<defs>
		<linearGradient id="metallic-2" x1="0%" y1="0%" x2="100%" y2="0%"
			spreadMethod="pad" gradientUnits="objectBoundingBox">
			<stop offset="0%" style="stop-color:rgb(254,255,255);"/>
			<stop offset="13%" style="stop-color:rgb(96,96,96);"/>
			<stop offset="26%" style="stop-color:rgb(160,160,160);"/>
			<stop offset="47%" style="stop-color:rgb(225,225,225);"/>
			<stop offset="62%" style="stop-color:rgb(255,255,255);"/>
			<stop offset="80%" style="stop-color:rgb(225,225,225);"/>
			<stop offset="100%" style="stop-color:rgb(96,96,96);"/>
		</linearGradient>

		<linearGradient id="metallic-case" x1="0%" y1="0%" x2="100%" y2="0%"
			spreadMethod="pad" gradientUnits="objectBoundingBox">
			<stop offset="0%" style="stop-color:rgb(254,255,255);"/>
			<stop offset="50%" style="stop-color:rgb(96,96,96);"/>
			<stop offset="100%" style="stop-color:rgb(225,225,225);"/>
		</linearGradient>

		<radialGradient id="metallic-case2" cx="50%" cy="50%" r="50%" fx="50%" fy="50%"
			spreadMethod="pad" gradientUnits="objectBoundingBox">
			<stop offset="0%" style="stop-color:rgb(0,0,0);"/>
			<stop offset="100%" style="stop-color:rgb(255,255,255);"/>
		</radialGradient>

		<symbol id="case">
			<rect x="40" y="10" width="150" height="300"
							 style="fill:url(#metallic-case)"/>
			<ellipse cx="115" cy="290" rx="80" ry="80"
							 style="fill:url(#metallic-case2);stroke:rgb(0,0,0);stroke-width:1"/>
			<line x1="40" y1="10" x2="40" y2="260"
					 style="stroke:rgb(0,0,0);stroke-width:1"/>
			<line x1="190" y1="10" x2="190" y2="260"
					 style="stroke:rgb(0,0,0);stroke-width:1"/>
			<polygon points="40,10 45,10 55,0 40,0"
					 style="fill:rgb(120,120,120);stroke:rgb(0,0,0);stroke-width:1"/>
			<polygon points="90,0 140,0 130,10 100,10"
					 style="fill:rgb(120,120,120);stroke:rgb(0,0,0);stroke-width:1"/>
			<polygon points="190,0 190,10 185,10 175,0"
					 style="fill:rgb(120,120,120);stroke:rgb(0,0,0);stroke-width:1"/>
		</symbol>

		<symbol id="valve">
			<polygon points="10,50 50,50 60,60 0,60"
					 style="fill:url(#metallic-case);stroke:rgb(0,0,0);stroke-width:1"/>
			<rect x="25" y="0" width="10" height="50"
							 style="fill:url(#metallic-case);stroke:rgb(0,0,0);stroke-width:1"/>
		</symbol>

		<symbol id="piston">
			<rect x="0" y="0" width="150" height="100"
				 style="fill:url(#metallic-2);stroke:rgb(0,0,0);stroke-width:1"/>
			<rect x="0" y="20" width="150" height="8"
				 style="fill:rgb(160,160,176);stroke:rgb(0,0,0);stroke-width:1"/>
			<rect x="0" y="40" width="150" height="8"
				 style="fill:rgb(160,160,176);stroke:rgb(0,0,0);stroke-width:1"/>
			<ellipse cx="75" cy="80" rx="16" ry="16"
				 style="fill:rgb(255,255,255);stroke:rgb(0,0,0);stroke-width:1"/>
		</symbol>

		<!-- crankshaft: 40 long-->
		<symbol id="crankshaft">
			<rect x="10" y="30" width="30" height="40"
				 style="fill:rgb(240,132,16);stroke:rgb(0,0,0);stroke-width:1"/>
			<ellipse cx="25" cy="30" rx="15" ry="15"
				 style="fill:rgb(240,132,16);stroke:rgb(0,0,0);stroke-width:2"/>
			<ellipse cx="25" cy="70" rx="15" ry="15"
				 style="fill:rgb(240,132,16);stroke:rgb(0,0,0);stroke-width:2"/>
		</symbol>

		<!-- rod: 155 long-->
		<symbol id="connecting_rod">
			<rect x="10" y="30" width="40" height="155"
				 style="fill:rgb(149,149,149);stroke:rgb(0,0,0);stroke-width:1"/>
			<ellipse cx="30" cy="30" rx="20" ry="20"
				 style="fill:rgb(149,149,149);stroke:rgb(0,0,0);stroke-width:1"/>
			<ellipse cx="30" cy="185" rx="20" ry="20"
				 style="fill:rgb(149,149,149);stroke:rgb(0,0,0);stroke-width:1"/>
			<ellipse cx="30" cy="185" rx="10" ry="10"
				 style="fill:rgb(255,255,255);stroke:rgb(0,0,0);stroke-width:1"/>
		</symbol>
	</defs>

	<use xlink:href="#case" transform="translate(125 110)"/>
	<use id="inlet_valve" xlink:href="#valve"/>
	<use id="outlet_valve" xlink:href="#valve" transform="translate(250 60)"/>
	<use id="piston_instance" xlink:href="#piston" />
	<use id="rod_instance" xlink:href="#connecting_rod" />	
	<use id="cshaft_instance" xlink:href="#crankshaft" />
</svg>

<script>
  let currframe = 0;
  const rodlength = 155;
  const shaftradius = 40;
  setInterval (nextFrame, 40);

  function nextFrame() {
    // Full rotation every 2 seconds -> 360 degrees / 50 frames = 7.2 degrees
    currcrankshaftangle = currframe * 7.2;
    
    // *** CRANKSHAFT ANIMATION ***
    crankshaft = document.getElementById("cshaft_instance");
    crankshaft.setAttribute("transform",`translate(215 340) rotate(${currcrankshaftangle} 25 70)`);

    // *** Connecting Rod ANIMATION ***
    rod = document.getElementById("rod_instance");
    rod.setAttribute("transform", 
    `translate(210 ${getYDisplacement(currcrankshaftangle, 185)}) rotate(${getRodAngle(currcrankshaftangle)} 30 30)`);
    
    // *** PISTON ANIMATION ***
    piston = document.getElementById("piston_instance");
    piston.setAttribute("transform", `translate(165 ${getYDisplacement(currcrankshaftangle, 135)})`);

    // *** VALVE ANIMATION ***
    in_valve = document.getElementById("inlet_valve");
    if (currframe >= 0 && currframe <= 5) {
        // open inlet
        in_valve.setAttribute("transform", `translate(170 ${60 + currframe*4})`);
    }
    else if (currframe >=25 && currframe <= 30) {
        // inlet closing
        in_valve.setAttribute("transform", `translate(170 ${80 - (currframe - 25) * 4})`);
    }

    out_valve = document.getElementById("outlet_valve");
    if (currframe >= 75 && currframe <= 80) {
        // open outlet
        out_valve.setAttribute("transform", `translate(250 ${60 + (currframe - 75) * 4})`);
    }
    else if (currframe >=94 && currframe <= 99) {
        // outlet closing
        out_valve.setAttribute("transform", `translate(250 ${80 - (currframe - 94) * 4})`);
    }

    currframe++;
    if (currframe == 100) currframe = 0;
  }

  /*** Trigonometry Functions ***/
  //
  // Gets the angle of the connecting rod in relation to the position of the crankshaft.
  //
  function getRodAngle(shaftangle) {
    shaftangle_rad = (Math.PI / 180) * shaftangle;
    with (Math) {
        anglerod_rad = asin(sin(shaftangle_rad) * (shaftradius / rodlength));
    }
    return -1 * anglerod_rad * (180 / Math.PI);
  }

  // Gets the Vertical displacement related to the rotation of the crankshaft
  //
  function getYDisplacement(shaftangle, offset) {
    shaftangle_rad = (Math.PI / 180) * shaftangle;
    with (Math) {
        ydisp = cos(shaftangle_rad) * shaftradius;
    }
    return offset + Math.floor(shaftradius - ydisp);
  }
</script>

</div>
</div>

<div class="row">

<div class="twelve columns">

These days I wouldn't write the animation code as it is (strong coupling of engine logic and state with UI), but it is very charming and comforting that svg is alive and kicking and that 10++-year old code continues to work as intended.

</div>
</div>
</div>