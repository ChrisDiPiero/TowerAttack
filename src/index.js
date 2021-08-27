import Phaser from 'phaser';
import Squirrel from './Squirrels'
import BadGuy from './BadGuy'

let map; //declared here to grant access to update method
let tileSelect; //declared here to grant access to update method

let graphics; // used in create to view path - remove when done
let path; // used in create to make path

//vars to create squirrel and badGuy instances and groups
let addSquirrel;
let addBadGuy;
let enemyGroup;

let count = 1;
let thisTimer = 4000;

const addBadGuyTimer = Phaser.Time.TimerEvent; //timer to create bad guy in group

class MyGame extends Phaser.Scene{
  constructor ()
  {
    super();
  }

  preload ()
  {
    this.load.image('tiles', 'src/assets/tiles.png');
    this.load.image('badGuy', 'src/assets/badguy.svg');
    this.load.image('squirrel', 'src/assets/goodguys.svg');
  }
    
  create () {
    //main grid
    const board = [
      [7, 8, 9, 0, 10, 8, 7, 8, 8, 9, 7, 7, 8, 9, 6],
      [6, 8, 9, 0, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
      [7, 7, 7, 0, 7, 7, 7, 4, 1, 1, 1, 1, 5, 7, 7],
      [7, 7, 7, 0, 7, 7, 7, 0, 7, 7, 7, 7, 0, 7, 7],
      [7, 7, 7, 0, 7, 7, 7, 2, 1, 1, 5, 7, 0, 7, 7],
      [7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 0, 7, 0, 7, 7],
      [7, 7, 7, 2, 1, 1, 1, 1, 1, 1, 3, 7, 0, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 7, 7],
      [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 0, 7, 7]
    ];

    // populate the tiles
    map = this.make.tilemap({ data: board,  tileWidth: 60, tileHeight: 60 });
    const tileset = map.addTilesetImage('metal.png', 'tiles', 60, 60);
    const layer = map.createLayer( 0, tileset, 0, 0 );

    //make path
    let graphics = this.add.graphics(); // temp to see path

    path = this.add.path(210, -30);
    path.lineTo(210, 390);
    path.lineTo(630, 390);
    path.lineTo(630, 270);
    path.lineTo(450, 270);
    path.lineTo(450, 150);
    path.lineTo(750, 150);
    path.lineTo(750, 630);
    
    graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    path.draw(graphics);

    //add enemy line follower
    // let badGuy = this.add.follower(path, 210, -30, 'enemy');

    // badGuy.startFollow({
    //   duration: 5000,
    //   rotateToPath: true,
    //   verticalAdjust: true
    // })

    //add code to highlight selected tile for tower placement
    tileSelect = this.add.graphics();
    tileSelect.lineStyle(2, 0x000000, 1);
    tileSelect.strokeRect(0, 0, map.tileWidth * layer.scaleX, map.tileHeight * layer.scaleY);

    // create functions initialized here to bind 'this'
    addSquirrel = (x, y) => {
      this.add.squirrel(x, y)
    }

    let runLog = () => this.children.list;

    addBadGuy = (path, x, y, name) => {
      this.add.badGuy(path, x, y, name);
      console.log(runLog());
    }

    // group creation
    enemyGroup = this.add.group();
  }

  update (time, delta) {
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    let pointerTileX = map.worldToTileX(worldPoint.x);
    let pointerTileY = map.worldToTileY(worldPoint.y);

    // Snap to tile coordinates, but in world space
    tileSelect.x = map.tileToWorldX(pointerTileX);
    tileSelect.y = map.tileToWorldY(pointerTileY);

    if (this.input.manager.activePointer.isDown) {
      addSquirrel(pointerTileX * 60 + 30, pointerTileY * 60 + 30);
    }

    if (thisTimer * count < time) {
      addBadGuy(path, 210, -30, count);
      count++;
    }

    //addBadGuy(path, 210, 30);

    // badGuy.startFollow({
    //   duration: 5000,
    //   rotateToPath: true,
    //   verticalAdjust: true      
    // })
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 900,
  height: 600,
  scene: MyGame
};

const game = new Phaser.Game(config);
