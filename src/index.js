import Phaser from 'phaser';
import Squirrel from './Squirrels';
import BadGuy from './BadGuy';
import Nut from './Nut'

let map; //declared here to grant access to update method
let tileSelect; //declared here to grant access to update method

let graphics; // used in create to view path - remove when done
let path; // used in create to make path

//vars to create squirrel, badGuy, and nut instances, groups, and arrays
let addBadGuy;
let badGuyGroup;
let badGuyArray = [];
let addSquirrel;
let squirrelGroup;
let squirrelArray = [];
let addNut;
let nutGroup;
let nutGroupArray;

// timer counts used in update - declared here to prevent reset
let badGuyCount = 1;
let fireNutCount = 1;

// declared functions to expand scope
let getTarget;

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
    this.load.image('nut', 'src/assets/nuts.svg');
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
    
    // visualize the path
    graphics.lineStyle(3, 0xffffff, 1);
    path.draw(graphics);

    //add code to highlight selected tile for tower placement
    tileSelect = this.add.graphics();
    tileSelect.lineStyle(2, 0x000000, 1);
    tileSelect.strokeRect(0, 0, map.tileWidth * layer.scaleX, map.tileHeight * layer.scaleY);

    // create functions initialized here to bind 'this'
    addSquirrel = (x, y, group) => {
      this.add.squirrel(x, y, group)
    }

    squirrelGroup = this.physics.add.group();

    addBadGuy = (path, x, y, name, group) => {
      this.add.badGuy(path, x, y, name, group);
    }

    badGuyGroup = this.physics.add.group();

    addNut = (x, y, target, group) => {
      this.add.nut(x, y, target, group);
    }

    nutGroup = this.physics.add.group();

    //test to see if a squirrel is already in place
    const isSquirrelHere = (x, y) => {
      squirrelArray = squirrelGroup.children.entries;
      if(squirrelArray.length) {
        return squirrelArray.find( (i) => i.x === x && i.y === y)
      }
    }


    // test to see if squirrel allowed on tile (isSquirrelHere and road tile)
    this.input.on('pointerdown', function (pointer) {
      let clickedTileIndex = map.getTileAtWorldXY(pointer.worldX, pointer.worldY).index;
      if (clickedTileIndex > 6 && !isSquirrelHere(tileSelect.x + 30, tileSelect.y + 30)) {
        addSquirrel(tileSelect.x + 30, tileSelect.y + 30, squirrelGroup);
      } else {
        console.log("no squirrel for you!")
      }
    });

    // set target for each squirrel
    getTarget = function (x, y, distance) {
      for(let i = 0; i < badGuyArray.length; i++) {       
          if(badGuyArray[i].alive && Phaser.Math.Distance.Between(x, y, badGuyArray[i].x, badGuyArray[i].y) <= distance)
              return badGuyArray[i];
      }
      return false;
    }
  }

  update (time, delta) {
    const worldPoint = this.input.activePointer.positionToCamera(this.cameras.main);

    // Rounds down to nearest tile
    let pointerTileX = map.worldToTileX(worldPoint.x);
    let pointerTileY = map.worldToTileY(worldPoint.y);
    
    // Snap to tile coordinates, but in world space
    tileSelect.x = map.tileToWorldX(pointerTileX);
    tileSelect.y = map.tileToWorldY(pointerTileY);

    // code  to rotate to squirrels' targets
    Phaser.Actions.Call(squirrelArray, function(e) {
      let theTarget = getTarget(e.x, e.y, 200);
      e.setTarget(theTarget);

      if (!e.target) {
			  return
		  }

      const tx = e.target.x;
      const ty = e.target.y;

      const x = e.x;
      const y = e.y;

      const rotation = Phaser.Math.Angle.Between(x, y, tx, ty);
      e.setRotation(rotation);
    }, this);

    // fires nut at regular intervals
    if (2000 * fireNutCount < time && squirrelArray.length) {
      Phaser.Actions.Call(squirrelArray, function(e) {
        addNut(e.x, e.y, e.target, nutGroup);
      })
    }

    if (2000 * badGuyCount < time) {
      addBadGuy(path, 210, -30, badGuyCount, badGuyGroup);
      badGuyArray = badGuyGroup.children.entries;
      badGuyCount++;
    }
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'content',
  width: 900,
  height: 600,
  physics: {
    default: 'arcade'
  },
  scene: MyGame
};

const game = new Phaser.Game(config);
