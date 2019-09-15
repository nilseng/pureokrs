import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent implements OnInit{
  @Input('nodeVisual') node: Node;

  ngOnInit(){
    
  }
}
