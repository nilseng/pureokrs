import { Component, OnInit, Input, Output, ViewChild, ElementRef, AfterViewInit, HostListener, EventEmitter } from '@angular/core';
import { Node } from './node';
import { OkrService } from '../../okr.service';
import { KeyResult } from '../../okr/okr';

@Component({
  selector: '[node]',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.css']
})
export class NodeComponent implements OnInit, AfterViewInit {
  @Input() node: Node;
  @Output() nodeShow = new EventEmitter<Node>();
  @Output() nodeHide = new EventEmitter<Node>();

  @ViewChild('nodeVisual') nodeVisual: ElementRef;
  @ViewChild('text') textEl: ElementRef;
  @ViewChild('rect') rectEl: ElementRef;
  @ViewChild('progress') progressEl: ElementRef;

  keyResults: {};
  progress: number;

  maxLines: number;
  text: string;
  words: string[] = [];

  private _options: { width, height } = { width: 800, height: 600 };

  constructor(private okrService: OkrService) { }

  ngOnInit() {
    this.maxLines = 3;
  }

  ngAfterViewInit() {
    this.wrapTextinNode();
    this.getProgress();
  }

  wrapTextinNode() {
    //Get the full text from the svg text element
    this.text = this.node.okr.objective;

    //Calculate number of chars per line
    let lineChars = Math.floor(this.node.width / 6);//Math.floor(chars / this.lineNum) - 1;

    //Clear the svg text element and initialize variables
    this.textEl.nativeElement.innerHTML = '';
    let line = '';
    let lineEl = null;
    let lineCount = 1;

    //Create the initial tspan element in the text element
    lineEl = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
    lineEl.setAttribute('x', this.node.x);
    lineEl.setAttribute('y', this.node.centerY + 1 * this.textEl.nativeElement.getAttribute('font-size'));

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
        lineEl.setAttribute('x', this.node.x);
        lineEl.setAttribute('dy', this.textEl.nativeElement.getAttribute('font-size'));
      }
      else if ((line + ' ' + this.words[word]).length > lineChars && line.length > 0) {
        lineEl.innerHTML = line;
        if (lineCount === this.maxLines) lineEl.innerHTML += '...';
        this.textEl.nativeElement.append(lineEl);
        lineCount++;
        line = this.words[word];
        lineEl = document.createElementNS("http://www.w3.org/2000/svg", 'tspan');
        lineEl.setAttribute('x', this.node.x);
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
    this.okrService.getKeyResults(this.node.okr._id)
      .subscribe(krs => {
        this.keyResults = krs;
        if (krs) {
          let sum = 0;
          let count = 0;
          for (let i in krs) {
            if (krs[i].progress) {
              sum += krs[i].progress;
            }
            count += 1;
          }
          this.progress = Math.round(sum / count) / 100;
          if (this.progress && this.progress > 0) {
            this.calculateProgressCircle();
          }
        }
      });
  }

  calculateProgressCircle() {
    let x1 = this.node.x;
    let r = 9;
    let y1 = (this.node.y + this.node.height / 2 - r);
    if (this.progress === 1) {
      let circle = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
      circle.setAttribute('cx', '' + this.node.cx);
      circle.setAttribute('cy', '' + this.node.cy);
      circle.setAttribute('r', '9');
      circle.setAttribute('fill', 'none');
      circle.setAttribute('stroke', '#5cb85c');
      circle.setAttribute('stroke-width', '2');
      this.nodeVisual.nativeElement.append(circle);
    } else {
      let x2 = x1 + r * Math.sin(2 * Math.PI * this.progress);
      let y2 = this.node.y - r * Math.cos(2 * Math.PI * this.progress) + this.node.height / 2;
      if(this.progress<=0.5){
        this.progressEl.nativeElement.setAttribute('d', 'M' + x1 + ',' + y1 + ' A' + r + ',' + r + ' 1,0,1 ' + x2 + ',' + y2);
      }else{
        this.progressEl.nativeElement.setAttribute('d', 'M' + x1 + ',' + y1 + ' A' + r + ',' + r + ' 1,1,1 ' + x2 + ',' + y2);
      }
      
    }
  }

  showChildren(): void {
    if(this.node.showChildren){
      this.nodeHide.emit(this.node);
    }else{
      this.nodeShow.emit(this.node);
    }
    this.node.showChildren = !this.node.showChildren;
  }
}
