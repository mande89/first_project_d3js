const screenHeight = $(window).height();
const screenWidth = $(window).width();
const singleWidth = screenWidth / 5;
const singleHeight = screenHeight / 2;
const maxSize = parseInt(screenHeight / 8);
const svg = d3.select('body').append("svg").attr("width", screenWidth).attr("height", screenHeight);
const curveFunc = d3.line().curve(d3.curveCardinal).x(function(d){return d.x}).y(function(d){return d.y});
const headCurvFunc = d3.line().curve(d3.curveCardinal).x(function(d){return d.x}).y(function(d){return d.y});
const colors = [
	'#D2B9D3',
	'#C6AEC7',
	'#EBDDE2',
	'#C8BBBE',
	'#E9CFEC',
	'#FCDFFF',
	'#FDEEF4',
	'#E3E4FA',	
	'#C6DEFF',
	'#ADDFFF'
];

var dims = [];
var ds;
var range = [];

for(let i = 0; i < 10; i++){
	let objToInsert = {
		minX: parseInt((i % 5) * singleWidth),
		minY: (parseInt(Math.floor(i / 5) * singleHeight)) + 10,
		maxX: parseInt((((i % 5) * singleWidth) + singleWidth) - maxSize * 3),
		maxY: parseInt(((Math.floor(i / 5) * singleHeight) + singleHeight) - maxSize * 3)   
	};
	dims.push(objToInsert);
}

var init = function(){
	d3.json("/data/dataset.json").then((data) => {
		console.log('entrato');
		console.log(data);
		for(let i = 0; i < data.length; i++){
			x = data[i];
			let valuesP = [];
			for(let prop in x){
				if(Object.prototype.hasOwnProperty.call(x, prop)){
					valuesP.push(x[prop]);
				}
			}
			let objToInsert = {
				min: d3.min(valuesP),
				max: d3.max(valuesP)
			};
			range.push(objToInsert);
			drawButterfly(x, i, objToInsert);
		};
	}, (err) => {
		console.log('errore ' + e.toString());
	});
}


var createSingleButterfly = function(dataButterfly, i, domain){

	var scaleX = d3.scaleLinear().domain([domain.min, domain.max]).range([dims[i].minX, dims[i].maxX]);
	var scaleY = d3.scaleLinear().domain([domain.min, domain.max]).range([dims[i].minY, dims[i].maxY]);
	var scaleSize = d3.scaleLinear().domain([domain.min, domain.max]).range([15, maxSize]);

	let x = scaleX(parseInt(dataButterfly.coordx));
	let y = scaleY(parseInt(dataButterfly.coordy));

	let wings = scaleSize(dataButterfly.wingsSize);
	let head = scaleSize(dataButterfly.headSize);
	let abdomenSize = scaleSize(dataButterfly.abdomenSize);

	let middleBodyX = (x + wings + (abdomenSize/2));
	let middleBodyY = (y + head + (abdomenSize));

	let yStartingBody = y + head;
	let yEndingBody = yStartingBody + (abdomenSize * 2);
	let middleYBody = yStartingBody + ((yEndingBody - yStartingBody)/2);

	let cx = middleBodyX;
	let cy = y + parseInt(head/2);
	let r = parseInt(head/2);
	let headPoints = [{x: middleBodyX, y: y + head}, {x: cx - (r * Math.cos(((1/4)*(Math.PI)))), y: cy + (r * Math.sin(((1/4)*(Math.PI))))}, {x: middleBodyX - (head/2), y: y + (head/2)}, {x: cx - (r * Math.cos((1/4*(Math.PI)))), y: cy - (r * Math.sin((1/4*(Math.PI))))}, {x: middleBodyX, y: y}, {x: cx + (r * Math.cos((1/4*(Math.PI)))), y: cy - (r * Math.sin((1/4*(Math.PI))))}, {x: middleBodyX + (head/2),  y: y + (head/2)}, {x: cx + (r * Math.cos((1/4*(Math.PI)))), y: cy + (r * Math.sin((1/4*(Math.PI))))}, {x: middleBodyX, y: y + head}/*, {x: cx + (r * Math.cos((1/4*(Math.PI)))), y: cy + (r * Math.sin((1/4*(Math.PI))))}*/];

	let bodyPoints = [{x: middleBodyX, y: yStartingBody}, {x: middleBodyX - (abdomenSize/4), y: yStartingBody + (abdomenSize/4)}, {x: middleBodyX - (abdomenSize/3), y: middleYBody}, {x: middleBodyX - (abdomenSize/4), y: yEndingBody - (abdomenSize/4)}, {x: middleBodyX, y: yEndingBody}, {x: middleBodyX + (abdomenSize/4), y: yEndingBody - (abdomenSize/4)}, {x: middleBodyX + (abdomenSize/3), y: middleYBody}, {x: middleBodyX + (abdomenSize/4), y: yStartingBody + (abdomenSize/4)}, {x: middleBodyX, y: yStartingBody}];
	
	//coords per attaccarsi al corpo SX
	let startingCoordXL = middleBodyX - (abdomenSize/4);
	let startingCoordYL = yStartingBody + (abdomenSize/4);
	let endingCoordYL = yEndingBody - (abdomenSize/4);

 	var wingsLeftPoints = [{x: startingCoordXL, y: startingCoordYL}, {x: (startingCoordXL - (wings *(2/3))), y: yStartingBody}, {x: startingCoordXL - wings, y: (yStartingBody + (wings/10))}, {x: startingCoordXL - (wings * (2/3)), y: middleBodyY}, {x: startingCoordXL - wings, y: (yEndingBody - (wings/10))}, {x: (startingCoordXL - (wings *(2/3))), y: yEndingBody}, {x: startingCoordXL, y: endingCoordYL}];
	
 	//coords per attaccarsi al corpo DX
	let startingCoordXR = middleBodyX + (abdomenSize/4);
	let startingCoordYR = yStartingBody + (abdomenSize/4);
	let endingCoordYR = yEndingBody - (abdomenSize/4);

	let wingsRightPoints = [{x: startingCoordXR, y: startingCoordYR}, {x: (startingCoordXR + parseInt(wings *(2/3))), y: yStartingBody}, {x: startingCoordXR + wings, y: (yStartingBody + (wings/10))}, {x: startingCoordXR + parseInt(wings * (2/3)), y: middleBodyY}, {x: startingCoordXR + wings, y: (yEndingBody - (wings/10))}, {x: (startingCoordXR + parseInt(wings *(2/3))), y: yEndingBody}, {x: startingCoordXR, y: yEndingBody - (abdomenSize/4)}];

	return {
		head: headPoints,
		body: bodyPoints,
		wingL: wingsLeftPoints,
		wingR: wingsRightPoints
	}

}


