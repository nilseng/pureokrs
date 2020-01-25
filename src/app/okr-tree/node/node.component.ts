import { Component, OnInit, Input, Output, ViewChild, ElementRef, AfterViewInit, HostListener, EventEmitter, Inject } from '@angular/core';
import { Node } from './node';
import { OkrService } from '../../okr.service';
import { KeyResult } from '../../okr/okr';
import * as d3 from 'd3';
import { HierarchyPointNode } from 'd3';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: '[okrTreeNode]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit, AfterViewInit {
  faPen = faPen;

  @Input() okrTreeNode: HierarchyPointNode<Node>;
  @Output() nodeShow = new EventEmitter<HierarchyPointNode<Node>>();
  @Output() nodeHide = new EventEmitter<HierarchyPointNode<Node>>();

  @ViewChild('nodeVisual', {static: false}) nodeVisual: ElementRef;
  @ViewChild('text', {static: false}) textEl: ElementRef;
  @ViewChild('rect', {static: false}) rectEl: ElementRef;
  @ViewChild('progress', {static: false}) progressEl: ElementRef;
  @ViewChild('showChildrenLink', {static: false}) childrenLink: ElementRef;

  keyResults: {};
  progress: number;

  maxLines: number;
  text: string;
  words: string[] = [];

  X: number;
  Y: number;
  cx: number;
  cy: number;
  texty: number;

  childrenVisible: boolean;

  _options: { width, height } = { width: 800, height: 600 };

  constructor(
    private okrService: OkrService
  ) { }

  ngOnInit() {
    this.maxLines = 3;
    this.X = this.okrTreeNode.x + this.okrTreeNode.data.offsetX;
    this.Y = this.okrTreeNode.y + this.okrTreeNode.data.offsetY;
    this.cx = this.X + this.okrTreeNode.data.width / 2;
    this.cy = this.Y + this.okrTreeNode.data.height;
    this.texty = this.Y + this.okrTreeNode.data.height / 2;

    this.childrenVisible = false;

    this.getProgress();
    this.showChildrenLink()
  }

  ngAfterViewInit() {
    this.wrapTextinNode();
  }

  showChildrenLink() {
    if (this.okrTreeNode.data.okr.children && this.okrTreeNode.data.okr.children.length > 0) {
      d3.select(this.childrenLink.nativeElement).style('cursor', 'pointer');
    }
  }

  showChildren() {
    if (this.okrTreeNode.children && this.okrTreeNode.children.length > 0) {
      this.nodeHide.emit(this.okrTreeNode);
    } else {
      this.nodeShow.emit(this.okrTreeNode);
    }
  }

  wrapTextinNode() {
    //Get the full text from the svg text element
    this.text = this.okrTreeNode.data.okr.objective;

    //Calculate number of chars per line
    let lineChars = Math.floor(this.okrTreeNode.data.width / 6);//Math.floor(chars / this.lineNum) - 1;

    //Clear the svg text element and initialize variables
    this.textEl.nativeElement.innerHTML = '';
    let line = '';
    let lineEl = null;
    let lineCount = 1;

    //Create the initial tspan element in the text element
    lineEl = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
    lineEl.setAttribute('x', this.cx);
    lineEl.setAttribute('y', this.texty - this.textEl.nativeElement.getAttribute('font-size'));

    //Create array of words in node text and remove empty words
    this.words = this.text.split(' ')
      .filter(word => word.length > 0);

    //Append word to tspan element until the tspan is longer than the nodeWidth 
    for (let word in this.words) {
      if (lineCount > this.maxLines) {
        break;
      }
      //If the word is empty, go to next word
      else if (!this.words[word] || this.words[word] === '') {
        continue;
      }
      else if ((line + ' ' + this.words[word]).length <= lineChars) {
        line += ' ' + this.words[word];
        if (+word == this.words.length - 1) {
          lineEl.innerHTML = line;
          this.textEl.nativeElement.append(lineEl);
          lineCount++;
        }
      } else if (line.length > lineChars) {
        lineEl.innerHTML = line.substring(0, lineChars - 3) + '...';
        this.textEl.nativeElement.append(lineEl);
        lineCount++;
        line = this.words[word];
        lineEl = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        lineEl.setAttribute('x', this.cx);
        lineEl.setAttribute('dy', this.textEl.nativeElement.getAttribute('font-size'));
      }
      else if ((line + ' ' + this.words[word]).length > lineChars && line.length > 0) {
        lineEl.innerHTML = line;
        if (lineCount === this.maxLines) lineEl.innerHTML += '...';
        this.textEl.nativeElement.append(lineEl);
        lineCount++;
        line = this.words[word];
        lineEl = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        lineEl.setAttribute('x', this.cx);
        lineEl.setAttribute('dy', this.textEl.nativeElement.getAttribute('font-size'));
        if (+word == this.words.length - 1 && lineCount <= this.maxLines) {
          line = this.words[word];
          if (line.length > lineChars) {
            lineEl.innerHTML = line.substring(0, lineChars - 3) + '...';
          } else {
            lineEl.innerHTML = line;
          }
          this.textEl.nativeElement.append(lineEl);
          lineCount++;
        }
      } else {
        line = this.words[word];
        if (+word == this.words.length - 1) {
          lineEl.innerHTML = line.substring(0, lineChars - 3) + '...';
          this.textEl.nativeElement.append(lineEl);
          lineCount++;
        }
      }
    }
  }

  getProgress(): void {
    if (this.okrTreeNode.data.okr._id) {
      let sum = 0;
      let count = 0;
      this.okrTreeNode.data.okr.keyResults
        .forEach(kr => {
          if (kr.progress) {
            sum += kr.progress;
          }
          count += 1;
        });
      this.progress = Math.round(sum / count)/100;
      if (this.progress && this.progress > 0) {
        this.calculateProgressCircle();
      }
    }
  }

  calculateProgressCircle() {
    let x1 = this.cx;
    let r = 9;
    let y1 = this.cy;
    if (this.progress === 1) {
      let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
      circle.setAttribute('cx', '' + x1);
      circle.setAttribute('cy', '' + y1);
      circle.setAttribute('r', '9');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', '#5cb85c');
      circle.setAttribute('stroke-width', '2');
      this.nodeVisual.nativeElement.append(circle);
    } else {
      let x2 = x1 + r * Math.sin(2 * Math.PI * this.progress);
      let y2 = y1 - r * Math.cos(2 * Math.PI * this.progress);
      if (this.progress <= 0.5) {
        this.progressEl.nativeElement.setAttribute('d', 'M' + x1 + ',' + (y1 - r) + ' A' + r + ',' + r + ' 1,0,1 ' + x2 + ',' + y2);
      } else {
        this.progressEl.nativeElement.setAttribute('d', 'M' + x1 + ',' + (y1 - r) + ' A' + r + ',' + r + ' 1,1,1 ' + x2 + ',' + y2);
      }

    }
  }
}
