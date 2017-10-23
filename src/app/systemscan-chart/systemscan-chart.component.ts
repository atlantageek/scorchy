import { Component, OnInit, Input, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import * as D3 from 'd3/index'

@Component({
  selector: 'app-systemscan-chart',
  template: 'Unable To Generate Systemscan Chart',
})

export class SystemscanChartComponent implements OnInit {
  private htmlElement: HTMLElement;
  private host;
  private svgroot;
  private margin: { left: number, right: number, top: number, bottom: number };
  private width: number
  private height: number;
  private svg;
  private xScale;
  private yScale;
  private xAxis;
  private yAxis;
  private hasSetup = false;
  private xbuffer = 0;
  @Input() maxLevel = 0;
  @Input() minLevel = -50;
  @Input('height') initial_height=400;
  @Input('width') initial_width = 600;

  @Input() title='Works?';
  totalData = [];
  @Input() data=[];
  changedNumbers=[];

  constructor(private element: ElementRef) {

    this.htmlElement = this.element.nativeElement;

    this.host = D3.select(this.element.nativeElement);

  }

  //@ViewChild('d3vis') d3vis;

  ngOnInit() {

  }

  ngAfterViewInit(): void {

    this.initial_width = this.htmlElement.parentElement.clientWidth;
    this.setupGraph();
  }

  ngOnChanges() {


    if (!this.data)return ;


    this.mergeData();
    if (this.hasSetup) {
      this.resetXaxis();
      this.drawXAxis();
      this.drawData();
      this.drawMarkers();


    }
  }

  mergeData() {
    this.changedNumbers = [];
    for (let newrec of this.data) {
      let replaceIndex = this.totalData.findIndex((rec,index,arr) => {
        return newrec.number == rec.number;
      })
      if (replaceIndex == -1) {
        this.totalData.push(newrec);
      }
      else {
        this.changedNumbers.push(newrec.number);
        this.totalData[replaceIndex] = newrec;
      }
    }
  }

  setupGraph():void {
    this.setup();
    this.buildSVG();
    this.drawTitle();
    this.drawXAxis();
    this.drawYAxis();

    this.hasSetup = true;
  }


  setup() {
    this.margin = { top: 25, right: 45, bottom: 50, left: 60 };
    this.width = this.initial_width - this.margin.left - this.margin.right;
    //this.width = this.width — this.margin.left — this.margin.right;
    this.height = this.initial_height;
    this.xScale = D3.scaleLinear().domain([0, this.totalData.length  ]).range([0, this.width]).clamp(false);
    this.yScale = D3.scaleLinear().domain([this.maxLevel, this.minLevel]).range([0, this.height]).clamp(true);

  }

  private buildSVG(): void {
    this.host.html('');
    if (this.svgroot) {
      this.svgroot.selectAll('*').remove();
    }

    this.svgroot = this.host.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.svgroot.append('g').append("rect").attr("x",this.margin.left).attr("y",this.margin.top).attr("width",this.width )
      .attr("height", this.height)
      .attr("fill-opacity", 0.0)
      .attr("style","stroke-width:1;stroke:rgb(0,0,0);");
    this.svg = this.svgroot.append('g')
       .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')


    this.svg.append("clipPath").attr("id", "clipped_region").append("rect")
       .attr("x", 0).attr("y", 0).attr("width", this.width).attr("height", this.height);
    //this.svg.append("rec").attr("x", 0).attr("y", 0).attr("width", this.width).attr("height", this.height);

    this.svgroot.on("mousedown", this.clicked);

  }
  private drawTitle() {
    this.svg.append("text").attr("text-anchor", "middle").attr("transform","translate(" + this.width/2+", -10)").text(this.title)
  }

  private drawYAxis(): void {
    var f= (data) => { return data.toString()};
    let axisWidth = -5;
    this.yAxis = D3.axisLeft(this.yScale).tickPadding(10).tickSize(axisWidth).tickFormat(f);
    this.svg.append('g')
      .attr('class', 'yaxis')
      .attr('style','stroke-opacity:0.1; stroke: white;')
      .call(this.yAxis)
    this.svg.append("text").attr('fill',"white").attr('font-size',"10").attr("text-anchor", "middle").attr("transform","translate(-35," + this.height/2+")rotate(-90)").text("dBmV")
  }

  private resetXaxis() {
    this.xScale = D3.scaleLinear().domain([0, this.totalData.length  ]).range([0, this.width]).clamp(false);

  }
  private drawXAxis(): void {
    this.svg.select('.xaxis').remove();
    var f= (data) => { return data.toString()};
    let axisHeight = -5;
    this.xAxis = D3.axisBottom(this.xScale).tickPadding(10).tickSize(axisHeight).tickFormat(f);
    this.svg.append('g')
      .attr('class', 'xaxis')
      .attr('style','stroke-opacity:0.1; stroke: white;')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis)
    this.svg.append("text").attr('fill',"white").attr('font-size',"10").attr("text-anchor", "middle").attr("transform","translate(" + this.width/2+"," + (this.height + 35)  + ")").text("MHz")
  }
  private drawMarkers():void {
    if (this.svg.selectAll(".marker").empty()) {
      this.svg.append("rect").attr("id","marker1").attr("class","marker").attr("x", "100").attr("y",0).attr("height",this.height).attr("width",5);
    }

  }
  private drawData(): void {
    let audioData=[];
    let videoData = [];
    let digitalData=[];
    for (let i=0;i<this.totalData.length;i++) {
      this.totalData[i]['idx'] = i;
      if (this.totalData[i].digital) {
        digitalData.push(this.totalData[i]);
      }
      else {
        videoData.push(this.totalData[i]);
        audioData.push(this.totalData[i]);
      }
    }
    let digitalbound = this.svg.selectAll(".digitalbar").data(digitalData, d => {return d.number});
    let audiobound = this.svg.selectAll(".audiobar").data(audioData, d => {return d.number});
    let videobound = this.svg.selectAll(".videobar").data(videoData, d => {return d.number});
    digitalbound.enter().append("rect").filter((d) => {return d.digital}).attr("class","digitalbar")
    .attr("x",(d,i) => {return this.xScale(d.idx)})
    .attr("y",(d,i) => {return this.yScale(this.minLevel)})
    .attr("width",(d,i) => {return this.xScale(1)/2})
    .attr("height",0).transition().duration(600)
    .attr("y",(d,i) => {return this.yScale(d.level)})
    .attr("height",(d,i) => {return - this.yScale(d.level) + this.yScale(this.minLevel)})
    .attr('fill',"green");

    videobound.enter().append("rect").filter((d) => {return !d.digital}).attr("class","videobar")
    .attr("x",(d,i) => {return this.xScale(d.idx) })
    .attr("y",(d,i) => {return this.yScale(this.minLevel)})
    .attr("width",(d,i) => {return this.xScale(1)/4})
    .attr("height",0).transition().duration(600)
    .attr("y",(d,i) => {return this.yScale(d.videoLevel)})
    .attr("height",(d,i) => {return - this.yScale(d.videoLevel) + this.yScale(this.minLevel)})
    .attr('fill',"blue");
    audiobound.enter().append("rect").filter((d) => {return !d.digital}).attr("class","audiobar")
    .attr("x",(d,i) => {return this.xScale(d.idx) + this.xScale(1)/4})
    .attr("y",(d,i) => {return this.yScale(this.minLevel)})
    .attr("width",(d,i) => {return this.xScale(1)/4})
    .attr("height",0).transition().duration(600)
    .attr("y",(d,i) => {return this.yScale(d.audioLevel)})
    .attr("height",(d,i) => {return - this.yScale(d.audioLevel) + this.yScale(this.minLevel)})
    .attr('fill',"yellow");


    digitalbound.filter((d) => {let result = this.changedNumbers.findIndex((dd) => {return d.number == dd}) > -1 ;return result;}).attr('fill','black');
    audiobound.filter((d) => {let result = this.changedNumbers.findIndex((dd) => {return d.number == dd}) > -1 ;return result;}).attr('fill','black');
    videobound.filter((d) => {let result = this.changedNumbers.findIndex((dd) => {return d.number == dd}) > -1 ;return result;}).attr('fill','black');
    digitalbound.transition().duration(600)
    .attr("x",(d,i) => {return this.xScale(d.idx) })
    .attr("y",(d,i) => {return this.yScale(d.level)})
    .attr("width",(d,i) => {return this.xScale(1)/2})
    .attr("height",(d,i) => {return - this.yScale(d.level) + this.yScale(this.minLevel)}).attr('fill',"green");

    videobound.transition().duration(600)
    .attr("x",(d,i) => {return this.xScale(d.idx)})
    .attr("y",(d,i) => {return this.yScale(d.videoLevel)})
    .attr("width",(d,i) => {return this.xScale(1)/4})
    .attr("height",(d,i) => {return - this.yScale(d.videoLevel) + this.yScale(this.minLevel)}).attr('fill',"blue");
    audiobound.transition().duration(600)
    .attr("x",(d,i) => {return this.xScale(d.idx) + this.xScale(1)/4})
    .attr("y",(d,i) => {return this.yScale(d.audioLevel)})
    .attr("width",(d,i) => {return this.xScale(1)/4})
    .attr("height",(d,i) => {return - this.yScale(d.audioLevel) + this.yScale(this.minLevel)}).attr('fill',"yellow");

  }
  private clicked(target) {
    var coords = D3.mouse(this);
    console.log(coords);
  }

}