var drawButterfly = function(dataButterfly, i, range){

	let obj = createSingleButterfly(dataButterfly, i, range);

	let b1 = svg.append('g').attr("class", "b" + i);

	b1.append('path').attr("class", "wingL").attr('d', curveFunc(obj.wingL)).attr('stroke', colors[i]).attr('fill', colors[i]);
	b1.append('path').attr("class", "wingR").attr('d', curveFunc(obj.wingR)).attr('stroke', colors[i]).attr('fill', colors[i]);
	b1.append('path').attr("class", "body").attr('d', curveFunc(obj.body)).attr('stroke', colors[i]).attr('fill', colors[i]);
	b1.append('path').attr("class", "head").attr('d', headCurvFunc(obj.head)).attr('stroke', colors[i]).attr('fill', colors[i]);
	
	b1.on('click', () => {
		console.log('update');
		let newValues = shift(dataButterfly);
		updateDraw(newValues, b1, i, range);
	});
}

var updateDraw = function(newData, pointer, i, range){
	let newValues = createSingleButterfly(newData, i, range);

	pointer.select('.wingR').transition().duration(900).attr('d', curveFunc(newValues.wingR)).attr('stroke', colors[i]).attr('fill', colors[i]);
	pointer.select('.wingL').transition().duration(900).attr('d', curveFunc(newValues.wingL)).attr('stroke', colors[i]).attr('fill', colors[i]);
	pointer.select('.body').transition().duration(900).attr('d', curveFunc(newValues.body)).attr('stroke', colors[i]).attr('fill', colors[i]);
	pointer.select('.head').transition().duration(900).attr('d', curveFunc(newValues.head)).attr('stroke', colors[i]).attr('fill', colors[i]);
	
	pointer.on('click', () => {
		console.log('update');
		let nV = shift(newData);
		console.log(nV);
		updateDraw(nV, pointer, i, range);
	});
}

var shift = function(obj){
	let newObj = {
		coordx: obj.coordy,
		coordy: obj.wingsSize,
		wingsSize: obj.headSize,
		headSize: obj.abdomenSize,
		abdomenSize: obj.coordx
	};
	return newObj;
}

init();