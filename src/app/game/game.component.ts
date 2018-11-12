import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener } from '@angular/core';
import * as io from 'socket.io-client';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  @ViewChild('ctx') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;

  @HostListener('window:keyup', ['$event'])
  keyUpEvent(event: KeyboardEvent) {
        if (event.keyCode === 68) { //d
          this.socket.emit('keyPress', {inputId:'right',state:false});
        } else if (event.keyCode === 83) { //s
          this.socket.emit('keyPress', {inputId:'down',state:false});
        } else if (event.keyCode === 65) { //a
          this.socket.emit('keyPress', {inputId:'left',state:false});
        } else if (event.keyCode === 87) { //w
          this.socket.emit('keyPress', {inputId:'up',state:false});
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {
        if (event.keyCode === 68) { //d
          this.socket.emit('keyPress', {inputId:'right',state:true});
        } else if (event.keyCode === 83) { //s
          this.socket.emit('keyPress', {inputId:'down',state:true});
        } else if (event.keyCode === 65) { //a
          this.socket.emit('keyPress', {inputId:'left',state:true});
        } else if (event.keyCode === 87) { //w
          this.socket.emit('keyPress', {inputId:'up',state:true});
        }
  }
  

  private socket;

  constructor() { }

  ngOnInit() {
    console.log('Game Component Loading....');

    this.socket = io(`http://localhost:2000`);

    this.socket.on('newPositions', (data)=>{
        this.context.clearRect(0,0,500,500);
        for (var i = 0; i < data.length; i++){
            this.context.fillText(data[i].num, data[i].x, data[i].y);
        }
    });

  }

  ngAfterViewInit(){
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    this.context.font = '30px Arial';
    this.context.fillText("TESTING", 200, 200);
  }

}
